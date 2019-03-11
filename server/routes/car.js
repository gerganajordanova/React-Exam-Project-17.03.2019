const express = require('express')
const authCheck = require('../config/auth-check')
const Car = require('../models/Car')

const router = new express.Router()

function validateCarCreateForm(payload) {
  const errors = {}
  let isFormValid = true
  let message = ''

  payload.price = parseFloat(payload.price)

  if (!payload || typeof payload.model !== 'string' || payload.model.length < 1) {
    isFormValid = false
    errors.name = 'Car model must be at least 1 symbols.'
  }

  

  if (!payload || !payload.price || payload.price < 0) {
    isFormValid = false
    errors.price = 'Price must be a positive number.'
  }

  

  if (!isFormValid) {
    message = 'Check the form for errors.'
  }

  return {
    success: isFormValid,
    message,
    errors
  }
}

router.post('/create', authCheck, (req, res) => {
  const carObj = req.body
  if (req.user.roles.indexOf('Admin') > -1) {
    const validationResult = validateCarCreateForm(carObj)
    if (!validationResult.success) {
      return res.status(200).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      })
    }

    Car
      .create(carObj)
      .then((createdCar) => {
        res.status(200).json({
          success: true,
          message: 'Car added successfully.',
          data: createdCar
        })
      })
      .catch((err) => {
        console.log(err)
        let message = 'Something went wrong :( Check the form for errors.'
        if (err.code === 11000) {
          message = 'Book with the given name already exists.'
        }
        return res.status(200).json({
          success: false,
          message: message
        })
      })
  } else {
    return res.status(200).json({
      success: false,
      message: 'Invalid credentials!'
    })
  }
})

router.post('/edit/:id', authCheck, (req, res) => {
  if (req.user.roles.indexOf('Admin') > -1) {
    const carId = req.params.id
    const carObj = req.body
    const validationResult = validateCarCreateForm(carObj)
    if (!validationResult.success) {
      return res.status(200).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      })
    }

    Car
      .findById(carId)
      .then(existingCar => {
        existingCar.model = carObj.model
        existingCar.year = carObj.year
        existingCar.price = carObj.price
        existingCar.image = carObj.image

        existingCar
          .save()
          .then(editedCar => {
            res.status(200).json({
              success: true,
              message: 'Car edited successfully.',
              data: editedCar
            })
          })
          .catch((err) => {
            console.log(err)
            let message = 'Something went wrong :( Check the form for errors.'
            if (err.code === 11000) {
              message = 'Car with the given model already exists.'
            }
            return res.status(200).json({
              success: false,
              message: message
            })
          })
      })
      .catch((err) => {
        console.log(err)
        const message = 'Something went wrong :( Check the form for errors.'
        return res.status(200).json({
          success: false,
          message: message
        })
      })
  } else {
    return res.status(200).json({
      success: false,
      message: 'Invalid credentials!'
    })
  }
})

router.get('/all', (req, res) => {
  Car
    .find({})
    .then(cars => {
      res.status(200).json(cars)
    })
})


router.post('/like/:id', authCheck, (req, res) => {
  const id = req.params.id
  const username = req.user.username
  Car
    .findById(id)
    .then(car => {
      if (!car) {
        const message = 'Product not found.'
        return res.status(200).json({
          success: false,
          message: message
        })
      }

      let likes = car.likes
      if (!likes.includes(username)) {
        likes.push(username)
      }
      car.likes = likes
      car
        .save()
        .then((car) => {
          res.status(200).json({
            success: true,
            message: 'Car liked successfully.',
            data: car
          })
        })
        .catch((err) => {
          console.log(err)
          const message = 'Something went wrong :('
          return res.status(200).json({
            success: false,
            message: message
          })
        })
    })
    .catch((err) => {
      console.log(err)
      const message = 'Something went wrong :('
      return res.status(200).json({
        success: false,
        message: message
      })
    })
})

router.post('/unlike/:id', authCheck, (req, res) => {
  const id = req.params.id
  const username = req.user.username
  Car
    .findById(id)
    .then(car => {
      if (!car) {
        let message = 'Product not found.'
        return res.status(200).json({
          success: false,
          message: message
        })
      }

      let likes = car.likes
      if (likes.includes(username)) {
        const index = likes.indexOf(username)
        likes.splice(index, 1)
      }

      car.likes = likes
      car
        .save()
        .then((car) => {
          res.status(200).json({
            success: true,
            message: 'Product unliked successfully.',
            data: car
          })
        })
        .catch((err) => {
          console.log(err)
          const message = 'Something went wrong :('
          return res.status(200).json({
            success: false,
            message: message
          })
        })
    })
    .catch((err) => {
      console.log(err)
      const message = 'Something went wrong :('
      return res.status(200).json({
        success: false,
        message: message
      })
    })
})

router.delete('/delete/:id', authCheck, (req, res) => {
  const id = req.params.id
  if (req.user.roles.indexOf('Admin') > -1) {
    Car
      .findById(id)
      .then((car) => {
        car
          .remove()
          .then(() => {
            return res.status(200).json({
              success: true,
              message: 'Car deleted successfully!'
            })
          })
      })
      .catch(() => {
        return res.status(200).json({
          success: false,
          message: 'Entry does not exist!'
        })
      })
  } else {
    return res.status(200).json({
      success: false,
      message: 'Invalid credentials!'
    })
  }
})

module.exports = router

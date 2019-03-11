import toastr from 'toastr'

function createProductValidator (model, year, price) {
  if (model.length < 1 || model === '') {
    toastr.error('Model must be at least 3 characters long')
    return false
  }
  
  
  
  if (!year) {
    toastr.error('Year is required!')
    return false
  }

  if (!price || price < 0) {
    toastr.error('Price must be a positive number')
    return false
  }

  return true
}

export default createProductValidator

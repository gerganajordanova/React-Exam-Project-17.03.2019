import React from 'react'
import CarCard from './CarCard'

const CarCardList = (props) => {
  let allCar = props.products
  let carCardList = []
  for (let i = 0; i < allCar.length; i += 3) {
    let carCards = allCar.slice(i, Math.min(i + 3, allCar.length))
      .map(p => (
        <CarCard
          key={p._id}
          id={p._id}
          model={p.model}
          image={p.image}
          year={p.year}
         />))

    let cardDeck = <div key={i} className='card-deck space-top'>{carCards}</div>
    carCardList.push(cardDeck)
  }


  return (
    <div className='cars'>
      {carCardList}
    </div>
  )
}

export default CarCardList

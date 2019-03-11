import React, { Component } from 'react'
import CarCardList from '../common/Car/CarCardList'
import Auth from '../../utils/auth'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'

class HomePage extends Component {
  render () {
    const isAdmin = Auth.isUserAdmin()
    const isAuthenticated = Auth.isUserAuthenticated()

    let headingText, secondLinkName, secondLinkPath
    if (isAdmin) {
      headingText = ', ' + Auth.getUsername()
      secondLinkName = 'View pending orders'
      secondLinkPath = '/admin/orders'
    } else if (isAuthenticated) {
      headingText = ', ' + Auth.getUsername()
      secondLinkName = 'View your orders'
      secondLinkPath = '/orders'
    } else {
      headingText = ''
      secondLinkName = 'Register'
      secondLinkPath = '/register'
    }

    const startIndex = 0
    const pageSize = 6
    const carCards = this.props.products
      .sort((a, b) => b.likes.length - a.likes.length)
      .slice(startIndex, pageSize)

    return (
      <div className='welcome-wrapper'>
          <div className='welcome'>
            <h1>Welcome to  CarRental{headingText} !</h1>
            {!isAuthenticated && <p>Your car is now just a few clicks away. Register now and choose from our store.</p>}
            <p>
              <Link to='/store'>Go To Store</Link>
              <Link to={secondLinkPath}>{secondLinkName}</Link>
            </p>
          </div>
        <h2>Top Rated</h2>
        <CarCardList products={carCards} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    products: state.products
  }
}

export default connect(mapStateToProps)(HomePage)

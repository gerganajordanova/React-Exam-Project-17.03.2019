import React, { Component } from 'react'
import Auth from '../../../utils/auth'
import {deleteProductAction} from '../../../actions/productsActions'
import { addToCartAction } from '../../../actions/cartActions'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'

class CarCard extends Component {
  constructor (props) {
    super(props)

    this.onOrderButtonClick = this.onOrderButtonClick.bind(this)
    this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this)
  }

  onOrderButtonClick (e) {
    if (Auth.isUserAuthenticated()) {
      this.props.addToCart(this.props.id)
      this.props.history.push('/cart')
    } else {
      this.props.history.push('/login')
    }
  }

  onDeleteButtonClick (e) {
    this.props.deleteProduct(this.props.id)
  }

  render () {
    const { id, model, image} = this.props
    let footer
    if (Auth.isUserAdmin()) {
      footer = (
        <div className='card-footer'>
          
          <button onClick={this.onDeleteButtonClick} className='btn btn-danger float-right btn-sm'><i className='fa fa-trash' /></button>
          <Link to={`/admin/edit/${id}`} className='btn btn-warning float-right btn-sm'><i className='fa fa-edit' /></Link>
        </div>
      )
    } else {
      footer = (
        <div className='card-footer'>
          <Link to={`/details/${id}`} type='button' className='btn btn-primary float-right btn-sm'>Details</Link>
          <button type='button' className='btn btn-warning float-right btn-sm' onClick={this.onOrderButtonClick}>Order</button>
        </div>
      )
    }

    return (
      <div className='card col-4'>  
        <div className='card-body'>
        <p className='card-text'>{model}</p>
        <img className='card-img-top card-image' src={image} alt={model} />     
        </div>
        {footer}
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    addToCart: (id) => dispatch(addToCartAction(id)),
    deleteProduct: (id) => dispatch(deleteProductAction(id))
  }
}

export default withRouter(connect(() => { return {} }, mapDispatchToProps)(CarCard))

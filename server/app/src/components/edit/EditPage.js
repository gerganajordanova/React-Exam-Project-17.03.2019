import React, {Component} from 'react'
import Input from '../common/Input'
import toastr from 'toastr'
import createProductValidator from '../../utils/createProductValidator'
import NotFoundPage from '../common/NotFound/NotFoundPage'
import {createProductValidationFunc} from '../../utils/formValidator'
import {editProductAction, fetchProductsAction} from '../../actions/productsActions'
import {redirectAction} from '../../actions/authActions'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

class EditPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      model: '',
      year: '',
      price: '',
      image: ''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillMount () {
    const productId = this.props.match.params.id
    let product = this.props.products.find(p => p._id === productId)
    if (product) {
      this.setState({
        model: product.model,
        year: product.year,
        price: product.price.toFixed(2),
        image: product.image
      })
    } else {
      this.props.fetchProducts()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.editProductError.hasError) {
      toastr.error(nextProps.editProductError.message)
    } else if (nextProps.editProductSuccess) {
      this.props.redirect()
      toastr.success('Product edited successfully')
      this.props.history.push('/store')
    } else {
      const productId = this.props.match.params.id
      let product = this.props.products.find(p => p._id === productId)
      if (product) {
        this.setState({
          title: product.model,
          year: product.year,
          price: product.price.toFixed(2),
          image: product.image
        })
      }
    }
  }

  onChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit (e) {
    e.preventDefault()
    if (!createProductValidator(this.state.model, this.state.year,
      this.state.image, this.state.price)) {
      return
    }
    this.props.editProduct(this.props.match.params.id, this.state.model, this.state.year,
      this.state.image,  this.state.price)
  }

  render () {
    let productId = this.props.match.params.id
    let product = this.props.products.find(o => o._id === productId)
    if (!product) {
      return (
        <NotFoundPage errMessage='PRODUCT NOT FOUND' />
      )
    }

    let validObj = createProductValidationFunc(
      this.state.model,
      this.state.year,
      this.state.image,
      this.state.price
    )

    return (
      <div className='form-wrapper'>
        <h1>Edit Book</h1>
        <form onSubmit={this.onSubmit}>
              <Input
                type='text'
                name='model'
                label='Model'
                placeholder='Enter car model'
                value={this.state.model}
                onChange={this.onChange}
                valid={validObj.validModel} />
            
              <Input
                type='text'
                name='year'
                label='Year'
                placeholder='Enter car year'
                value={this.state.year}
                onChange={this.onChange}
                valid={validObj.validYear} />
              <Input
                type='text'
                name='image'
                label='Image URL'
                placeholder='Enter car image URL'
                value={this.state.image}
                onChange={this.onChange}
                valid={validObj.validImage} />
             
              <Input
                type='number'
                name='price'
                label='Price'
                placeholder='Enter book price'
                value={this.state.price}
                onChange={this.onChange}
                valid={validObj.validPrice} />
              <input type='submit' value='Edit'/>
        </form>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    editProductSuccess: state.editProduct.success,
    editProductError: state.editProductError,
    products: state.products
  }
}

function mapDispatchToProps (dispatch) {
  return {
    editProduct: (id, model,year, image, price) => {
      dispatch(editProductAction(id, {id, model, year, image, price}))
    },
    redirect: () => dispatch(redirectAction()),
    fetchProducts: () => dispatch(fetchProductsAction())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPage))

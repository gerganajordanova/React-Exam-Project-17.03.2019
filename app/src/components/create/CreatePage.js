import React, {Component} from 'react'
import Input from '../common/Input'
import toastr from 'toastr'
import createProductValidator from '../../utils/createProductValidator'
import {createProductValidationFunc} from '../../utils/formValidator'
import {createProductAction} from '../../actions/productsActions'
import {redirectAction} from '../../actions/authActions'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

class CreatePage extends Component {
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

  componentWillReceiveProps (nextProps) {
    if (nextProps.createProductError.hasError) {
      toastr.error(nextProps.createProductError.message)
    } else if (nextProps.createProductSuccess) {
      this.props.redirect()
      toastr.success('Car created successfully')
      this.props.history.push('/store')
    }
  }

  onChange (e) {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit (e) {
    e.preventDefault()
    if (!createProductValidator(this.state.model, 
      this.state.year, this.state.image,  this.state.price)) {
      return
    }
    this.props.createProduct(this.state.model, 
      this.state.year, this.state.image, this.state.price)
  }

  render () {
    let validObj = createProductValidationFunc(
      this.state.model,
      this.state.year,
      this.state.image,
      this.state.price
    )

    return (
      <div className='form-wrapper'>
        <h1>Create New Car</h1>
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
                placeholder='Enter year '
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
                placeholder='Enter car price'
                value={this.state.price}
                onChange={this.onChange}
                valid={validObj.validPrice} />
              <input type='submit' value='Create' />
        </form>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    createProductSuccess: state.createProduct.success,
    createProductError: state.createProductError
  }
}

function mapDispatchToProps (dispatch) {
  return {
    createProduct: (model, year, image, price) => {
      dispatch(createProductAction({model,year, image,  price}))
    },
    redirect: () => dispatch(redirectAction())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePage))

import React, { Component } from 'react'
import CarCardList from '../common/Car/CarCardList'
import Paginator from '../common/Paginator'
import { connect } from 'react-redux'

class StorePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }

    this.onChange = this.onChange.bind(this)
  }

  onChange (e) {
    this.setState({ [e.target.model]: e.target.value })
  }

  render () {
    let { products, stats } = this.props
    products = products.sort((a, b) => a.model.localeCompare(b.model))
    let productsCount = stats.productsCount
    const page = Number(this.props.match.params.page) || 1
    let query = this.state.query
    if (query !== '') {
      products = products.filter(p => p.model.toLowerCase().includes(query.toLowerCase()))
      productsCount = products.length
    }

    const pageSize = 9
    products = products.slice((page - 1) * pageSize, page * pageSize)

    return (
      <div className='container'>
        <div className='row space-top'>
          <div className='col-md-12'>
            <h1 className='jumbotron-heading text-center'>Store</h1>
          </div>
        </div>
        <CarCardList products={products} />
        <Paginator
          productsCount={productsCount}
          pageSize={pageSize}
          current={page} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    products: state.products,
    stats: state.stats
  }
}

export default connect(mapStateToProps)(StorePage)

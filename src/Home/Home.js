import React, { Component} from 'react';
import './Home.css'

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };

    
  }

  componentDidMount() {
    fetch('http://localhost:9999', {
      method: 'GET'
    })
      .then((response) => response.json())
      .catch(console.log);
  }

  render() {


    return (
      <div className="Home">
      
      </div>
    );
  }
}

export default Home;

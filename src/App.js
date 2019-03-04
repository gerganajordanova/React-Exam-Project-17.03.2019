import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import NotFound from './NotFound';

import Home from './Home/Home';
import Header from './Header/Header';
import Login from './Login/Login';
import Register from './Register/Register';


import './App.css';
import 'react-toastify/dist/ReactToastify.min.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        isLoggedIn: false,
        username: '',
        userId: '',
        token: '',
        isAdmin: false,
      },
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  login(user) {    
    fetch('http://localhost:9999/auth/signin', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        
        if(!data.token || !data.username || !data.userId) {
          toast.error(data.message);
          return;
        }
        
        localStorage.setItem('username', data.username);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', data.isAdmin);

        this.setState({
          user: {
            isLoggedIn: true,
            username: data.username,
            userId: data.userId,
            token: data.token,
            isAdmin: data.isAdmin,
          },
        });      
        
        toast.success(data.message);
      })
      .catch(toast.error);
  }

  logout(event) {
    event.preventDefault();

    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');

    this.setState({
      user: {
        isLoggedIn: false,
        username: '',
        userId: '',
        token: '',
        isAdmin: false,
      },
    });

    toast.success("Logout successful!");
  }

  componentDidMount() {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');

    if(localStorage.getItem('token')) {
      this.setState({
        user: {
          isLoggedIn: true,
          username: username,
          userId: userId,
          token: token,
          isAdmin: isAdmin,
        },
      });      
    }
  }

  render() {
    return (
      <div className="App">
          <Router>
            <Fragment>
              <Header logout={this.logout} user={this.state.user} />
              <ToastContainer closeButton={false} />
              <Switch>
                <Route exact path="/" render={() => <Home user={this.state.user}/>} />
                <Route exact path="/login" render={() => <Login login={this.login} user={this.state.user}/>} />
                <Route exact path="/register" render={() => <Register login={this.login} user={this.state.user}/>} />
                <Route component={NotFound} />
              </Switch>
            </Fragment>
          </Router>
      </div>
    );
  }
}

export default App;

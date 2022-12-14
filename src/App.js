/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 1234567.89,
      debitList: [],
      creditList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    }
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser}
    newUser.userName = logInInfo.userName
    this.setState({currentUser: newUser})
  }
  //Update debit list and accountBalance
  addDebit = (event) => {
    //prevents page refresh
    event.preventDefault();
    //create date obj
    const date = new Date();
    const debitDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
    //create newDebit obj with same fields from API
    let newDebit = {
      "id": Math.floor(Math.random() * 99),
      "description": event.target[0].value,
      "amount": event.target[1].value,
      "date": debitDate
    }
    //set new states
     this.setState({
      accountBalance: this.state.accountBalance - event.target[1].value,
      //debitList is an array of objects, render the api data and then the newDebit object
      debitList: [...this.state.debitList, newDebit]
    });
     
  }

  //Update credit list and accountBalance
  addCredit = (event) => {
    //prevents page refresh
    event.preventDefault();
    //create date obj
    const date = new Date();
    const creditDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
    //create newCredit obj with same fields from API
    let newCredit = {
      "id": Math.floor(Math.random() * 99),
      "description": event.target[0].value,
      "amount": event.target[1].value,
      "date": creditDate
    }
    //set new states
     this.setState({
      accountBalance: this.state.accountBalance + Number(event.target[1].value),
      //creditList is an array of objects, render the api data and then the newCredit object
      creditList: [...this.state.creditList, newCredit]
    });
     
  }


  //make api call
  async componentDidMount() {
    //debits///////////////////////////////////
    const url = "https://moj-api.herokuapp.com/debits";
    fetch(url).then(response => response.json())
    .then((data) => {
      this.setState({debitList: data});
    }) 

    //credit////////////////////////////////////
    const url2 = "https://moj-api.herokuapp.com/credits";
    fetch(url2).then(response => response.json())
    .then((data) => {
      this.setState({creditList: data});
    })
    
  };

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />);
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    );
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const DebitsComponent = () => (<Debits debits={this.state.debitList} accountBalance={this.state.accountBalance} addDebit={this.addDebit}/>) 
    const CreditsComponent = () => (<Credits credits={this.state.creditList} accountBalance={this.state.accountBalance} addCredit={this.addCredit}/>)
    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/CSCI395-Assignment-4-Bank">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;
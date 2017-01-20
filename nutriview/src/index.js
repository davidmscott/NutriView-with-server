import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Popup from 'react-popup';

import Login from './components/login';
import About from './components/about';
import Dates from './components/dates';
import Foods from './components/foods';

const path = 'http://localhost:8000';
// const path = 'https://nutriview-server.herokuapp.com';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foodItems: [],
      dateItems: [],
      summary: {
        fat: 0,
        carbohydrates: 0,
        protein: 0,
        calories: 0
      },
      selectedDate: null,
      user: null,
      token: null,
      route: 'login'
    };
  }

  addFood(search, selectedDate) {
    var data = {
      search,
      selectedDate,
      user: this.state.user
    };
    $.ajax({
      method: 'GET',
      url: `${path}/food`,
      headers: {'x-auth': this.state.token},
      data,
      success: (res, status, xhr) => {
        var newFood = JSON.parse(JSON.parse(res.foodDetail).body);
        newFood.id = res._id;
        var updatedFoodItems = [newFood, ...this.state.foodItems];
        var newSummary = this.summarize(updatedFoodItems);

        this.setState({
          foodItems: updatedFoodItems,
          summary: newSummary,
        });
      }
    }).fail(error => Popup.alert('No results found. The Nutritionix API works best with searches like "1 large apple" or "8 ounce milk" as opposed to searches such as "apple".'));
  }

  deleteFood(id) {
    $.ajax({
      method: "POST",
      url: `${path}/removefood`,
      headers: {'x-auth': this.state.token},
      data: {id},
      success: (data, status, xhr) => {
        this.getFoods(this.state.selectedDate);
      }
    }).fail(error => Popup.alert('Unable to delete entry from the database.'));
  }

  summarize(foodItemArray) {
    if (foodItemArray.length > 1) {
      var fat = foodItemArray.reduce((a, b) => {
        return ( a.totalDaily ? ( a.totalDaily.FAT ? a.totalDaily.FAT.quantity : 0 ) : a ) + ( b.totalDaily.FAT ? b.totalDaily.FAT.quantity : 0 );
      });
      var carbohydrates = foodItemArray.reduce((a, b) => {
        return ( a.totalDaily ? ( a.totalDaily.CHOCDF ? a.totalDaily.CHOCDF.quantity : 0 ) : a ) + ( b.totalDaily.CHOCDF ? b.totalDaily.CHOCDF.quantity : 0 );
      });
      var protein = foodItemArray.reduce((a, b) => {
        return ( a.totalDaily ? ( a.totalDaily.PROCNT ? a.totalDaily.PROCNT.quantity : 0 ) : a ) + ( b.totalDaily.PROCNT ? b.totalDaily.PROCNT.quantity : 0 );
      });
      var calories = foodItemArray.reduce((a, b) => {
        return ( a.calories ? a.calories : ( a.calories == 0 ? a.calories : a )) + b.calories;
      });
    } else {
      var fat = foodItemArray[0].totalDaily.FAT ? foodItemArray[0].totalDaily.FAT.quantity : 0;
      var carbohydrates = foodItemArray[0].totalDaily.CHOCDF ? foodItemArray[0].totalDaily.CHOCDF.quantity : 0;
      var protein = foodItemArray[0].totalDaily.PROCNT ? foodItemArray[0].totalDaily.PROCNT.quantity : 0;
      var calories = foodItemArray[0].calories;
    }

    var newSummary = {
      fat,
      carbohydrates,
      protein,
      calories
    };

    return newSummary;
  }

  getFoods(date) {
    if (date === undefined) {
      var date = this.state.selectedDate;
    }
    $.ajax({
      method: 'GET',
      url: `${path}/foods`,
      headers: {'x-auth': this.state.token},
      data: {date},
      success: (res, status, xhr) => {
        var updatedFoodItems = res.foodList.map(foodItem => {
          var newFood = JSON.parse(JSON.parse(foodItem.foodDetail).body);
          newFood.id = foodItem._id;
          return newFood;
        });
        if (updatedFoodItems.length > 0) {
          var newSummary = this.summarize(updatedFoodItems);

          this.setState({
            foodItems: updatedFoodItems,
            summary: newSummary,
            selectedDate: date
          });
          if (this.state.route !== 'foods') {
            this.setState({route: 'foods'});
          }
        } else {
          this.setState({
            foodItems: [],
            summary: {
              fat: 0,
              carbohydrates: 0,
              protein: 0,
              calories: 0
            },
            selectedDate: date
          });
          if (this.state.route !== 'foods') {
            this.setState({route: 'foods'});
          }
        }
      }
    }).fail(error => Popup.alert('Unable to get foods for selected collection.'));
  }

  addDate(dateInput) {
    if (this.state.dateItems.indexOf(dateInput) === -1) {
      var updatedDateItems = [...this.state.dateItems, dateInput]
    }
    this.setState({
      dateItems: updatedDateItems,
      selectedDate: dateInput,
      route: 'foods'
    });
  }

  getDates() {
    $.ajax({
      method: 'GET',
      url: `${path}/dates`,
      headers: {'x-auth': this.state.token},
      success: (res, status, xhr) => {
        var updatedDateItems = [...res.dateList];
        this.setState({
          dateItems: updatedDateItems,
          selectedDate: null
        });
      }
    }).fail(error => Popup.alert('Unable to fetch list of collections.'));
  }

  deleteDate(date) {
    $.ajax({
      method: "POST",
      url: `${path}/removedate`,
      headers: {'x-auth': this.state.token},
      data: {date},
      success: (data, status, xhr) => {
        this.getDates();
      }
    }).fail(error => Popup.alert('Unable to delete collection from the database.'));
  }

  tryToLogin(login) {
    $.ajax({
      method: "POST",
      url:`${path}/user/login`,
      data: login,
      success: (res, status, xhr) => {
        this.setState({
          token: xhr.getResponseHeader('x-auth'),
          user: res.username,
          route: 'dates'
        });
      }
    }).fail(error => Popup.alert('Unable to login. Valid email address and minimum password length of 6 characters required.'));
  }

  tryToRegister(register) {
    $.ajax({
      method: "POST",
      url:`${path}/user`,
      data: register,
      success: (res, status, xhr) => {
        this.setState({
          token: xhr.getResponseHeader('x-auth'),
          route: 'dates'
        });
      }
    }).fail(error => Popup.alert('Unable to register. Valid email address and minimum password length of 6 characters required.'));
  }

  logout() {
    $.ajax({
      method: "POST",
      url:`${path}/user/logout`,
      headers: {'x-auth': this.state.token},
      data: {
        user: this.state.username,
        token: this.state.token
      },
      success: (res, status, xhr) => {
        this.setState({
          foodItems: [],
          dateItems: [],
          summary: {
            fat: 0,
            carbohydrates: 0,
            protein: 0,
            calories: 0
          },
          selectedDate: null,
          user: null,
          token: null,
          route: 'login'
        });
      }
    }).fail(error => Popup.alert('Unable to logout.'));
  }

  setRoute(route) {
    switch (route) {
      case 'dates':
        if (this.state.route === 'dates') {
          return;
        }
        if (this.state.route === 'foods' && this.state.foodItems.length === 0) {
          Popup.alert('Food collection was not saved because it did not contain any entries.');
        }
        this.setState({
          route,
          selectedDate: null
        });
        break;
      case 'foods':
        this.setState({route});
        break;
      case 'about':
        this.setState({route});
        break;
      case 'login':
        this.setState({route});
        break;
    }
  }

  render() {
    if (this.state.route === 'login') {
      return (
        <div>
          <Popup />
          <Login
            state={this.state}
            onLogin={login => this.tryToLogin(login)}
            onRegister={register => this.tryToRegister(register)}
            onSetRoute={route => this.setRoute(route)}
            onLogout={() => this.logout()}
          />
        </div>
      );
    }

    if (this.state.route === 'about') {
      return (
        <div>
          <Popup />
          <About
            state={this.state}
            onLogin={login => this.tryToLogin(login)}
            onRegister={register => this.tryToRegister(register)}
            onSetRoute={route => this.setRoute(route)}
            onLogout={() => this.logout()}
          />
        </div>
      );
    }

    if (this.state.route === 'dates') {
      return (
        <div>
          <Popup />
          <Dates
            state={this.state}
            onAddDate={dateInput => this.addDate(dateInput)}
            onGetDates={() => this.getDates()}
            onDeleteDate={date => this.deleteDate(date)}
            onSetRoute={route => this.setRoute(route)}
            onLogout={() => this.logout()}
            onGetFoods={date => this.getFoods(date)}
          />
        </div>
      );
    }

    if (this.state.route === 'foods') {
      return (
        <div>
          <Popup />
          <Foods
            state={this.state}
            onAddFood={(search, selectedDate) => this.addFood(search, selectedDate)}
            onDeleteFood={id => this.deleteFood(id)}
            onGetFoods={() => this.getFoods()}
            onSetRoute={route => this.setRoute(route)}
            onLogout={() => this.logout()}
          />
        </div>
      );
    }
  }

};

ReactDOM.render(<App />, document.querySelector('.react'));

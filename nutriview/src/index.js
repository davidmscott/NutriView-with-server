import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Login from './components/login';
import Dates from './components/dates';
import Foods from './components/foods';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foodItems: [],
      dateItems: ['1/1/2016', '1/2/2016'],
      summary: {
        fat: 0,
        carbohydrates: 0,
        protein: 0,
        calories: 0
      },
      selectedDate: null,
      user: null,
      route: 'login'
    };
  }

  addFood(search, selectedDate) {
    var data = {
      search,
      selectedDate,
      user: this.state.user
    };
    $.get(`http://localhost:8000/food`, data, (res) => {
      var newFood = JSON.parse(JSON.parse(res.foodDetail).body);
      newFood.id = res._id;
      var updatedFoodItems = [newFood, ...this.state.foodItems];

      if (updatedFoodItems.length > 1) {
        var fat = updatedFoodItems.reduce((a, b) => {
          return ( a.totalDaily ? ( a.totalDaily.FAT ? a.totalDaily.FAT.quantity : 0 ) : a ) + ( b.totalDaily.FAT ? b.totalDaily.FAT.quantity : 0 );
        });
        var carbohydrates = updatedFoodItems.reduce((a, b) => {
          return ( a.totalDaily ? ( a.totalDaily.CHOCDF ? a.totalDaily.CHOCDF.quantity : 0 ) : a ) + ( b.totalDaily.CHOCDF ? b.totalDaily.CHOCDF.quantity : 0 );
        });
        var protein = updatedFoodItems.reduce((a, b) => {
          return ( a.totalDaily ? ( a.totalDaily.PROCNT ? a.totalDaily.PROCNT.quantity : 0 ) : a ) + ( b.totalDaily.PROCNT ? b.totalDaily.PROCNT.quantity : 0 );
        });
        var calories = updatedFoodItems.reduce((a, b) => {
          return ( a.calories ? a.calories : ( a.calories == 0 ? a.calories : a )) + b.calories;
        });
      } else {
        var fat = updatedFoodItems[0].totalDaily.FAT ? updatedFoodItems[0].totalDaily.FAT.quantity : 0;
        var carbohydrates = updatedFoodItems[0].totalDaily.CHOCDF ? updatedFoodItems[0].totalDaily.CHOCDF.quantity : 0;
        var protein = updatedFoodItems[0].totalDaily.PROCNT ? updatedFoodItems[0].totalDaily.PROCNT.quantity : 0;
        var calories = updatedFoodItems[0].calories;
      }

      var newSummary = {
        fat,
        carbohydrates,
        protein,
        calories
      };

      this.setState({
        foodItems: updatedFoodItems,
        summary: newSummary,
      });
    }).fail(error => alert('No results found.  The Nutritionix API works best with searches like "1 large apple" or "8 ounce milk" as opposed to "apples".'));
  }

  deleteFood(id) {
    $.post(`http://localhost:8000/removefood`, {id}, (res) => {
      this.getFoods(this.state.selectedDate);
    }).fail(error => alert('Unable to delete entry from the database.'));
  }

  getFoods() {
    $.get(`http://localhost:8000/foods`, {date: this.state.selectedDate}, (res) => {
      var updatedFoodItems = res.foodList.map(foodItem => {
        var newFood = JSON.parse(JSON.parse(foodItem.foodDetail).body);
        newFood.id = foodItem._id;
        return newFood;
      });
      this.setState({foodItems: updatedFoodItems});
    });
  }

  addDate(dateInput) {
    //validate dateInput is the format I want it to be
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
    $.get(`http://localhost:8000/dates`, (res) => {
      var updatedDateItems = [...res.dateList];
      this.setState({dateItems: updatedDateItems});
    });
  }

  deleteDate(date) {
    $.post(`http://localhost:8000/removedate`, {date}, (res) => {
      this.getDates();
    }).fail(error => alert('Unable to delete entry from the database.'));
  }

  tryToLogin(login) {
    this.setState({
      user: login.username,
      route: 'dates'
    });
  }

  // tryToRegister(register) {
  //   axios.post(`http://localhost:8000/user`, register).then((response) => {
  //     console.log(response);
  //     this.setState({route: 'dates'});
  //   });
  // }

  tryToRegister(register) {
    $.post(`http://localhost:8000/user`, register, (res) => {
      console.log('register res', res);
      this.setState({route: 'dates'});
    }).fail(error => alert('Unable to register username and password.'));
  }

  setRoute(route) {
    this.setState({route});
  }

  render() {
    if (this.state.route === 'login') {
      return (
          <Login
            state={this.state}
            onLogin={login => this.tryToLogin(login)}
            onRegister={register => this.tryToRegister(register)}
          />
      );
    }

    if (this.state.route === 'dates') {
      return (
          <Dates
            state={this.state}
            onAddDate={dateInput => this.addDate(dateInput)}
            onGetDates={() => this.getDates()}
            onDeleteDate={date => this.deleteDate(date)}
            onSetRoute={route => this.setRoute(route)}
          />
      );
    }

    if (this.state.route === 'foods') {
      return (
          <Foods
            state={this.state}
            onAddFood={(search, selectedDate) => this.addFood(search, selectedDate)}
            onDeleteFood={id => this.deleteFood(id)}
            onGetFoods={() => this.getFoods()}
            onSetRoute={route => this.setRoute(route)}
          />
      );
    }
  }

};

ReactDOM.render(<App />, document.querySelector('.container'));

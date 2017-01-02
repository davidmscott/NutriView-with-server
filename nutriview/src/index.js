import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Foods from './components/foods';
import Dates from './components/dates';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('app constructor');
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
      route: 'foods'
    };
  }

  addFood(search, selectedDate) {
    var data = {search, selectedDate};
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
        route: 'dates',
        selectedDate
      });
    }).fail(error => alert('No results found.  The Nutritionix API works best with searches like "1 large apple" or "8 ounce milk" as opposed to "apples".'));
  }

  deleteFood(id) {
    $.post(`http://localhost:8000/removefood`, {id}, (res) => {
      this.getFoods(this.state.selectedDate);
    }).fail(error => alert('Unable to delete entry from the database.'));
  }

  getFoods(date) {
    console.log('getFoods');
    $.get(`http://localhost:8000/foods`, {date}, (res) => {
      var updatedFoodItems = [...res.foodList];
      this.setState({foodItems: updatedFoodItems})
    });
  }

  addDate(dateInput) {
    console.log('addDate');
    //validate dateInput is the format I want it to be
    var updatedDateItems = [...this.state.dateItems, dateInput]
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

  }

  render() {
    console.log('render');
    if (this.state.route === 'login') {
      console.log('route: login');
      return (
          <Login
            state={this.state}
            onLogin={login => this.tryToLogin(login)}
          />
      );
    }

    if (this.state.route === 'dates') {
      console.log('route: dates');
      return (
          <Dates
            state={this.state}
            onAddDate={dateInput => this.addDate(dateInput)}
            onGetDates={() => this.getDates()}
            onDeleteDate={date => this.deleteDate(date)}
          />
      );
    }

    if (this.state.route === 'foods') {
      console.log('route: foods');
      return (
          <Foods
            state={this.state}
            onAddFood={(search, selectedDate) => this.addFood(search, selectedDate)}
            onDeleteFood={id => this.deleteFood(id)}
          />
      );
    }
  }

};

ReactDOM.render(<App />, document.querySelector('.container'));

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Foods from './components/foods';
import Dates from './components/dates';

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
      route: 'foods'
    };
  }

  foodSearch(search) {
    $.get(`http://localhost:8000/nutrients`, search, function(res) {
      if (!JSON.parse(res.body).ingredients[0].parsed) {
        return;
      }
      var updatedFoodItems = [JSON.parse(res.body), ...this.state.foodItems];

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
          console.log('a', a, a.calories, typeof a, ( a.calories ? a.calories : a ));
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
        summary: newSummary
      });
    }.bind(this));

  }

  addDate(dateInput) {
    var updatedDateItems = [...this.state.dateItems, dateInput]
    this.setState({dateItems: updatedDateItems});
  }

  tryToLogin(login) {

  }

  render() {
    if (this.state.route === 'login') {
      return (
          <Login state={this.state} onLogin={login => this.tryToLogin(login)} />
      );
    }

    if (this.state.route === 'dates') {
      return (
          <Dates state={this.state} onAddDate={dateInput => this.addDate(dateInput)} />
      );
    }

    if (this.state.route === 'foods') {
      return (
          <Foods state={this.state} onFoodSearch={search => this.foodSearch(search)} />
      );
    }
  }


  // render() {
  //   return (
  //     <div>
  //       <FoodSummary summary={this.state.summary} />
  //       <AddNewDateItem onAddDate={dateInput => this.addDate(dateInput)} />
  //       <DateList dateItems={this.state.dateItems} />
  //       <AddNewFoodItem onFoodSearch={search => this.foodSearch(search)} />
  //       <FoodList foodItems={this.state.foodItems} />
  //     </div>
  //   );
  // }
};

ReactDOM.render(<App />, document.querySelector('.container'));

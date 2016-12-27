import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AddNewFoodItem from './components/add_new_food_item';
import AddNewDateItem from './components/add_new_date_item';
import FoodSummary from './components/food_summary';
import FoodList from './components/food_list';
import DateList from './components/date_list';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foodItems: [],
      dateItems: ['1/1/2016', '1/2/2016'],
      summary: {
        fat: 0,
        carbohydrates: 0,
        protein: 0
      }
    };
  }

  foodSearch(search) {
    $.get(`http://localhost:8000/nutrients`, search, function(res) {
      if (!JSON.parse(res.body).ingredients[0].parsed) {
        return;
      }
      var updatedFoodItems = [JSON.parse(res.body), ...this.state.foodItems];

      if (updatedFoodItems.length > 1) {
        var fat = updatedFoodItems.reduce((a, b) => a.totalDaily.FAT.quantity + b.totalDaily.FAT.quantity);
        var carbohydrates = updatedFoodItems.reduce((a, b) => a.totalDaily.CHOCDF.quantity + b.totalDaily.CHOCDF.quantity);
        var protein = updatedFoodItems.reduce((a, b) => a.totalDaily.PROCNT.quantity + b.totalDaily.PROCNT.quantity);
      } else {
        var fat = updatedFoodItems[0].totalDaily.FAT ? updatedFoodItems[0].totalDaily.FAT.quantity : 0;
        var carbohydrates = updatedFoodItems[0].totalDaily.CHOCDF ? updatedFoodItems[0].totalDaily.CHOCDF.quantity : 0;
        var protein = updatedFoodItems[0].totalDaily.PROCNT ? updatedFoodItems[0].totalDaily.PROCNT.quantity : 0;
      }

      this.setState({
        foodItems: updatedFoodItems,
        summary: {
          fat,
          carbohydrates,
          protein
        }
      });
    }.bind(this));
  }

  addDate(dateInput) {
    var updatedDateItems = [...this.state.dateItems, dateInput]
    this.setState({dateItems: updatedDateItems});
  }

  render() {
    return (
      <div>
        <FoodSummary summary={this.state.summary} />
        <AddNewDateItem onAddDate={dateInput => this.addDate(dateInput)} />
        <DateList dateItems={this.state.dateItems} />
        <AddNewFoodItem onFoodSearch={search => this.foodSearch(search)} />
        <FoodList foodItems={this.state.foodItems} />
      </div>
    );
  }
};

ReactDOM.render(<App />, document.querySelector('.container'));

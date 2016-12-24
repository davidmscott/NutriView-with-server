import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AddNewFoodItem from './components/add_new_food_item';
import AddNewDateItem from './components/add_new_date_item';
import FoodList from './components/food_list';
import DateList from './components/date_list';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foodItems: [],
      dateItems: ['1/1/2016', '1/2/2016']
    };
  }

  foodSearch(search) {
    $.get(`http://localhost:8000/nutrients`, search, function(res) {
      if (!JSON.parse(res.body).ingredients[0].parsed) {
        return;
      }
      var updatedFoodItems = [res, ...this.state.foodItems];
      this.setState({ foodItems: updatedFoodItems});
    }.bind(this));
  }

  addDate(dateInput) {
    var updatedDateItems = [...this.state.dateItems, dateInput]
    this.setState({dateItems: updatedDateItems});
  }

  render() {
    return (
      <div>
        <AddNewDateItem onAddDate={dateInput => this.addDate(dateInput)} />
        <DateList dateItems={this.state.dateItems} />
        <AddNewFoodItem onFoodSearch={search => this.foodSearch(search)} />
        <FoodList foodItems={this.state.foodItems} />
      </div>
    );
  }

};

ReactDOM.render(<App />, document.querySelector('.container'));

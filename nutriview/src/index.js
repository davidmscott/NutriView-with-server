import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AddNewFoodItem from './components/add_new_food_item';
import FoodList from './components/food_list';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {foodItems: []};
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

  render() {
    return (
      <div>
        <AddNewFoodItem onFoodSearch={search => this.foodSearch(search)}/>
        <FoodList foodItems={this.state.foodItems} />
      </div>
    );
  }

};

ReactDOM.render(<App />, document.querySelector('.container'));

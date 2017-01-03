import React, {Component} from 'react';

import AddNewFoodItem from './add_new_food_item';
import FoodSummary from './food_summary';
import FoodList from './food_list';

class Foods extends Component {
  constructor(props) {
    super(props)

    this.props.onGetFoods();
  }
  render() {
    return (
      <div>
        <FoodSummary summary={this.props.state.summary} />
        <AddNewFoodItem
          onAddFood={this.props.onAddFood}
          selectedDate={this.props.state.selectedDate}
        />
        <FoodList
          foodItems={this.props.state.foodItems}
          onDeleteFood={this.props.onDeleteFood}
        />
      </div>
    );
  }
};

export default Foods;

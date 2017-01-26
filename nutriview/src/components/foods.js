import React, {Component} from 'react';

import NavBar from './nav_bar';
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
        <NavBar
          onSetRoute={this.props.onSetRoute}
          onLogout={this.props.onLogout}
          state={this.props.state}
        />
        <AddNewFoodItem
          onAddFood={this.props.onAddFood}
          selectedDate={this.props.state.selectedDate}
        />
        <div className="container">
          <h2 className="text-center" style={{"color": "white", "marginTop": "4vh"}}>Collection for {this.props.state.selectedDate}</h2>
        </div>
        <div className="container">
          <div className="row">
            <FoodList
              foodItems={this.props.state.foodItems}
              onDeleteFood={this.props.onDeleteFood}
            />
            <FoodSummary
              summary={this.props.state.summary}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default Foods;

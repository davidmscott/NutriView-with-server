import React from 'react';

import AddNewFoodItem from './add_new_food_item';
import FoodSummary from './food_summary';
import FoodList from './food_list';

const Foods = (props) => {
  return (
    <div>
      <FoodSummary summary={props.state.summary} />
      <AddNewFoodItem onFoodSearch={props.onFoodSearch} />
      <FoodList foodItems={props.state.foodItems} />
    </div>
  );
};

export default Foods;

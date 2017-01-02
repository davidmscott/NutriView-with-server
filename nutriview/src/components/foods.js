import React from 'react';

import AddNewFoodItem from './add_new_food_item';
import FoodSummary from './food_summary';
import FoodList from './food_list';

const Foods = (props) => {
  return (
    <div>
      <FoodSummary summary={props.state.summary} />
      <AddNewFoodItem
        onAddFood={props.onAddFood}
        selectedDate={props.state.selectedDate}
      />
      <FoodList
        foodItems={props.state.foodItems}
        onDeleteFood={props.onDeleteFood}
      />
    </div>
  );
};

export default Foods;

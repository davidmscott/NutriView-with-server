import React from 'react';

import FoodListItem from './food_list_item';

const FoodList = (props) => {
  // use index as key only as a last resort --refactor if better key is possible
  const foods = props.foodItems.map((foodItem) => {
    return (
      <FoodListItem
        key={foodItem.id}
        id={foodItem.id}
        foodItem={foodItem}
        onDeleteFood={props.onDeleteFood}
      />
    );
  });

  return (
    <div className="col-md-6 text-center">
      {foods}
    </div>
  );
};

export default FoodList;

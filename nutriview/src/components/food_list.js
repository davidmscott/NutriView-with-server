import React from 'react';

import FoodListItem from './food_list_item';

const FoodList = (props) => {
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
    <div className="col-sm-12 col-lg-6 text-center">
      {foods}
    </div>
  );
};

export default FoodList;

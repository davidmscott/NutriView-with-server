import React from 'react';

import FoodListItem from './food_list_item';

const FoodList = (props) => {
  // use index as key only as a last resort --refactor if better key is possible
  const foods = props.foodItems.map((foodItem, index) => {
    return <FoodListItem key={index} foodItem={foodItem} />;
  });

  return (
    <ul>
      {foods}
    </ul>
  );
};

export default FoodList;

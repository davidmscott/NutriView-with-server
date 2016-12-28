import React from 'react';

import FoodListItem from './food_list_item';

const FoodList = (props) => {
  // use index as key only as a last resort --refactor if better key is possible
  console.log('pre-map', props.foodItems);
  const foods = props.foodItems.map((foodItem, index) => {
    console.log('map', foodItem);
    return (
      <FoodListItem key={foodItem.uri} foodItem={foodItem} />
    );
  });

  return (
    <ul>
      {foods}
    </ul>
  );
};

export default FoodList;

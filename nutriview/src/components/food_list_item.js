import React from 'react';

const FoodListItem = (props) => {
  return (
    <li>
      {props.foodItem.body}
    </li>
  );
};

export default FoodListItem;

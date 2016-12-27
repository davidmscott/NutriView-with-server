import React from 'react';

const FoodListItem = (props) => {
  return (
    <li>
      {JSON.stringify(props.foodItem)}
    </li>
  );
};

export default FoodListItem;

import React from 'react';

const DateListItem = (props) => {
  return (
    <li>
      <button onClick={() => props.onGetFoods(props.dateItem)}>{props.dateItem}</button>
      <button onClick={() => props.onDeleteDate(props.dateItem)}>X</button>
    </li>
  );
};

export default DateListItem;

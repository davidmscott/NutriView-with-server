import React from 'react';

const DateListItem = (props) => {
  return (
    <li>
      {props.dateItem}
      <button onClick={() => props.onDeleteDate(props.dateItem)}>X</button>
    </li>
  );
};

export default DateListItem;

import React from 'react';

import DateListItem from './date_list_item';

const DateList = (props) => {
  // use index as key only as a last resort --refactor if better key is possible
  const dates = props.dateItems.map((dateItem, index) => {
    return <DateListItem key={index} dateItem={dateItem} onDeleteDate={props.onDeleteDate} />;
  });

  return (
    <ul>
      {dates}
    </ul>
  );
};

export default DateList;

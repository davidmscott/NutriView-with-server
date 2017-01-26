import React from 'react';

import DateListItem from './date_list_item';

const DateList = (props) => {
  const dates = props.dateItems.map((dateItem, index) => {
    return (
      <DateListItem
        key={index}
        date={dateItem.date}
        count={dateItem.count}
        onDeleteDate={props.onDeleteDate}
        onAddDate={props.onAddDate}
        onGetFoods={props.onGetFoods}
      />
    );
  });

  return (
    <div>
      <h2 className="text-center" style={{"color": "white",}}>View / Edit an Existing Date:</h2>
      {dates}
    </div>
  );
};

export default DateList;

import React from 'react';

const DateListItem = (props) => {
  return (
    <div className="btn-group" style={{"margin": "2vh"}}>
      <button className="btn btn-info" onClick={() => props.onGetFoods(props.dateItem)}>{props.dateItem}</button>
      <button className="btn btn-danger" onClick={() => props.onDeleteDate(props.dateItem)}>X</button>
    </div>
  );
};

export default DateListItem;

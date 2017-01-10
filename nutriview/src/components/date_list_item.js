import React from 'react';

const DateListItem = (props) => {
  return (
    <div className="container">
      <div className="row" style={{"margin": "2vh"}}>
        <div className="col-sm-8 col-md-6">
          <button className="btn btn-info btn-block" onClick={() => props.onGetFoods(props.date)}>Name: {props.date}</button>
        </div>
        <div className="hidden-sm-down col-md-3">
          <button className="btn btn-info btn-block" onClick={() => props.onGetFoods(props.date)}>Items: {props.count}</button>
        </div>
        <div className="col-sm-4 col-md-3">
          <button className="btn btn-danger btn-block" onClick={() => props.onDeleteDate(props.date)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DateListItem;

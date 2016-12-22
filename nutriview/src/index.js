import React from 'react';
import ReactDOM from 'react-dom';

import AddNewFoodItem from './components/add_new_food_item';

const App = () => {
  return (
    <div>
      <AddNewFoodItem />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('.container'));

import React from 'react';

import AddNewDateItem from './add_new_date_item';
import DateList from './date_list';

const Dates = (props) => {
  return (
    <div>
      <AddNewDateItem onAddDate={props.onAddDate} />
      <DateList dateItems={props.state.dateItems} />
    </div>
  );
};

export default Dates;

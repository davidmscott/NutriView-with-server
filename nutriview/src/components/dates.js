import React, {Component} from 'react';

import NavBar from './nav_bar';
import AddNewDateItem from './add_new_date_item';
import DateList from './date_list';

class Dates extends Component {
  constructor(props) {
    super(props)

    this.props.onGetDates();
  }

  render() {
    return (
      <div>
        <NavBar onSetRoute={this.props.onSetRoute} />
        <AddNewDateItem onAddDate={this.props.onAddDate} />
        <DateList
          dateItems={this.props.state.dateItems}
          onDeleteDate={this.props.onDeleteDate}
        />
      </div>
    );
  }

};

export default Dates;

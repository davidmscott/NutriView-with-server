import React, {Component} from 'react';

import NavBar from './nav_bar';
import AddNewDateItem from './add_new_date_item';
import DateList from './date_list';
import LineChart from './line_chart';

class Dates extends Component {
  constructor(props) {
    super(props)

    this.props.onGetDates();
  }

  render() {
    return (
      <div>
        <NavBar
          onSetRoute={this.props.onSetRoute}
          onLogout={this.props.onLogout}
          state={this.props.state}
        />
        <AddNewDateItem
          onAddDate={this.props.onAddDate}
          onToggleChart={this.props.onToggleChart}
        />
        <LineChart
          state={this.props.state}
          onGetDetailedDates={this.props.onGetDetailedDates}
        />
        <div className="container" style={{"marginTop": "4vh"}}>
          <DateList
            dateItems={this.props.state.dateItems}
            onDeleteDate={this.props.onDeleteDate}
            onAddDate={this.props.onAddDate}
            onGetFoods={this.props.onGetFoods}
          />
        </div>
      </div>
    );
  }

};

export default Dates;

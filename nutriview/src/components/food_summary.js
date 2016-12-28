import React, {Component} from 'react';

class FoodSummary extends Component {

  render() {
    return (
      <div>
        {this.props.summary.fat}
      </div>
    );
  }
};

export default FoodSummary;

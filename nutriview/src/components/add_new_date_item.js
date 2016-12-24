import React, { Component } from 'react';

// Functional component:
// const AddNewFoodItem = () => {
//   return <input />;
// };

// Class-based component:
class AddNewDateItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form className="form-inline" onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input className="form-control" placeholder="Date item" type="text" id="date-input" autofocus />
          <button className="btn btn-default" onClick={() => this.onButtonClick()}>Add Date Item</button>
        </div>
      </form>
    );
  }

  onButtonClick() {
    var dateInput = $('#date-input').val();
    $('#date-input').val('');
    if (!dateInput) {
      return;
    }
    this.props.onAddDate(dateInput);
  }

}

export default AddNewDateItem;

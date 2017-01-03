import React, {Component} from 'react';

class AddNewDateItem extends Component {
  render() {
    return (
      <form className="form-inline" onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input className="form-control" placeholder="Date item" type="text" id="date-input" autofocus />
          <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onButtonClick();}}>Add Date Item</button>
        </div>
      </form>
    );
  }

  onButtonClick() {
    var dateInput = $('#date-input').val();
    if (!dateInput) {
      return;
    }
    $('#date-input').val('');
    this.props.onAddDate(dateInput);
  }

}

export default AddNewDateItem;

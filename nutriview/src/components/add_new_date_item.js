import React, {Component} from 'react';

class AddNewDateItem extends Component {
  render() {
    return (
      <form style={{"margin": "4vh"}} className="form-inline" onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input className="form-control" placeholder="Collection name" type="text" id="date-input" autofocus />
          <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onButtonClick();}}>Create New Food Collection</button>
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

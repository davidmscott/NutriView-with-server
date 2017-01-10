import React, {Component} from 'react';

class AddNewDateItem extends Component {
  render() {
    return (
      <div className="container">
        <div style={{"marginTop": "2vh"}} className="row text-center">
          <form style={{"display": "inline-block"}} className="col-md-12 col-lg-6 form-inline" onSubmit={event => event.preventDefault()}>
            <div style={{"display": "inline-block"}} className="form-group text-center">
              <input className="form-control" placeholder="Collection name" type="text" id="date-input" autofocus />
              <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onButtonClick();}}>Create New Food Collection</button>
            </div>
          </form>
          <div style={{"color": "white", "display": "flex", "align-items": "center", "justify-content": "center"}} className="col-md-12 col-lg-6">
            *Enter collection name (e.g. '1/12/17' or 'My recipe')
          </div>
        </div>
      </div>
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

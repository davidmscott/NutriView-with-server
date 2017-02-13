import React, {Component} from 'react';

class AddNewDateItem extends Component {
  render() {
    return (
      <div className="container">
        <div className="row text-center">
          <form style={{"display": "inline-block", "marginTop": "2vh"}} className="col-sm-12 col-md-8 col-lg-6 form-inline sm-center-md-left" onSubmit={event => event.preventDefault()}>
            <div style={{"display": "inline-block"}} className="form-group text-left">
              <input className="form-control" placeholder="Click to select date" type="text" id="date-input" readOnly />
              <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onButtonClick();}}>Create New Date Collection</button>
            </div>
          </form>
          <div style={{"color": "white", "display": "inline-block", "marginTop": "2vh"}} className="col-md-4 col-lg-6 text-right hidden-sm-down">
            <button className="btn btn-default" onClick={() => {this.props.onToggleChart();}}>Toggle Nutrition Chart</button>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    $('#date-input').datepicker({
      autoclose: true
    });
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

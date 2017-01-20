import React, {Component} from 'react';

class AddNewFoodItem extends Component {
  render() {
    return (
      <div className="container">
        <div style={{"marginTop": "2vh"}} className="row text-center">
          <form style={{"display": "inline-block"}} className="col-md-12 col-lg-6 form-inline" onSubmit={event => event.preventDefault()}>
            <div style={{"display": "inline-block"}} className="form-group text-center">
              <input className="form-control" placeholder="Food item" type="text" id="search" autoFocus />
              <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onButtonClick();}}>Add Food To Collection</button>
            </div>
          </form>
          <div style={{"color": "white", "display": "flex", "alignItems": "center", "justifyContent": "center"}} className="col-md-12 col-lg-6">
            *Be specific for best results (e.g. '1 large apple')
          </div>
        </div>
      </div>
    );
  }

  onButtonClick() {
    var search = $('#search').val();
    $('#search').val('');
    if (!search) {
      return;
    }
    this.props.onAddFood(search, this.props.selectedDate);
  }

}

export default AddNewFoodItem;

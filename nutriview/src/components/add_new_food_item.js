import React, {Component} from 'react';

class AddNewFoodItem extends Component {
  render() {
    return (
      <form style={{"margin": "4vh"}} className="form-inline" onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input className="form-control" placeholder="Food item" type="text" id="search" autofocus />
          <button className="btn btn-default" onClick={(e) => {e.preventDefault(); this.onButtonClick();}}>Add Food To Collection</button>
        </div>
      </form>
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

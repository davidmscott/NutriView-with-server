import React, {Component} from 'react';

// Functional component:
// const AddNewFoodItem = () => {
//   return <input />;
// };

// Class-based component:
class AddNewFoodItem extends Component {
  render() {
    console.log('AddnewFoodItemRender');
    return (
      <form className="form-inline" onSubmit={event => event.preventDefault()}>
        <div className="form-group">
          <input className="form-control" placeholder="Food item" type="text" id="search" autofocus />
          <button className="btn btn-default" onClick={() => this.onButtonClick()}>Add Food Item</button>
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
    var selectedDate = this.props.selectedDate;
    this.props.onAddFood(search, selectedDate);
  }

}

export default AddNewFoodItem;

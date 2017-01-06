import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import Login from './components/login';
import Dates from './components/dates';
import Foods from './components/foods';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      foodItems: [],
      dateItems: [],
      summary: {
        fat: 0,
        carbohydrates: 0,
        protein: 0,
        calories: 0
      },
      selectedDate: null,
      user: null,
      token: null,
      route: 'login'
    };
  }

  // addFood(search, selectedDate) {
  //   var data = {
  //     search,
  //     selectedDate,
  //     user: this.state.user
  //   };
  //   $.get(`http://localhost:8000/food`, data, (res) => {
  //     var newFood = JSON.parse(JSON.parse(res.foodDetail).body);
  //     newFood.id = res._id;
  //     var updatedFoodItems = [newFood, ...this.state.foodItems];
  //
  //     if (updatedFoodItems.length > 1) {
  //       var fat = updatedFoodItems.reduce((a, b) => {
  //         return ( a.totalDaily ? ( a.totalDaily.FAT ? a.totalDaily.FAT.quantity : 0 ) : a ) + ( b.totalDaily.FAT ? b.totalDaily.FAT.quantity : 0 );
  //       });
  //       var carbohydrates = updatedFoodItems.reduce((a, b) => {
  //         return ( a.totalDaily ? ( a.totalDaily.CHOCDF ? a.totalDaily.CHOCDF.quantity : 0 ) : a ) + ( b.totalDaily.CHOCDF ? b.totalDaily.CHOCDF.quantity : 0 );
  //       });
  //       var protein = updatedFoodItems.reduce((a, b) => {
  //         return ( a.totalDaily ? ( a.totalDaily.PROCNT ? a.totalDaily.PROCNT.quantity : 0 ) : a ) + ( b.totalDaily.PROCNT ? b.totalDaily.PROCNT.quantity : 0 );
  //       });
  //       var calories = updatedFoodItems.reduce((a, b) => {
  //         return ( a.calories ? a.calories : ( a.calories == 0 ? a.calories : a )) + b.calories;
  //       });
  //     } else {
  //       var fat = updatedFoodItems[0].totalDaily.FAT ? updatedFoodItems[0].totalDaily.FAT.quantity : 0;
  //       var carbohydrates = updatedFoodItems[0].totalDaily.CHOCDF ? updatedFoodItems[0].totalDaily.CHOCDF.quantity : 0;
  //       var protein = updatedFoodItems[0].totalDaily.PROCNT ? updatedFoodItems[0].totalDaily.PROCNT.quantity : 0;
  //       var calories = updatedFoodItems[0].calories;
  //     }
  //
  //     var newSummary = {
  //       fat,
  //       carbohydrates,
  //       protein,
  //       calories
  //     };
  //
  //     this.setState({
  //       foodItems: updatedFoodItems,
  //       summary: newSummary,
  //     });
  //   }).fail(error => alert('No results found.  The Nutritionix API works best with searches like "1 large apple" or "8 ounce milk" as opposed to "apples".'));
  // }

  addFood(search, selectedDate) {
    var data = {
      search,
      selectedDate,
      user: this.state.user
    };
    $.ajax({
      method: 'GET',
      url: 'http://localhost:8000/food',
      headers: {'x-auth': this.state.token},
      data,
      success: (res, status, xhr) => {
        var newFood = JSON.parse(JSON.parse(res.foodDetail).body);
        newFood.id = res._id;
        var updatedFoodItems = [newFood, ...this.state.foodItems];

        if (updatedFoodItems.length > 1) {
          var fat = updatedFoodItems.reduce((a, b) => {
            return ( a.totalDaily ? ( a.totalDaily.FAT ? a.totalDaily.FAT.quantity : 0 ) : a ) + ( b.totalDaily.FAT ? b.totalDaily.FAT.quantity : 0 );
          });
          var carbohydrates = updatedFoodItems.reduce((a, b) => {
            return ( a.totalDaily ? ( a.totalDaily.CHOCDF ? a.totalDaily.CHOCDF.quantity : 0 ) : a ) + ( b.totalDaily.CHOCDF ? b.totalDaily.CHOCDF.quantity : 0 );
          });
          var protein = updatedFoodItems.reduce((a, b) => {
            return ( a.totalDaily ? ( a.totalDaily.PROCNT ? a.totalDaily.PROCNT.quantity : 0 ) : a ) + ( b.totalDaily.PROCNT ? b.totalDaily.PROCNT.quantity : 0 );
          });
          var calories = updatedFoodItems.reduce((a, b) => {
            return ( a.calories ? a.calories : ( a.calories == 0 ? a.calories : a )) + b.calories;
          });
        } else {
          var fat = updatedFoodItems[0].totalDaily.FAT ? updatedFoodItems[0].totalDaily.FAT.quantity : 0;
          var carbohydrates = updatedFoodItems[0].totalDaily.CHOCDF ? updatedFoodItems[0].totalDaily.CHOCDF.quantity : 0;
          var protein = updatedFoodItems[0].totalDaily.PROCNT ? updatedFoodItems[0].totalDaily.PROCNT.quantity : 0;
          var calories = updatedFoodItems[0].calories;
        }

        var newSummary = {
          fat,
          carbohydrates,
          protein,
          calories
        };

        this.setState({
          foodItems: updatedFoodItems,
          summary: newSummary,
        });
      }
    }).fail(error => alert('No results found.  The Nutritionix API works best with searches like "1 large apple" or "8 ounce milk" as opposed to "apples".'));
  }

  // deleteFood(id) {
  //   $.post(`http://localhost:8000/removefood`, {id}, (res) => {
  //     this.getFoods(this.state.selectedDate);
  //   }).fail(error => alert('Unable to delete entry from the database.'));
  // }

  deleteFood(id) {
    $.ajax({
      method: "POST",
      url:`http://localhost:8000/removefood`,
      headers: {'x-auth': this.state.token},
      data: {id},
      success: (data, status, xhr) => {
        this.getFoods(this.state.selectedDate);
      }
    }).fail(error => alert('Unable to delete entry from the database.'));
  }

  // getFoods() {
  //   $.get(`http://localhost:8000/foods`, {date: this.state.selectedDate}, (res) => {
  //     var updatedFoodItems = res.foodList.map(foodItem => {
  //       var newFood = JSON.parse(JSON.parse(foodItem.foodDetail).body);
  //       newFood.id = foodItem._id;
  //       return newFood;
  //     });
  //     this.setState({foodItems: updatedFoodItems});
  //   });
  // }

  getFoods(date) {
    if (date === undefined) {
      console.log('date = undefined');
      var date = this.state.selectedDate;
    }
    $.ajax({
      method: 'GET',
      url: 'http://localhost:8000/foods',
      headers: {'x-auth': this.state.token},
      // data: {date: this.state.selectedDate},
      data: {date},
      success: (res, status, xhr) => {
        console.log(date);
        var updatedFoodItems = res.foodList.map(foodItem => {
          var newFood = JSON.parse(JSON.parse(foodItem.foodDetail).body);
          newFood.id = foodItem._id;
          return newFood;
        });
        if (updatedFoodItems.length > 0) {
          if (updatedFoodItems.length > 1) {
            var fat = updatedFoodItems.reduce((a, b) => {
              return ( a.totalDaily ? ( a.totalDaily.FAT ? a.totalDaily.FAT.quantity : 0 ) : a ) + ( b.totalDaily.FAT ? b.totalDaily.FAT.quantity : 0 );
            });
            var carbohydrates = updatedFoodItems.reduce((a, b) => {
              return ( a.totalDaily ? ( a.totalDaily.CHOCDF ? a.totalDaily.CHOCDF.quantity : 0 ) : a ) + ( b.totalDaily.CHOCDF ? b.totalDaily.CHOCDF.quantity : 0 );
            });
            var protein = updatedFoodItems.reduce((a, b) => {
              return ( a.totalDaily ? ( a.totalDaily.PROCNT ? a.totalDaily.PROCNT.quantity : 0 ) : a ) + ( b.totalDaily.PROCNT ? b.totalDaily.PROCNT.quantity : 0 );
            });
            var calories = updatedFoodItems.reduce((a, b) => {
              return ( a.calories ? a.calories : ( a.calories == 0 ? a.calories : a )) + b.calories;
            });
          } else {
            var fat = updatedFoodItems[0].totalDaily.FAT ? updatedFoodItems[0].totalDaily.FAT.quantity : 0;
            var carbohydrates = updatedFoodItems[0].totalDaily.CHOCDF ? updatedFoodItems[0].totalDaily.CHOCDF.quantity : 0;
            var protein = updatedFoodItems[0].totalDaily.PROCNT ? updatedFoodItems[0].totalDaily.PROCNT.quantity : 0;
            var calories = updatedFoodItems[0].calories;
          }

          var newSummary = {
            fat,
            carbohydrates,
            protein,
            calories
          };
          this.setState({
            foodItems: updatedFoodItems,
            summary: newSummary,
            selectedDate: date
          });
          if (this.state.route !== 'foods') {
            this.setState({route: 'foods'});
          }
        } else {
          this.setState({
            foodItems: [],
            summary: {
              fat: 0,
              carbohydrates: 0,
              protein: 0,
              calories: 0
            },
            selectedDate: date
          });
          if (this.state.route !== 'foods') {
            this.setState({route: 'foods'});
          }
        }
      }
    }).fail(error => alert('Unable to get foods for selected date.'));
  }

  addDate(dateInput) {
    //validate dateInput is the format I want it to be
    if (this.state.dateItems.indexOf(dateInput) === -1) {
      var updatedDateItems = [...this.state.dateItems, dateInput]
    }
    this.setState({
      dateItems: updatedDateItems,
      selectedDate: dateInput,
      route: 'foods'
    });
  }

  // getDates() {
  //   $.get(`http://localhost:8000/dates`, (res) => {
  //     var updatedDateItems = [...res.dateList];
  //     this.setState({dateItems: updatedDateItems});
  //   });
  // }

  getDates() {
    $.ajax({
      method: 'GET',
      url: 'http://localhost:8000/dates',
      headers: {'x-auth': this.state.token},
      success: (res, status, xhr) => {
        var updatedDateItems = [...res.dateList];
        this.setState({
          dateItems: updatedDateItems,
          selectedDate: null
        });
      }
    }).fail(error => alert('Unable to fetch dates.'));
  }

  // deleteDate(date) {
  //   $.post(`http://localhost:8000/removedate`, {date}, (res) => {
  //     this.getDates();
  //   }).fail(error => alert('Unable to delete entry from the database.'));
  // }

  deleteDate(date) {
    $.ajax({
      method: "POST",
      url:`http://localhost:8000/removedate`,
      headers: {'x-auth': this.state.token},
      data: {date},
      success: (data, status, xhr) => {
        this.getDates();
      }
    }).fail(error => alert('Unable to delete entry from the database.'));
  }

  // tryToLogin(login) {
  //   this.setState({
  //     user: login.username,
  //     route: 'dates'
  //   });
  // }

  // tryToRegister(register) {
  //   axios.post(`http://localhost:8000/user`, register).then((response) => {
  //     console.log(response);
  //     this.setState({route: 'dates'});
  //   });
  // }

  // tryToRegister(register) {
  //   $.post(`http://localhost:8000/user`, register, (res) => {
  //     console.log('register res', res.headers('x-auth'));
  //     this.setState({route: 'dates'});
  //   }).fail(error => alert('Unable to register username and password.'));
  // }

  tryToLogin(login) {
    $.ajax({
      method: "POST",
      url:`http://localhost:8000/user/login`,
      data: login,
      success: (res, status, xhr) => {
        this.setState({
          token: xhr.getResponseHeader('x-auth'),
          user: res.username,
          route: 'dates'
        });
      }
    }).fail(error => alert('Unable to login.'));
  }

  tryToRegister(register) {
    $.ajax({
      method: "POST",
      url:`http://localhost:8000/user`,
      data: register,
      success: (res, status, xhr) => {
        this.setState({
          token: xhr.getResponseHeader('x-auth'),
          route: 'dates'
        });
      }
    }).fail(error => alert('Unable to register.'));
  }

  logout() {
    $.ajax({
      method: "POST",
      url:`http://localhost:8000/user/logout`,
      headers: {'x-auth': this.state.token},
      data: {
        user: this.state.username,
        token: this.state.token
      },
      success: (res, status, xhr) => {
        this.setState({
          foodItems: [],
          dateItems: [],
          summary: {
            fat: 0,
            carbohydrates: 0,
            protein: 0,
            calories: 0
          },
          selectedDate: null,
          user: null,
          token: null,
          route: 'login'
        });
      }
    }).fail(error => alert('Unable to logout.'));
  }

  setRoute(route) {
    switch (route) {
      case 'dates':
        this.setState({
          route,
          selectedDate: null
        });
        break;
      case 'foods':
        this.setState({route});
        break;
    }
  }

  render() {
    if (this.state.route === 'login') {
      return (
          <Login
            state={this.state}
            onLogin={login => this.tryToLogin(login)}
            onRegister={register => this.tryToRegister(register)}
          />
      );
    }

    if (this.state.route === 'dates') {
      return (
          <Dates
            state={this.state}
            onAddDate={dateInput => this.addDate(dateInput)}
            onGetDates={() => this.getDates()}
            onDeleteDate={date => this.deleteDate(date)}
            onSetRoute={route => this.setRoute(route)}
            onLogout={() => this.logout()}
            onGetFoods={date => this.getFoods(date)}
          />
      );
    }

    if (this.state.route === 'foods') {
      return (
          <Foods
            state={this.state}
            onAddFood={(search, selectedDate) => this.addFood(search, selectedDate)}
            onDeleteFood={id => this.deleteFood(id)}
            onGetFoods={() => this.getFoods()}
            onSetRoute={route => this.setRoute(route)}
            onLogout={() => this.logout()}
          />
      );
    }
  }

};

ReactDOM.render(<App />, document.querySelector('.container'));

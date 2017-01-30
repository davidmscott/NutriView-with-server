import React, {Component} from 'react';

import NavBar from './nav_bar';
import AddNewDateItem from './add_new_date_item';
import DateList from './date_list';

const path = 'http://localhost:8000';

class Dates extends Component {
  constructor(props) {
    super(props)

    this.state = {
      datesInfo: [],
      showChart: true
    };

    this.props.onGetDates();
    this.getDates();
  }

  render() {
    return (
      <div>
        <NavBar
          onSetRoute={this.props.onSetRoute}
          onLogout={this.props.onLogout}
          state={this.props.state}
        />
        <AddNewDateItem
          onAddDate={this.props.onAddDate}
          onToggleChart={this.toggleChart.bind(this)}
        />
        <div className="container hidden-sm-down chart" style={{"marginTop": "2vh"}}>
          <div className="text-center">
            <div style={{"display": "inline-block", "backgroundColor": "white", "borderRadius": "1vh", "margin": "2vh"}}>
              <div className="panel panel-default">
                <div className="panel-heading" ref="chartTitle"></div>
                <div className="panel-body">
                  <div ref="lineChart" className="thisChart">
                  </div>
                </div>
                <div className="panel-footer text-center" ref="chartFooter"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="container" style={{"marginTop": "2vh"}}>
          <DateList
            dateItems={this.props.state.dateItems}
            onDeleteDate={this.props.onDeleteDate}
            onAddDate={this.props.onAddDate}
            onGetFoods={this.props.onGetFoods}
          />
        </div>
      </div>
    );
  }

  getDetailedDates(cb) {
    var dateItems = this.state.dateItems;
    var detailedDateList = [];
    var count = 0;

    dateItems.forEach((date) => {
      $.ajax({
        method: 'GET',
        url: `${path}/foods`,
        headers: {'x-auth': this.props.state.token},
        data: {date: date.date},
        success: (res, status, xhr) => {
          var updatedFoodItems = res.foodList.map(foodItem => {
            var newFood = JSON.parse(JSON.parse(foodItem.foodDetail).body);
            return newFood;
          });
          count++;

          if (updatedFoodItems.length > 0) {
            var newSummary = this.summarize(updatedFoodItems);
            newSummary.date = date.date;
            detailedDateList.push(newSummary);
            detailedDateList.sort(function(a,b) {
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            this.setState({
              datesInfo: detailedDateList
            });
            if (count === dateItems.length) {
              cb();
            }
          }
        }
      });
    });
  }

  getDates() {
    $.ajax({
      method: 'GET',
      url: `${path}/dates`,
      headers: {'x-auth': this.props.state.token},
      success: (res, status, xhr) => {
        var updatedDateItems = [...res.dateList];
        updatedDateItems.sort(function(a,b) {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        });
        this.setState({
          dateItems: updatedDateItems,
          selectedDate: null
        });
        this.getDetailedDates(this.createChart.bind(this));
      }
    }).fail(error => Popup.alert('Unable to fetch list of collections.'));
  }

  summarize(foodItemArray) {
    if (foodItemArray.length > 1) {
      var fat = foodItemArray.reduce((a, b) => {
        return ( a.totalDaily ? ( a.totalDaily.FAT ? a.totalDaily.FAT.quantity : 0 ) : a ) + ( b.totalDaily.FAT ? b.totalDaily.FAT.quantity : 0 );
      });
      var carbohydrates = foodItemArray.reduce((a, b) => {
        return ( a.totalDaily ? ( a.totalDaily.CHOCDF ? a.totalDaily.CHOCDF.quantity : 0 ) : a ) + ( b.totalDaily.CHOCDF ? b.totalDaily.CHOCDF.quantity : 0 );
      });
      var protein = foodItemArray.reduce((a, b) => {
        return ( a.totalDaily ? ( a.totalDaily.PROCNT ? a.totalDaily.PROCNT.quantity : 0 ) : a ) + ( b.totalDaily.PROCNT ? b.totalDaily.PROCNT.quantity : 0 );
      });
      var calories = foodItemArray.reduce((a, b) => {
        return ( a.calories ? a.calories : ( a.calories == 0 ? a.calories : a )) + b.calories;
      });
    } else {
      var fat = foodItemArray[0].totalDaily.FAT ? foodItemArray[0].totalDaily.FAT.quantity : 0;
      var carbohydrates = foodItemArray[0].totalDaily.CHOCDF ? foodItemArray[0].totalDaily.CHOCDF.quantity : 0;
      var protein = foodItemArray[0].totalDaily.PROCNT ? foodItemArray[0].totalDaily.PROCNT.quantity : 0;
      var calories = foodItemArray[0].calories;
    }

    var newSummary = {
      fat,
      carbohydrates,
      protein,
      calories
    };

    return newSummary;
  }

  createChart() {

  var margin = {top: 20, right: 50, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var parseDate = d3.timeParse("%m/%d/%Y");

  var x = d3.scaleTime()
      .range([0, width])

  var y = d3.scaleLinear()
      .range([height, 0]);

  var xAxis = d3.axisBottom()
      .scale(x);

  var yAxis = d3.axisLeft()
      .scale(y);

  var protein = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.protein); });

  var carbs = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.carbohydrates); });

  var fat = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.fat); });

  var svg = d3.select(this.refs.lineChart).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = this.state.datesInfo.map(function(d) {
      return {
         date: parseDate(d.date),
         protein: d.protein,
         carbohydrates: d.carbohydrates,
         fat: d.fat
      };

    });

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return Math.max(d.protein, d.carbohydrates, d.fat); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke", "#1f77b4")
        .attr("d", protein);

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke", "#ff7f0e")
        .attr("d", carbs);

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke", "#2ca02c")
        .attr("d", fat);

  }

  toggleChart() {
    if (this.state.showChart) {
      $('.chart').hide('slow');
      this.setState({
        showChart: !this.state.showChart
      });
    } else {
      $('.chart').show('slow');
      this.setState({
        showChart: !this.state.showChart
      });
    }
  }

};

export default Dates;

// <LineChart
//   state={this.props.state}
//   onGetDetailedDates={this.props.onGetDetailedDates}
// />

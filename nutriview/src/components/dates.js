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
      showChart: true,
      chartWidth: 960,
      chartHeight: 500,
      hasDisplayed: false
    };

    this.updateDimensions = this.updateDimensions.bind(this);
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
        <div className="chart hidden-sm-down">
          <div ref="chartMessage" style={{"color": "white", "textAlign": "center", "marginTop": "2vh"}}></div>
          <div className="container" style={{"marginTop": "2vh", "marginLeft": "10vw", "marginRight": "10vw", "padding": "0"}}>
            <div style={{"display": "inline-block", "backgroundColor": "white", "borderRadius": "1vh", "marginTop": "2vh", "marginBottom": "2vh"}} className="text-center">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 ref="chartTitle" style={{"marginTop": "1vh", "marginBottom": 0}}></h3>
                </div>
                <div className="panel-body">
                  <div ref="lineChart" className="thisChart"></div>
                </div>
                <div className="panel-footer text-center" ref="chartFooter"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="container" style={{"marginTop": "2vh"}}>
          <DateList
            dateItems={this.props.state.dateItems}
            onDeleteDate={this.deleteDate.bind(this)}
            onAddDate={this.props.onAddDate}
            onGetFoods={this.props.onGetFoods}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
      var update_width = window.innerWidth * 0.8;
      var update_height = Math.round(update_width * 50 / 96);
      this.setState({ chartWidth: update_width, chartHeight: update_height });
      this.createChart();
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

    d3.select("svg").remove();

    if (this.state.datesInfo.length > 1) {
      d3.select(this.refs.chartTitle).html("Source of Calories by Day");
      d3.select(this.refs.chartMessage).html("");
    } else {
      d3.select(this.refs.chartTitle).html("");
      d3.select(this.refs.chartMessage).html("*You must have at least 2 dates to populate chart");
      return;
    }

    var margin = {top: 20, right: 80, bottom: 50, left: 65},
      width = this.state.chartWidth - margin.left - margin.right,
      height = this.state.chartHeight - margin.top - margin.bottom;

    var parseDate = d3.timeParse("%m/%d/%Y");

    var x = d3.scaleTime()
      .range([0, width]);

    var y = d3.scaleLinear()
      .range([height, 0]);

    var xAxis = d3.axisBottom()
      .ticks(d3.timeDay.every(1))
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
    y.domain([0, d3.max(data, function(d) { return Math.max(d.protein, d.carbohydrates, d.fat) * 1.1; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    if (!this.state.hasDisplayed) {

      this.setState({ hasDisplayed: true })

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke", "#1f77b4")
        .attr("d", protein)
        .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
        .attr("stroke-dashoffset", function(d){ return this.getTotalLength() });

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke", "#ff7f0e")
        .attr("d", carbs)
        .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
        .attr("stroke-dashoffset", function(d){ return this.getTotalLength() });

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke", "#2ca02c")
        .attr("d", fat)
        .attr("stroke-dasharray", function(d){ return this.getTotalLength() })
        .attr("stroke-dashoffset", function(d){ return this.getTotalLength() });

      var t = d3.transition()
        .duration(1000)
        .ease(d3.easeLinear);

      svg.selectAll(".line").transition(t)
          .attr("stroke-dashoffset", 0);

    } else {

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

    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .style("fill", "#1f77b4")
      .attr("r", 2.5)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.protein); });

    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .style("fill", "#ff7f0e")
      .attr("r", 2.5)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.carbohydrates); });

    svg.selectAll("dot")
      .data(data)
      .enter().append("circle")
      .style("fill", "#2ca02c")
      .attr("r", 2.5)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.fat); });

    if (this.state.datesInfo.length > 1) {
      svg.append("text")
        .attr("transform", "translate(" + ( width + 3 ) + "," + y( data[data.length-1].protein ) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#1f77b4")
        .text("Protein");

      svg.append("text")
        .attr("transform", "translate(" + ( width + 3 ) + "," + y( data[data.length-1].carbohydrates ) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#ff7f0e")
        .text("Carbs");

      svg.append("text")
        .attr("transform", "translate(" + ( width + 3 ) + "," + y( data[data.length-1].fat ) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#2ca02c")
        .text("Fat");
    }

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1.5em")
        .style("text-anchor", "middle")
        .text("% of RDA");

    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + "," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Date");

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

  deleteDate(date) {
    $.ajax({
      method: "POST",
      url: `${path}/removedate`,
      headers: {'x-auth': this.props.state.token},
      data: {date},
      success: (data, status, xhr) => {
        this.setState({ hasDisplayed: false });
        this.props.onGetDates();
        this.getDates();
      }
    }).fail(error => Popup.alert('Unable to delete date from the database.'));
  }

};

export default Dates;

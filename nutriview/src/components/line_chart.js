import React, {Component} from 'react';

class LineChart extends Component {
  render() {
    return (
      <div className="text-center">
        <div style={{"display": "inline-block", "backgroundColor": "white", "borderRadius": "1vh", "margin": "2vh"}}>
          <div className="panel panel-default">
            <div className="panel-heading" ref="chartTitle"></div>
            <div className="panel-body">
              <div ref="lineChart">
              </div>
            </div>
            <div className="panel-footer text-center" ref="chartFooter"></div>
          </div>
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.props.onGetDetailedDates();
  }

  componentDidMount() {

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

  var data = this.props.state.datesInfo.map(function(d) {
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

};

export default LineChart;

import React, {Component} from 'react';

class FoodSummary extends Component {
  render() {
    return (
      <div className="col-sm-12 col-lg-6 text-center">
        <div style={{"display": "inline-block", "backgroundColor": "white", "borderRadius": "1vh", "margin": "2vh"}}>
          <div className="panel panel-default">
            <div className="panel-heading" ref="chartTitle"></div>
            <div className="panel-body">
              <div ref="summaryChart">
                {this.showSummary()}
              </div>
            </div>
            <div className="panel-footer text-center" ref="chartFooter"></div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.showSummary();
  }

  showSummary() {
    $(this.refs.summaryChart).html('');
    var summaryData = this.props.summary;
    var dataset = [
      { label: 'Protein', count: 1, percent: summaryData.protein },
      { label: 'Carbohydrates', count: 1, percent: summaryData.carbohydrates },
      { label: 'Fat', count: 1, percent: summaryData.fat }
    ];

    var caloriesTotal = summaryData.calories;
    var width = 400;
    var height = 400;
    var radius = Math.min(width, height) / 2;
    var insideRadius = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select(this.refs.summaryChart)
      .insert('svg',':first-child')
      .attr('class', 'rounded')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
        ',' + (height / 2) + ')');

    var arc = d3.arc()
      .innerRadius(insideRadius)
      .outerRadius(radius);

    var pie = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    var div = d3.select(this.refs.summaryChart).append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    var path = svg.selectAll('path')
      .data(pie(dataset))
      .enter()
      .append('path')
      .style('opacity', 0)
      .attr('d', function(d, i) { return arc.outerRadius(insideRadius + Math.min(d.data.percent, 100))(d, i); })
      .attr('fill', function(d) {
        return color(d.data.label);
      })
      .on('mouseover', function(d) {
        div
          .transition()
          .duration(200)
          .style('opacity', 1);
        div
          .html(d.data.label + ': ' + d.data.percent.toFixed(1) + '% of RDA')
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px');
        d3.select(this)
          .style('fill', function(d){return d3.rgb(this.getAttribute('fill')).darker(0.3);});
      })
      .on('mouseout', function(d) {
        div
          .transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(this)
          .style('fill', function(d){return d3.rgb(this.getAttribute('fill')).brighter(0.3);});
      })
      .on('mousemove', function(d) {
        div
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px');
      });

    path
      .transition()
      .delay(1000)
      .duration(1000)
      .style('opacity', 1);

    svg
      .append('circle')
        .attr('r', insideRadius)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius - 10)
        .attr('x', -7)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('0%');

    svg
      .append('circle')
        .attr('r', insideRadius + 50)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius + 40)
        .attr('x', -7 * 1.5)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('50%');

    svg
      .append('circle')
        .attr('r', insideRadius + 100)
        .style('opacity', 0.6)
        .style('stroke', 'lightgrey')
        .style('fill', 'none');

    svg
      .append('text')
        .attr('y', insideRadius + 90)
        .attr('x', -7 * 2)
        .attr('fill', 'lightgrey')
        .style('opacity', 0.6)
        .text('100%');

    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) { return d; });

    $(this.refs.chartTitle).html('<h3 class="panel-title" style="font-weight: 400; margin: 1vh 0 0 0">' + 'Collection Summary' + '</h3>');
    $(this.refs.chartFooter).html('<h4 style="font-weight: 400">' + 'Calories: ' + caloriesTotal + '</h4>');

    var svg2 = d3.select(this.refs.summaryChart).select('svg')
      .append('g')
      .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var arc2 = d3.arc()
      .innerRadius(insideRadius + 100)
      .outerRadius(insideRadius + 110);

    var pie2 = d3.pie()
      .value(function(d) { return d.count; })
      .sort(null);

    var path2 = svg2.selectAll('path')
      .data(pie2(dataset))
      .enter()
      .append('path')
      .style('opacity', 0)
      .attr('d', function(d, i) {
        if (d.data.percent > 100) {
             return arc2.outerRadius(insideRadius + 110)(d, i);
        }
      })
      .attr('fill', 'red')
      .on('mouseover', function(d) {
        div
          .transition()
          .duration(200)
          .style('opacity', 1);
        div
          .html('Exceeded recommended daily ' + d.data.label + ' limit')
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px');
        d3.select(this)
          .style('fill', function(d){return d3.rgb(this.getAttribute('fill')).darker(0.3);});
      })
      .on('mouseout', function(d) {
        div
          .transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(this)
          .style('fill', function(d){return d3.rgb(this.getAttribute('fill')).brighter(0.3);});
      })
      .on('mousemove', function(d) {
        div
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px');
      });

    path2
      .transition()
      .delay(2000)
      .duration(1000)
      .style('opacity', 1);
  }
};

export default FoodSummary;

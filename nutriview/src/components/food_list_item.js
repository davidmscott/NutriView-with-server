import React, {Component} from 'react';

class FoodListItem extends Component {
  render() {
    return (
      <div style={{"display": "inline-block", "backgroundColor": "white", "borderRadius": "1vh", "margin": "2vh"}}>
        <div className="panel panel-default">
          <div className="panel-heading" ref="chartTitle">
            <button
              onClick={() => this.props.onDeleteFood(this.props.id)}
              className="btn btn-danger"
              style={{"float": "right"}}
            >X</button>
          </div>
          <div className="panel-body">
            <div ref="pieChart"></div>
          </div>
          <div className="panel-footer text-center" ref="chartFooter"></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    var responseBody = this.props.foodItem;
    var dataset = [
      { label: 'Protein', count: 1 },
      { label: 'Carbohydrates', count: 1 },
      { label: 'Fat', count: 1 }
    ];

    var calories = responseBody.calories;
    var foodMatch = responseBody.ingredients[0].parsed[0].foodMatch;
    var quantity = responseBody.ingredients[0].parsed[0].quantity;
    var measure = responseBody.ingredients[0].parsed[0].measure;
    var totalDaily = responseBody.totalDaily;
    dataset[2].percent = totalDaily.FAT ? totalDaily.FAT.quantity : 0;
    dataset[1].percent = totalDaily.CHOCDF ? totalDaily.CHOCDF.quantity : 0;
    dataset[0].percent = totalDaily.PROCNT ? totalDaily.PROCNT.quantity : 0;
    var width = 400;
    var height = 400;
    var radius = Math.min(width, height) / 2;
    var insideRadius = 75;
    var legendRectSize = 18;
    var legendSpacing = 4;
    var foodDesc = '';
    if (quantity) {
      foodDesc += quantity + ' ';
    }
    if (measure) {
      foodDesc += measure + ' ';
    }
    if (foodMatch) {
      foodDesc += foodMatch;
    } else {
      foodDesc = '';
    }

    $(this.refs.chartFooter).append('<h4 style="font-weight: 200;">' + 'Calories: ' + calories + '</h4>');

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    // var color = d3.scaleOrdinal()
    // 	.range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']);

    var svg = d3.select(this.refs.pieChart)
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

    var div = d3.select(this.refs.pieChart).append('div')
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
          .transition()
          .duration(1000)
          .ease(d3.easeBounceOut)
          .attr('d', function(d, i) { return arc.innerRadius(0.1 * (insideRadius + Math.min(d.data.percent, 100)) + insideRadius)(d, i); })
          .attr('d', function(d, i) { return arc.outerRadius(1.1 * (insideRadius + Math.min(d.data.percent, 100)))(d, i); });
      })
      .on('mouseout', function(d) {
        div
          .transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(this)
          .transition()
          .duration(1000)
          .ease(d3.easeBounceOut)
          .attr('d', function(d, i) { return arc.innerRadius(insideRadius)(d, i); })
          .attr('d', function(d, i) { return arc.outerRadius(insideRadius + Math.min(d.data.percent, 100))(d, i); });
      })
      .on('mousemove', function(d) {
        div
          .style('left', d3.event.layerX + 20 + 'px')
          .style('top', d3.event.layerY - 10 + 'px')
      });

    path
      .transition()
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
        .text('0%')
        .transition()
        .duration(4000)
        .style('opacity', 1);

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

    $(this.refs.chartTitle).prepend('<h3 class="panel-title" style="font-weight: 200; display: inline; margin: 1vh 0 0 2vh; float: left;">' + foodDesc + '</h3>').css('textTransform', 'capitalize');
  }

}

export default FoodListItem;

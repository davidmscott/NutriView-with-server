import React, {Component} from 'react';

class LineChart extends Component {
  render() {
    return (
      <div className="col-sm-12 col-lg-6 text-center">
        <div style={{"display": "inline-block", "backgroundColor": "white", "borderRadius": "1vh", "margin": "2vh"}}>
          <div className="panel panel-default">
            <div className="panel-heading" ref="chartTitle"></div>
            <div className="panel-body">
              <div ref="summaryChart">
                {this.props.onGetDetailedDates()}
              </div>
            </div>
            <div className="panel-footer text-center" ref="chartFooter"></div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
  }

};

export default LineChart;

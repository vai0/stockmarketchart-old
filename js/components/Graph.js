import React from 'react';
import Highcharts from 'highcharts/highstock';

class Graph extends React.Component {
  constructor(props) {
    super(props);
  }

  createChart() {
    var series = this.props.stocks.filter(stock => stock.visibility === 'on');
    Highcharts.stockChart('Graph', {
      rangeSelector: {
        selected: 4
      },
      yAxis: {
        labels: {
          formatter: function () {
            return '$' + this.value;
          }
        },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
      },
      series: series
    });
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  render() {
    return (
      <div id="Graph"></div>
    );
  }
}

export default Graph;

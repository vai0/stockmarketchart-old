import React from 'react';
import Highcharts from 'highcharts/highstock';
import 'css/_graph.scss';
import moment from 'moment';

class Graph extends React.Component {
  constructor(props) {
    super(props);
  }

  createChart() {
    var containerRightWidth = document.querySelector('.container-right').offsetWidth;
    var series = this.props.stocks.filter(stock => stock.visibility === 'on');
    Highcharts.stockChart('Graph', {
      rangeSelector: {
        selected: 3,
        enabled: false
        // inputEnabled: false,
        // buttonPosition: {
        //   x: containerRightWidth - 270,
        //   y: 0
        // }
      },
      yAxis: {
        labels: {
          formatter: function () {
            return '$' + this.value;
          }
        },
        plotLines: [{
          value: 0,
          width: 1,
        }]
      },
      tooltip: {
        useHTML: true,
        formatter: function() {
          var date = moment(this.x).format('MMMM Do, YYYY');
          // console.log(date);
          // console.log('this.y: ', this.y);
          // return '<div class="tooltip"><div class="header">' + date + '</div><div class="main">' + this.y + '</div></div>';
          // console.log(this.points[0].series.name);
          return '<div class="tooltip" style="border-color:' + this.points[0].series.color + '"><div class="date">' + date + '</div><div class="symbol">' + this.points[0].series.name + ' ' + this.y + '</div></div>';
        },
        // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>',
        valueDecimals: 2,
        // split: true
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

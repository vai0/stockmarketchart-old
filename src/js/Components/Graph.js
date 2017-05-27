import React from 'react';
import Highcharts from 'highcharts/highstock';
import moment from 'moment';
import 'css/_graph.scss';

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
        style: {
          "color": "#9AA5BC",
          "cursor": "default",
          "fontSize": "12px",
          "pointerEvents": "none",
          "whiteSpace": "nowrap"
        },
        pointFormat: '<span style="color:{series.color}">{series.name}</span>:  <b>{point.y}</b><br/>',
        valueDecimals: 2,
        // shared: true
        // split: true
      },
      xAxis: {
        labels: {
          style: {
            "color": "#9AA5BC",
            "fontFamily": "'Avenir-Next-Regular', Verdana, Geneva, sans-serif;"
          }
        }
      },
      yAxis: {
        labels: {
          format: '$ {value}',
          style: {
            "color": "#9AA5BC",
            "fontFamily": "'Avenir-Next-Regular', Verdana, Geneva, sans-serif;"
          }
        }
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

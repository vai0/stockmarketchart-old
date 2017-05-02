import axios from 'axios';
import Highcharts from 'highcharts/highstock';

document.addEventListener('DOMContentLoaded', function() {

  let series = [];
  let symbols = ['MSFT', 'AAPL', 'GOOG'];
  const apiKey = 'RLrmhU3zFMs977RD32JQ';

  function createChart() {
    Highcharts.stockChart('test', {
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

      // plotOptions: {
      //   series: {
      //     compare: 'percent',
      //     showInNavigator: true
      //   }
      // },

      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
      },

      series: series
    });
  }

  let promises = symbols.map(function(symbol) {
    return axios.get('https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '.json', {
        params: {
          api_key: apiKey,
          start_date: '2012-04-01',
          column_index: 4
        }
      });
  });

  axios.all(promises)
    .then(function(responses) {
      responses.map(function(response) {
        let parsedData = response.data.dataset.data.map(price => [Date.parse(price[0]), price[1]]).reverse();
        series.push({
          name: response.data.dataset.dataset_code,
          data: parsedData
        });
      });
      if (symbols.length === series.length) {
        createChart();
      }
    })
    .catch(function(error) {
      console.log(error);
    });
});

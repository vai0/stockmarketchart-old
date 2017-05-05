import axios from 'axios';
import moment from 'moment';
import Highcharts from 'highcharts/highstock';

document.addEventListener('DOMContentLoaded', function() {

  const PROXY = 'https://cors-anywhere.herokuapp.com/';
  var symbols = ['MSFT', 'AAPL', 'GOOGL'];
  var elements = symbols.map(function(symbol) {
    return {
      Symbol: symbol,
      Type: 'price',
      Params: ['c']
    }
  });
  var series = symbols.map(function(symbol) {
    return {
      name: symbol
    }
  });

  //stock-list data requests
  var promises = symbols.map(function(symbol) {
    return axios.get(PROXY + 'http://dev.markitondemand.com/Api/v2/Quote/json', {
      params: {
        symbol: symbol
      }
    });
  });

  //add chart data request
  promises.push(axios.get(PROXY + 'http://dev.markitondemand.com/Api/v2/InteractiveChart/json', {
    params: {
      parameters: {
        Normalized: false,
        NumberOfDays: 1830,
        DataPeriod: 'Day',
        Elements: elements
      }
    }
  }));

  axios.all(promises)
    .then(function(responses) {
      responses.forEach(function(response) {
        var data = response.data;
        if (data.LastPrice) {
        // get quote data
          series.forEach(function(stock) {
            if (stock.name === data.Symbol) {
              stock.fullName = data.Name;
              stock.change = data.Change;
              stock.changePercent = data.ChangePercent;
              stock.lastPrice = data.LastPrice;
            }
          });
        } else {
        // get chart data
          series.forEach(function(stock) {
            var dates = data.Dates.map(date => Date.parse(date));
            data.Elements.forEach(function(el) {
              series.forEach(function(stock) {
                if (stock.name === el.Symbol) {
                  stock.data = el.DataSeries.close.values.map((price, i) => [dates[i], price]);
                }
              });
            });
          });
        }
      });
      console.log('series: ', series);
      createChart();
    })
    .catch(error => console.log(error));

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
});

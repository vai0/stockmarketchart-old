import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Highcharts from 'highcharts/highstock';
import * as helper from '../helpers.js'
import '../../css/App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      stocks: {}
    };
  }
  componentDidMount() {
    //bypass CORS policy with a proxy
    const PROXY = 'https://cors-anywhere.herokuapp.com/';
    var self = this;
    var symbols = ['MSFT', 'AAPL', 'NVDA'];
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
        self.setState({
          dataLoaded: true,
          stocks: series
        });
      })
      .catch(error => console.log(error));
  }
  render() {
    var components = null;
    if (this.state.dataLoaded) {
      components = (
        <div className="App">
          <StockList stocks={this.state.stocks} />
          <Graph stocks={this.state.stocks} />
        </div>
      );
    } else {
      components = (
        <div className="App">
          <LoadingIcon />
        </div>
      );

    }
    return components;
  }
}

class Graph extends React.Component {
  createChart() {
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
      series: this.props.stocks
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

class StockList extends React.Component {
  render() {
    return (
      <div className="StockList">
        {this.props.stocks.map(function(stock, i) {
          return <Stock stock={stock} key={i} />
        })}
      </div>
    );
  }
}

class Stock extends React.Component {
  render() {
    return (
      <div className="Stock">
        <div className="Stock-left">
          <div className="Stock-symbol">{this.props.stock.name}</div>
          <div className="Stock-fullName">{this.props.stock.fullName}</div>
        </div>
        <div className="Stock-right">
          <div className="Stock-price">{'$' + helper.round(this.props.stock.lastPrice, 2).toFixed(2)}</div>
          <div className="Stock-changePercent">{helper.appendSign(helper.round(this.props.stock.changePercent, 2).toFixed(2)) + '%'}</div>
        </div>
      </div>
    );
  }
}

class LoadingIcon extends React.Component {
  render() {
    return (
      <div className="LoadingIcon">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    );;
  }
}

export default App;

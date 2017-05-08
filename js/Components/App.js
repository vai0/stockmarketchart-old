import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Highcharts from 'highcharts/highstock';
import * as helper from '../helpers.js'
import '../../css/App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
    this._removeStock = this._removeStock.bind(this);
    this._addStock = this._addStock.bind(this);
    this.state = {
      dataLoaded: false,
      stocks: {}
    };
  }

  componentDidMount() {
    //bypass CORS policy with a proxy
    const PROXY = 'https://cors-anywhere.herokuapp.com/';
    // const PROXY = '';
    var alphavantageAPIKEY = 'U1KE';
    var quandlAPIKEY = 'RLrmhU3zFMs977RD32JQ';
    var self = this;
    var promises = [];
    // var symbols = ['MSFT'];
    var symbols = ['MSFT', 'NVDA', 'FB'];
    // var symbols = ['MSFT', 'AAPL', 'GOOGL', 'BABA', 'AMD', 'INTU', 'FB', 'NVDA', 'S', 'BAC', 'GE', 'DIS', 'T', 'TMUS', 'ATVI'];
    var colors = ['#FF1744', '#D500F9', '#00E676', '#00E5FF', '#FFEA00',
      '#FF3D00', '#F50057', '#651FFF', '#1DE9B6', '#C6FF00',
      '#3D5AFE', '#00B0FF', '#76FF03', '#FFC400'];

    var series = symbols.map(function(symbol, i) {
      var color = colors[i] ? colors[i] : colors[i % (colors.length - 1)];
      return {
        name: symbol,
        color: color
      }
    });

    //current quote requests
    symbols.forEach(function(symbol) {
      promises.push(axios.get(PROXY + 'http://dev.markitondemand.com/Api/v2/Quote/json', {
        params: {
          symbol: symbol
        }
      }));

      promises.push(axios.get(PROXY + 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '.json', {
        params: {
          api_key: quandlAPIKEY,
          column_index: 4,
          start_date: '2012-01-01'
        }
      }));
    });

    console.log('promises: ', promises);

    axios.all(promises)
      .then(function(responses) {
        responses.forEach(function(response) {
          console.log('response: ', response)
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
              if (stock.name === data.dataset.dataset_code) {
                stock.data = data.dataset.data.map(set => [Date.parse(set[0]), set[1]]).reverse();
              }
            });
          }
        });
        self.setState({
          dataLoaded: true,
          stocks: series
        });
        console.log('series: ', series);
      })
      .catch(error => console.log(error));
  }

  _removeStock(stockToDelete) {
    var newStocks = this.state.stocks.filter(stock => stock.name !== stockToDelete);
    this.setState({
      stocks: newStocks
    });
  }

  _addStock() {

  }

  render() {
    var components = null;
    if (this.state.dataLoaded) {
      components = (
        <div className="App">
          <StockList stocks={this.state.stocks} _removeStock={this._removeStock} />
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

class StockList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('StockList props: ', this.props);
    return (
      <div className="StockList">
        {this.props.stocks.map(function(stock, i) {
          return <Stock stock={stock} key={i} _removeStock={this.props._removeStock}/>
        }, this)}
      </div>
    );
  }
}

class Stock extends React.Component {
  constructor(props) {
    super(props);
    this._onRemoveStock = this._onRemoveStock.bind(this);
  }

  _onRemoveStock() {
    this.props._removeStock(this.props.stock.name);
  }

  render() {
    return (
      <div className="Stock">
        <div className="Stock-left">
          <div className="Stock-symbol">{this.props.stock.name}</div>
          <div className="Stock-fullName">{this.props.stock.fullName}</div>
        </div>
        <div className="Stock-right">
          <div className="values">
            <div className="Stock-price">{'$' + helper.round(this.props.stock.lastPrice, 2).toFixed(2)}</div>
            <div className="Stock-changePercent">{helper.appendSign(helper.round(this.props.stock.changePercent, 2).toFixed(2)) + '%'}</div>
          </div>
          <div className="buttons">
            <button className="Stock-remove-button" onClick={this._onRemoveStock}>X</button>
            <button className="Stock-view-button">V</button>
          </div>
        </div>
      </div>
    );
  }
}

class Graph extends React.Component {
  constructor(props) {
    super(props);
  }

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

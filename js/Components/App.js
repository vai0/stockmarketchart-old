import React from 'react';
import axios from 'axios';

import LoadingIcon from 'components/LoadingIcon';
import StockList from 'components/StockList';
import Graph from 'components/Graph';
import Searchbar from 'components/Searchbar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this._removeStock = this._removeStock.bind(this);
    this._addStock = this._addStock.bind(this);
    this._fetchStocks = this._fetchStocks.bind(this);
    this._setStockColors = this._setStockColors.bind(this);
    this._setAllVisibilityOn = this._setAllVisibilityOn.bind(this);
    this._toggleVisibility = this._toggleVisibility.bind(this);

    this.state = {
      dataLoaded: false,
      stocks: [
        {
          name: '',
          description: '',
          color: '',
          lastPrice: 0,
          change: 0,
          changePercent: 0,
          visibility: 'on',
          data: [
            []
          ]
        }
      ]
    };
  }

  _setStockColors(series) {
    const colors = ['#FF1744', '#D500F9', '#00E676', '#00E5FF', '#FFEA00',
      '#FF3D00', '#F50057', '#651FFF', '#1DE9B6', '#C6FF00',
      '#3D5AFE', '#00B0FF', '#76FF03', '#FFC400'];

    return series.map(function(stock, i) {
      var color = colors[i] ? colors[i] : colors[i % (colors.length - 1)];
      var newStock = stock;
      newStock.color = color;
      return newStock;
    });
  }

  _setAllVisibilityOn(series) {
    return series.map(stock => stock.visibility = 'on');
  }

  _toggleVisibility(symbol) {
    var newStock = this.state.stocks.slice(0);
    newStock.forEach(function(stock) {
      if (stock.name === symbol) {
        if (stock.visibility === 'off') {
          stock.visibility = 'on';
        } else {
          stock.visibility = 'off';
        }
      }
    });
    this.setState({
      stocks: newStock
    });
  }

  _fetchStocks(newStock) {
    const tradierACCESSTOKEN = 'xa1Vmgd789il8HHsTGuhZ1f0kzgJ';
    const self = this;
    var promises = [];
    var symbols;
    var series;

    if (this.state.stocks[0].name === '') {
      symbols = ['MSFT', 'FB', 'NVDA'];
    } else {
      symbols = [ newStock ];
    }

    series = symbols.map(function(symbol) {
      return {
        name: symbol
      }
    });
    // symbols = ['MSFT', 'AAPL', 'GOOGL', 'BABA', 'AMD', 'INTU', 'FB', 'NVDA', 'S', 'BAC', 'GE', 'DIS', 'T', 'TMUS', 'ATVI'];

    this._setAllVisibilityOn(series);

    //historical pricing
    symbols.forEach(function(symbol) {
      promises.push(axios.get('https://sandbox.tradier.com/v1/markets/history', {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + tradierACCESSTOKEN
        },
        params: {
          symbol: symbol,
          interval: 'daily',
          start: '2012-01-01'
        }
      }));
    });

    //quotes
    promises.push(axios.get('https://sandbox.tradier.com/v1/markets/quotes', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + tradierACCESSTOKEN
      },
      params: {
        symbols: symbols.join(',')
      }
    }));

    axios.all(promises)
      .then(function(responses) {
        responses.forEach(function(response, i) {
          console.log('response.data: ', response.data);
          var data = response.data;
          if (data.history) {
            series[i].data = data.history.day.map(day => [Date.parse(day.date), day.close]);
          } else if (data.quotes) {
            var quotes = data.quotes.quote;
            if (quotes.length > 1) {
              quotes.forEach(function(quote, j) {
                series[j].description = quote.description;
                series[j].lastPrice = quote.last;
                series[j].changePercent = quote.change_percentage;
                series[j].change = quote.change;
              });
            } else {
              series[0].description = quotes.description;
              series[0].lastPrice = quotes.last;
              series[0].changePercent = quotes.change_percentage;
              series[0].change = quotes.change;
            }
          } else {
            console.log('some unexpected response: ', response.data);
          }
        });

        var newSeries;
        if (self.state.stocks[0].name === '') {
          newSeries = series;
        } else {
          newSeries = self.state.stocks.slice(0);
          newSeries.push(series[0]);
        }

        newSeries = self._setStockColors(newSeries);

        self.setState({
          dataLoaded: true,
          stocks: newSeries
        });
        console.log('series: ', series);
      })
      .catch(error => console.log(error));
  }

  componentDidMount() {
    this._fetchStocks();
  }

  _removeStock(stockToDelete) {
    var newStocks = this.state.stocks.filter(stock => stock.name !== stockToDelete);
    this.setState({
      stocks: newStocks
    });
  }

  _addStock(symbol) {
    var newStock = symbol.trim().toUpperCase();
    var exist = this.state.stocks.filter(stock => stock.name === newStock);
    if (exist.length === 0) {
      this._fetchStocks(newStock)
    } else {
      console.log(newStock + ' stock already exists');
    }
  }

  render() {
    var components = null;
    if (this.state.dataLoaded) {
      components = (
        <div className="App">
          <div className="container-left">
            <StockList stocks={this.state.stocks} _removeStock={this._removeStock} _toggleVisibility={this._toggleVisibility}/>
          </div>
          <div className="container-right">
            <Searchbar stocks={this.state.stocks} _addStock={this._addStock} />
            <Graph stocks={this.state.stocks} />
          </div>
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

export default App;

import React from 'react';
import axios from 'axios';

import LoadingIcon from 'components/LoadingIcon';
import StockList from 'components/StockList';
import Graph from 'components/Graph';
import Searchbar from 'components/Searchbar';

import { API_HOST } from 'config';

const COLORS = [
  '#FF1744',
  '#D500F9',
  '#00E676',
  '#00E5FF',
  '#FFEA00',
  '#3D5AFE',
  '#F50057',
  '#651FFF',
  '#1DE9B6',
  '#C6FF00',
  '#FF3D00',
  '#00B0FF',
  '#76FF03',
  '#FFC400'
];

let lastColorIdx = 0;

const setStockColor = () => {
  const color = COLORS[lastColorIdx];
  lastColorIdx++;
  return color;
};

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      initLoad: false,
      stocks: []
    };
  }

  _toggleVisibility = symbol => {
    const { stocks } = this.state;
    this.setState({
      stocks: stocks.map(s => {
        if (s.symbol === symbol) s.display = !s.display;
        return s;
      })
    });
  };

  _fetchChart = symbol => {
    return axios
      .get(`${API_HOST}/stock/${symbol}/chart/ytd`)
      .then(resp => resp.data.map(day => [Date.parse(day.date), day.close]));
  };

  _fetchQuote = symbol => {
    return axios.get(`${API_HOST}/stock/${symbol}/quote`).then(resp => {
      const s = resp.data;
      return {
        symbol: s.symbol,
        price: s.latestPrice,
        change: s.change,
        changePercent: s.changePercent
      };
    });
  };

  _fetchMeta = symbol => {
    return axios.get(`${API_HOST}/stock/${symbol}/company`).then(resp => {
      const s = resp.data;
      return {
        symbol: s.symbol,
        name: s.companyName
      };
    });
  };

  _fetchStock = symbol => {
    const { stocks } = this.state;

    // check if stock already exists
    const stockExists = stocks.some(s => s.symbol === symbol);

    if (!stockExists) {
      const meta = this._fetchMeta(symbol);
      const quote = this._fetchQuote(symbol);
      const chart = this._fetchChart(symbol);
      const stock = {
        symbol: symbol.toUpperCase(),
        color: setStockColor(),
        display: true
      };

      return Promise.all([meta, quote, chart, stock]);
    } else {
      return null;
    }
  };

  _joinStockData = ({ meta, quote, chart, stock }) => ({
    symbol: stock.symbol,
    color: stock.color,
    display: stock.display,
    name: meta.name,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    data: chart
  });

  _addStock = symbol => {
    if (this._fetchStock(symbol)) {
      this._fetchStock(symbol).then(([meta, quote, chart, stock]) => {
        this.setState({
          stocks: [
            ...this.state.stocks,
            this._joinStockData({ meta, quote, chart, stock })
          ]
        });
      });
    }
  };

  _removeStock = symbol => {
    const { stocks } = this.state;
    this.setState({
      stocks: stocks.filter(s => s.symbol !== symbol)
    });
  };

  componentDidMount() {
    const init = ['FB', 'MSFT', 'NVDA', 'AAPL'];

    Promise.all(init.map(s => this._fetchStock(s))).then(resp => {
      const stocks = resp.map(([meta, quote, chart, stock]) =>
        this._joinStockData({ meta, quote, chart, stock })
      );

      this.setState({
        initLoad: true,
        stocks
      });
    });
  }

  render() {
    const { initLoad, stocks } = this.state;

    if (initLoad) {
      return (
        <div className="App">
          <div className="container-left">
            <StockList
              stocks={stocks}
              _removeStock={this._removeStock}
              _toggleVisibility={this._toggleVisibility}
            />
          </div>
          <div className="container-right">
            <Searchbar stocks={stocks} _addStock={this._addStock} />
            <Graph series={stocks.filter(s => s.display)} />
          </div>
        </div>
      );
    } else {
      return <LoadingIcon />;
    }
  }
}

export default App;

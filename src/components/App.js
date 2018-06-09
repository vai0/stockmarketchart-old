import React from "react";
import axios from "axios";

import LoadingIcon from "components/LoadingIcon";
import StockList from "components/StockList";
import Graph from "components/Graph";
import Searchbar from "components/Searchbar";

import { API_HOST } from "config";

const COLORS = [
    "#FF1744",
    "#D500F9",
    "#00E676",
    "#00E5FF",
    "#FFEA00",
    "#3D5AFE",
    "#F50057",
    "#651FFF",
    "#1DE9B6",
    "#C6FF00",
    "#FF3D00",
    "#00B0FF",
    "#76FF03",
    "#FFC400"
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
            loaded: false,
            stocks: []
        };
    }

    _toggleVisibility = symbol => {
        this.setState({
            stocks: this.state.stocks.map(s => {
                if (s.symbol === symbol) s.display = !s.display;
                return s;
            })
        });
    };

    _fetchChart = symbol => {
        return axios
            .get(`${API_HOST}/stock/${symbol}/chart/ytd`)
            .then(resp =>
                resp.data.map(day => [Date.parse(day.date), day.close])
            );
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
                name: s.companyName,
                description: s.description
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
        }
    };

    _joinStockData = (meta, quote, chart, stock) => {
        return;
    };

    _addStock = symbol => {
        const { stocks } = this.state;

        this._fetchStock(symbol).then(([meta, quote, chart, stock]) => {
            this.setState({
                stocks: [
                    ...stocks,
                    {
                        symbol: stock.symbol,
                        color: stock.color,
                        display: stock.display,
                        name: meta.companyName,
                        description: meta.description,
                        price: quote.latestPrice,
                        change: quote.change,
                        changePercent: quote.changePercent,
                        chart
                    }
                ]
            });
        });
    };

    _removeStock = symbol => {
        const { metas, quotes, charts, stocks } = this.state;

        this.setState({
            stocks: stocks.filter(s => s.symbol !== symbol),
            charts: charts.filter(s => s.symbol !== symbol)
        });
    };

    componentDidMount() {
        ["FB", "MSFT", "NVDA", "AAPL"].forEach(s => this._addStock(s));

        // Promise.all(init.map(s => this._fetchStock(s))).then(resp => {
        //     const metas = resp.map(stock => stock[0]);
        //     const quotes = resp.map(stock => stock[1]);
        //     const charts = resp.map(stock => stock[2]);
        //     const stocks = resp.map(stock => stock[3]);

        //     Promise.all([
        //         Promise.all(metas),
        //         Promise.all(quotes),
        //         Promise.all(charts)
        //     ]).then(([metas, quotes, charts]) => {
        //         this.setState({
        //             loaded: true,
        //             metas,
        //             quotes,
        //             charts,
        //             stocks
        //         });
        //     });
        // });
    }

    render() {
        let components = null;
        if (this.state.loaded) {
            components = (
                <div className="App">
                    <div className="container-left">
                        <StockList
                            quotes={this.state.quotes}
                            metas={this.state.metas}
                            stocks={this.state.stocks}
                            _removeStock={this._removeStock}
                            _toggleVisibility={this._toggleVisibility}
                        />
                    </div>
                    <div className="container-right">
                        <Searchbar
                            stocks={this.state.stocks}
                            _addStock={this._addStock}
                        />
                        <Graph stocks={this.state.charts} />
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

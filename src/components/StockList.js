import React from "react";
import Stock from "components/Stock";

class StockList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="StockList">
                <div className="title">My Stocks</div>
                {this.props.stocks.map(function(stock) {
                    return (
                        <Stock
                            stock={stock}
                            key={stock.symbol}
                            _removeStock={this.props._removeStock}
                            _toggleVisibility={this.props._toggleVisibility}
                        />
                    );
                }, this)}
            </div>
        );
    }
}

export default StockList;

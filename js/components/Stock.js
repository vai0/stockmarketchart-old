import React from 'react';
import * as helper from 'helpers'

class Stock extends React.Component {
  constructor(props) {
    super(props);
    this._onRemoveStock = this._onRemoveStock.bind(this);
    this._handleViewClick = this._handleViewClick.bind(this);
  }

  _onRemoveStock() {
    this.props._removeStock(this.props.stock.name);
  }

  _handleViewClick() {
    this.props._toggleVisibility(this.props.stock.name);
  }

  render() {
    return (
      <div className="Stock">
        <div className="Stock-left">
          <div className="Stock-symbol">{this.props.stock.name}</div>
          <div className="Stock-fullName">{this.props.stock.description}</div>
        </div>
        <div className="Stock-right">
          <div className="values">
            <div className="Stock-price">{'$' + helper.round(this.props.stock.lastPrice, 2).toFixed(2)}</div>
            <div className="Stock-changePercent">{helper.appendSign(helper.round(this.props.stock.changePercent, 2).toFixed(2)) + '%'}</div>
          </div>
          <div className="buttons">
            <button className="Stock-remove-button" onClick={this._onRemoveStock}>X</button>
            <button className="Stock-view-button" onClick={this._handleViewClick}>V</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Stock;

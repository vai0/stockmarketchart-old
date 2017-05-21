import React from 'react';
import * as helper from 'helpers'

class Stock extends React.Component {
  constructor(props) {
    super(props);
    this._onRemoveStock = this._onRemoveStock.bind(this);
    this._handleViewClick = this._handleViewClick.bind(this);
    this._renderButtons = this._renderButtons.bind(this);
    this._renderColorTab = this._renderColorTab.bind(this);
  }

  _onRemoveStock() {
    this.props._removeStock(this.props.stock.name);
  }

  _handleViewClick() {
    this.props._toggleVisibility(this.props.stock.name);
  }

  _renderButtons() {
    var viewButtonClass = (this.props.stock.visibility === 'on') ? 'stock-view-show-button stock-button' : 'stock-view-hidden-button stock-button';
    return (
      <div className="buttons">
        <span className={viewButtonClass} onClick={this._handleViewClick}></span>
        <span className="stock-remove-button stock-button" onClick={this._onRemoveStock}></span>
      </div>
    );
  }

  _renderColorTab() {
    return (this.props.stock.visibility === 'on') ? <div className="color-tab" style={{ backgroundColor: this.props.stock.color }}></div> : null;
  }

  componentDidMount() {
    var stock = this.refs.stock;
    var stockContainer = this.refs.stockContainer;
    var stockFlyIn = this.refs.stockFlyIn;

    // hide stock-fly-in div
    var stockFlyInOffset = stockContainer.offsetWidth;
    stockFlyIn.style.transform = 'translate3d(-' + stockFlyInOffset + 'px, 0, 0)';
    stockFlyIn.style.display = 'flex';

    window.addEventListener('resize', function(e) {
      stockFlyInOffset = stockContainer.offsetWidth;
      stockFlyIn.style.transform = 'translate3d(-' + stockFlyInOffset + 'px, 0, 0)';
    })

    stock.addEventListener('mouseover', function(e) {
      stockFlyIn.style.transform = 'translate3d(0, 0, 0)';
      stockContainer.style.transform = 'translate3d(' + stockFlyInOffset + 'px, 0, 0)';
    });

    stock.addEventListener('mouseout', function(e) {
      stockFlyIn.style.transform = 'translate3d(-' + stockFlyInOffset + 'px, 0, 0)';
      stockContainer.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  render() {
    var netColor = (this.props.stock.changePercent > 0) ? '#1BCEA2': '#FF5722';
    return (
      <div className="Stock" ref="stock">
        {this._renderColorTab()}
        <div className="stock-fly-in" style={{ backgroundColor: this.props.stock.color }} ref="stockFlyIn">
          <div className="stock-left">
            <div className="stock-symbol">{this.props.stock.name}</div>
            <div className="stock-full-name">{this.props.stock.description}</div>
          </div>
          <div className="stock-right">
            {this._renderButtons()}
          </div>
        </div>
        <div className="stock-container" ref="stockContainer">
          <div className="stock-left">
            <div className="stock-symbol">{this.props.stock.name}</div>
            <div className="stock-full-name">{this.props.stock.description}</div>
          </div>
          <div className="stock-right">
            <div className="stock-price" style={{ color: netColor }}>{'$ ' + helper.round(this.props.stock.lastPrice, 2).toFixed(2)}</div>
            <div className="stock-changePercent" style={{ color: netColor }}>{helper.appendSign(helper.round(this.props.stock.changePercent, 2).toFixed(2)) + ' %'}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Stock;

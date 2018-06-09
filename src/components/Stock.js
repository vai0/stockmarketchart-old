import React from 'react';

class Stock extends React.Component {
  _onRemoveStock = () => {
    const { _removeStock, stock } = this.props;
    _removeStock(stock.symbol);
  };

  _handleViewClick = () => {
    const { _toggleVisibility, stock } = this.props;
    _toggleVisibility(stock.symbol);
  };

  _renderButtons = () => {
    const { stock } = this.props;
    const viewButtonClass =
      stock.visibility === 'on'
        ? 'stock-view-show-button stock-button'
        : 'stock-view-hidden-button stock-button';

    return (
      <div className="buttons">
        <span className={viewButtonClass} onClick={this._handleViewClick} />
        <span
          className="stock-remove-button stock-button"
          onClick={this._onRemoveStock}
        />
      </div>
    );
  };

  _renderColorTab = () => {
    const { display, color } = this.props.stock;
    return display ? (
      <div className="color-tab" style={{ backgroundColor: color }} />
    ) : null;
  };

  componentDidMount() {
    const { stock, stockContainer, stockFlyIn } = this.refs;

    this.resizeEvent = () => {
      stockFlyInOffset = stockFlyIn.offsetWidth;
      stockFlyIn.style.transform =
        'translate3d(-' + stockFlyInOffset + 'px, 0, 0)';
    };

    this.mouseoverEvent = () => {
      stockFlyIn.style.transform = 'translate3d(0, 0, 0)';
      stockContainer.style.transform =
        'translate3d(' + stockFlyInOffset + 'px, 0, 0)';
    };

    this.mouseoutEvent = () => {
      stockFlyIn.style.transform =
        'translate3d(-' + stockFlyInOffset + 'px, 0, 0)';
      stockContainer.style.transform = 'translate3d(0, 0, 0)';
    };

    // hide stock-fly-in div
    var stockFlyInOffset = 120;
    stockFlyIn.style.transform =
      'translate3d(-' + stockFlyInOffset + 'px, 0, 0)';
    stockFlyIn.style.display = 'flex';

    window.addEventListener('resize', this.resizeEvent);
    stock.addEventListener('mouseover', this.mouseoverEvent);
    stock.addEventListener('mouseout', this.mouseoutEvent);
  }

  componentWillUnmount() {
    const { stock } = this.refs;
    window.removeEventListener('resize', this.resizeEvent);
    stock.removeEventListener('mouseover', this.mouseoverEvent);
    stock.removeEventListener('mouseout', this.mouseoutEvent);
  }

  render() {
    const { symbol, color, name, price, changePercent } = this.props.stock;
    const netColor = changePercent > 0 ? '#1BCEA2' : '#FF5722';

    return (
      <div className="Stock" ref="stock">
        {this._renderColorTab()}
        <div
          className="stock-fly-in"
          style={{ backgroundColor: color }}
          ref="stockFlyIn"
        >
          {this._renderButtons()}
        </div>
        <div className="stock-container" ref="stockContainer">
          <div className="stock-left">
            <div className="stock-symbol">{symbol}</div>
            <div className="stock-full-name">{name}</div>
          </div>
          <div className="stock-right">
            <div className="stock-price" style={{ color: netColor }}>
              {`$ ${price}`}
            </div>
            <div className="stock-changePercent" style={{ color: netColor }}>
              {`${(changePercent * 100).toFixed(2)} %`}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Stock;

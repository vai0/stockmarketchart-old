import React from 'react';
import Stock from 'components/Stock';

export default ({ stocks, _removeStock, _toggleVisibility }) => (
  <div className="StockList">
    <div className="title">My Stocks</div>
    {stocks.map(stock => (
      <Stock
        stock={stock}
        key={stock.symbol}
        _removeStock={_removeStock}
        _toggleVisibility={_toggleVisibility}
      />
    ))}
  </div>
);

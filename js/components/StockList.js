import React from 'react';
import Stock from 'components/Stock';

class StockList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="StockList">
        {this.props.stocks.map(function(stock, i) {
          return <Stock stock={stock} key={i} _removeStock={this.props._removeStock} _toggleVisibility={this.props._toggleVisibility}/>
        }, this)}
      </div>
    );
  }
}

export default StockList;

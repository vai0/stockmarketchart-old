import React from 'react';

class Suggestion extends React.Component {
  _handleClick = () => {
    const { _addStock, suggestion } = this.props;
    console.log(suggestion.symbol);
    _addStock(suggestion.symbol);
  };

  _renderButton = () => {
    if (this.props.stockExists) {
      return (
        <span onClick={this._handleClick} className="stock-added-button" />
      );
    } else {
      return <span onClick={this._handleClick} className="add-stock-button" />;
    }
  };

  render() {
    const { symbol, name } = this.props.suggestion;

    return (
      <div className="suggestion">
        <div className="suggestion-left">
          <div className="suggestion-symbol">{symbol}</div>
          <div className="suggestion-full-name">{name}</div>
        </div>
        <div className="suggestion-right">{this._renderButton()}</div>
      </div>
    );
  }
}

export default Suggestion;

import React from 'react';

class Suggestion extends React.Component {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
    this._renderButton = this._renderButton.bind(this);
  }

  _handleClick() {
    this.props._addStock(this.props.suggestion.Symbol);
  }

  _renderButton() {
    if (this.props.stockExists) {
      return <button onClick={this._handleClick} className="suggestion-button">&#10004;</button>;
    } else {
      return <button onClick={this._handleClick} className="suggestion-button">+</button>;
    }
  }

  render() {
    return (
      <div className="suggestion">
        <div className="suggestion-left">
          <div className="suggestion-symbol">{this.props.suggestion.Symbol}</div>
          <div className="suggestion-name">{this.props.suggestion.Name}</div>
        </div>
        <div className="suggestion-right">
          {this._renderButton()}
        </div>
      </div>
    );
  }
}

export default Suggestion;

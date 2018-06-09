import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import Suggestion from 'components/Suggestion';
import { API_HOST } from 'config';

class Searchbar extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: [],
      symbols: []
    };
  }

  _fetchSuggestions = () => {
    axios.get(`${API_HOST}/ref-data/symbols`).then(resp => {
      this.setState({
        symbols: resp.data
      });
    });
  };

  _onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  _onSuggestionsFetchRequested = ({ value }) => {
    const inputVal = value.trim().toLowerCase();
    const inputLength = inputVal.length;
    const { symbols } = this.state;

    const suggestions =
      inputLength === 0
        ? []
        : symbols
            .filter(
              s => s.symbol.toLowerCase().slice(0, inputLength) === inputVal
            )
            .slice(0, 5);

    this.setState({
      suggestions
    });
  };

  _getSuggestionValue = suggestion => {
    return suggestion.symbol.trim().toUpperCase();
  };

  _onSuggestionSelected = () => {
    this.setState({
      value: ''
    });
  };

  _renderSuggestion = suggestion => {
    const { stocks, _addStock } = this.props;
    const addedStocks = stocks.map(s => s.symbol);
    const stockExists = addedStocks.some(
      s => s === suggestion.symbol.trim().toUpperCase()
    );

    return (
      <Suggestion
        stockExists={stockExists}
        suggestion={suggestion}
        _addStock={_addStock}
      />
    );
  };

  _renderInputComponent = inputProps => {
    return (
      <div className="inputContainer">
        <span className="search-icon" />
        <input {...inputProps} />
      </div>
    );
  };

  _onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  componentWillMount() {
    this._fetchSuggestions();
  }

  componentDidMount() {
    var input = document.querySelector('.react-autosuggest__input');
    var inputContainer = document.querySelector('.inputContainer');

    input.style.width = inputContainer.offsetWidth - 56 + 'px';

    window.addEventListener('resize', () => {
      input.style.width = inputContainer.offsetWidth - 56 + 'px';
    });
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Search by symbol',
      value,
      onChange: this._onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this._onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this._onSuggestionsClearRequested}
        getSuggestionValue={this._getSuggestionValue}
        onSuggestionSelected={this._onSuggestionSelected}
        renderSuggestion={this._renderSuggestion}
        renderInputComponent={this._renderInputComponent}
        inputProps={inputProps}
      />
    );
  }
}

export default Searchbar;

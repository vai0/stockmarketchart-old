import React from 'react';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';
import jsonp from 'jsonp';
import debounce from 'debounce';
import Suggestion from 'components/Suggestion';
import searchIcon from 'images/search_icon.svg';

class Searchbar extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._onSuggestionsFetchRequested = this._onSuggestionsFetchRequested.bind(this);
    this._getSuggestionValue = this._getSuggestionValue.bind(this);
    this._renderSuggestion = this._renderSuggestion.bind(this);
    this._onSuggestionsClearRequested = this._onSuggestionsClearRequested.bind(this);
    this._loadSuggestions = this._loadSuggestions.bind(this);
    this.debouncedLoadSuggestions = debounce(this._loadSuggestions, 300);
    this._onSuggestionSelected = this._onSuggestionSelected.bind(this);
    this._renderInputComponent = this._renderInputComponent.bind(this);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: '',
      suggestions: []
    };
  }

  _onChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  };

  _loadSuggestions(value) {
    const self = this;
    const inputValue = value.trim().toLowerCase();
    const tradierACCESSTOKEN = 'xa1Vmgd789il8HHsTGuhZ1f0kzgJ';
    const PROXY = '';

    jsonp('http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=' + value, { callback: 'jsoncallback' }, function(err, data) {
      if (err) {
        console.error('search error response: ', err.message);
      } else {
        console.log('data: ', data);
        self.setState({
          suggestions: data
        });
      }
    });
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  _onSuggestionsFetchRequested({ value }) {
    this.debouncedLoadSuggestions(value);
  };

  // When suggestion is clicked, Autosuggest needs to populate the input element
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  _getSuggestionValue(suggestion) {
    return suggestion.Symbol.trim().toUpperCase();
  }

  _onSuggestionSelected() {
    this.setState({
      value: ''
    });
  };

  // Use your imagination to render suggestions.
  _renderSuggestion(suggestion) {
    var symbols = this.props.stocks.map(stock => stock.name);
    var stockExists = false;
    for (let i = 0; i < symbols.length; i++) {
      if (symbols[i] === suggestion.Symbol) {
        stockExists = true;
        break;
      }
    }
    return <Suggestion stockExists={stockExists} suggestion={suggestion} _addStock={this.props._addStock} />;
  }

  _renderInputComponent(inputProps) {
    return (
      <div className="inputContainer">
        <span className="search-icon"></span>
        <input {...inputProps} />
      </div>
    );
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  _onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input element.
    const inputProps = {
      placeholder: 'Search for stock by symbol...',
      value,
      onChange: this._onChange,
    };

    // Finally, render it!
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

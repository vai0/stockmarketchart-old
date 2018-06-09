import React from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import debounce from "debounce";
import Suggestion from "components/Suggestion";
import searchIcon from "images/search_icon.svg";
import { API_HOST } from "config";

/**
 *
 * fetch stock reference data, set it to var
 * rewrite fetch suggestions - return relevant results that match
 *
 */

let SYMBOLS;

axios.get(`${API_HOST}/ref-data/symbols`).then(resp => {
    SYMBOLS = resp.data;
});

class Searchbar extends React.Component {
    constructor(props) {
        super(props);

        this._onChange = this._onChange.bind(this);
        this._onSuggestionsFetchRequested = this._onSuggestionsFetchRequested.bind(
            this
        );
        this._getSuggestionValue = this._getSuggestionValue.bind(this);
        this._renderSuggestion = this._renderSuggestion.bind(this);
        this._onSuggestionsClearRequested = this._onSuggestionsClearRequested.bind(
            this
        );
        this.debouncedLoadSuggestions = debounce(this._loadSuggestions, 300);
        this._onSuggestionSelected = this._onSuggestionSelected.bind(this);
        this._renderInputComponent = this._renderInputComponent.bind(this);

        this.state = {
            value: "",
            suggestions: []
        };
    }

    _onChange(event, { newValue }) {
        this.setState({
            value: newValue
        });
    }

    _onSuggestionsFetchRequested({ value }) {
        const inputVal = value.trim().toLowerCase();
        const inputLength = inputVal.length;
        return inputLength === 0
            ? []
            : SYMBOLS.filter(
                  s => s.symbol.toLowerCase().slice(0, inputLength) === inputVal
              );
    }

    _getSuggestionValue(suggestion) {
        return suggestion.symbol.trim().toUpperCase();
    }

    _onSuggestionSelected() {
        this.setState({
            value: ""
        });
    }

    // Use your imagination to render suggestions.
    _renderSuggestion(suggestion) {
        var symbols = this.props.stocks.map(stock =>
            stock.name.trim().toUpperCase()
        );
        var stockExists = false;
        for (let i = 0; i < symbols.length; i++) {
            if (symbols[i] === suggestion.symbol.trim().toUpperCase()) {
                stockExists = true;
                break;
            }
        }
        return (
            <Suggestion
                stockExists={stockExists}
                suggestion={suggestion}
                _addStock={this.props._addStock}
            />
        );
    }

    _renderInputComponent(inputProps) {
        return (
            <div className="inputContainer">
                <span className="search-icon" />
                <input {...inputProps} />
            </div>
        );
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    _onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    }

    componentDidMount() {
        var input = document.querySelector(".react-autosuggest__input");
        var inputContainer = document.querySelector(".inputContainer");

        input.style.width = inputContainer.offsetWidth - 56 + "px";

        window.addEventListener("resize", () => {
            input.style.width = inputContainer.offsetWidth - 56 + "px";
        });
    }

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input element.
        const inputProps = {
            placeholder: "Search for stock...",
            value,
            onChange: this._onChange
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

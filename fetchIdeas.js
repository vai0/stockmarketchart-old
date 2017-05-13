// data schema
{
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    color: '#349204',
    changePercent: 4.23,
    change: 2.45,
    data: [
      [1, 2],
      [2, 3],
      [3, 4]
    ]
  },
  'GOOG': {
    ...
  }
}

// assuming this.state.stocks initializes as null
var symbols = this.state.stocks || ['MSFT', 'GOOG', 'NVDA'];
var stocks = {}

symbols.forEach(function(symbol) {
  stocks[symbol] = {};
  }
})

var quotesCounter = 0;
var historicalCounter = 0;

// quotes data
jsonp('markitURL', null, function(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
  quotesCounter++;
  if (quotesCounter === symbols.length && historicalCounter === symbols.length) {
    this.setState({
      dataLoaded: true
    });
  }
});

// historical data
jsonp('markitURL', null, function(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
  historicalCounter++;
  if (quotesCounter === symbols.length && historicalCounter === symbols.length) {
    this.setState({
      dataLoaded: true
    })
  }
});

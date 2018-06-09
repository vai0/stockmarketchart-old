import React from "react";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import "scss/_graph.scss";

class Graph extends React.Component {
    _createChart() {
        const { stocks } = this.props;

        this.config = {
            rangeSelector: {
                selected: 3,
                enabled: false
            },
            yAxis: {
                labels: {
                    formatter: function() {
                        return "$" + this.value;
                    }
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1
                    }
                ]
            },
            tooltip: {
                style: {
                    color: "#9AA5BC",
                    cursor: "default",
                    fontSize: "12px",
                    pointerEvents: "none",
                    whiteSpace: "nowrap"
                },
                pointFormat:
                    '<span style="color:{series.color}">{series.name}</span>:  <b>{point.y}</b><br/>',
                valueDecimals: 2
                // shared: true
                // split: true
            },
            xAxis: {
                labels: {
                    style: {
                        color: "#9AA5BC",
                        fontFamily:
                            "'Avenir-Next-Regular', Verdana, Geneva, sans-serif;"
                    }
                }
            },
            yAxis: {
                labels: {
                    format: "$ {value}",
                    style: {
                        color: "#9AA5BC",
                        fontFamily:
                            "'Avenir-Next-Regular', Verdana, Geneva, sans-serif;"
                    }
                }
            }
        };

        this.chart = Highcharts.stockChart("Graph", {
            ...this.config,
            series: stocks.filter(s => s.display)
        });
    }

    componentDidMount() {
        this._createChart();
    }

    componentDidUpdate() {
        const { stocks } = this.props;
        const series = stocks.filter(s => s.display);
        const reDraw = true;
        const oneToOne = false;

        console.log('series: ', series);

        if (!this.chart) {
            this._createChart();
        } else {
            this.chart.update({ ...this.config, series }, reDraw, oneToOne);
        }
    }

    render() {
        return <div id="Graph" />;
    }
}

export default Graph;

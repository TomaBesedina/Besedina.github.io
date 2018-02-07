import {d3} from 'https://github.com/TomaBesedina/Besedina.github.io/tree/master/datavis/hw2'

import InteractiveBlock from "./InteractiveBlock";
import BarChart from "./BarChart";
import LineChart from "./LineChart";

const INTERACTIVE_BLOCK_ID = "interactive_block";
const BAR_CHART_BLOCK_ID = "bar_chart_block";
const BAR_CHART_ID = "bar_chart";
const LINE_CHART_BLOCK_ID = "line_chart_block";
const LINE_CHART_ID = "line_chart";
const DATE_PARSER = d3.timeParse("%Y");

export default class ContentMaker {

    constructor(contentContainer, dataProcessor) {
        this.data = dataProcessor.data;
        this.yearRange = dataProcessor.yearRange;
        const interactiveBlockElement = createInteractiveBlockElement(contentContainer);
        this.interactiveBlock = new InteractiveBlock(interactiveBlockElement, dataProcessor, this);
        const barChartElement = createChartElement(contentContainer, BAR_CHART_BLOCK_ID, BAR_CHART_ID);
        this.barChart = new BarChart(barChartElement, dataProcessor);
        this.lineChartElement = createChartElement(contentContainer, LINE_CHART_BLOCK_ID, LINE_CHART_ID);
        const lineChart = new LineChart(this.lineChartElement, dataProcessor);
        this.lineChart = lineChart;
        this.lineChartElement.on("click", function() {
            lineChart.isArea = !lineChart.isArea;
            d3.select(this).selectAll(".line_chart_value").remove();
            lineChart.updateChart(lineChart.data);
        });
    }

    setUpdaters() {
        InteractiveBlock.selectSlider().on("input", () => {
            this.updateContent();
        });
        InteractiveBlock.selectCheckboxes().on("change", () => {
            this.updateContent();
        });
        InteractiveBlock.selectRadioButtons().on("change", () => {
            this.updateContent();
        });
    }

    updateContent() {
        const encoding = ContentMaker.__defineEncoding();
        const aggregation = ContentMaker.__defineAggregation();
        const choices = ContentMaker.__defineChoices();
        const newData = ContentMaker.__produceNewData(this.data, this.yearRange, encoding, aggregation, this.lineChartElement, choices.length);
        this.barChart.updateChart(newData[0]);
        if ((aggregation === "continent") && (choices.length !== 1)) {
            this.lineChart.updateChart(newData[1]);
        }
    }

    static __defineRadioButtonValue(selector) {
        let value = "";
        const radioButtons = selector();
        radioButtons.each(function() {
            const radioButton = d3.select(this);
            if (radioButton.property("checked")) {
                value = radioButton.property("value");
            }
        });
        return value;
    }

    static __defineEncoding() {
        return ContentMaker.__defineRadioButtonValue(InteractiveBlock.selectEncodingRadioButtons);
    }

    static __defineAggregation() {
        return ContentMaker.__defineRadioButtonValue(InteractiveBlock.selectAggregationRadioButtons);
    }

    static __produceNewData(data, yearRange, encoding, aggregation, lineChartElement, numberOfChoices) {
        let barChartData;
        barChartData = ContentMaker.__encodeData(data, encoding);
        barChartData = ContentMaker.__applyCheckboxes(barChartData);
        barChartData = ContentMaker.__applyAggregationRadioButtons(barChartData, yearRange, numberOfChoices);
        barChartData = ContentMaker.__applySortingRadioButtons(barChartData);
        let lineChartData = ContentMaker.__collectLineChartData(barChartData, numberOfChoices);
        if (aggregation === "continent") {
            barChartData = ContentMaker.__applySlider(barChartData);
        }
        if ((aggregation === "continent") && (numberOfChoices !== 1)) {
            lineChartElement.style("display", "block");
        } else {
            lineChartData = [];
            lineChartElement.style("display", "none");
        }
        return [barChartData, lineChartData];
    }

    static __encodeData(data, encoding) {
        const newData = [];
        for (let datum of data) {
            const newDatum = {};
            newDatum["name"] = datum["name"];
            newDatum["continent"] = datum["continent"];
            newDatum["encoding"] = datum[encoding];
            newDatum["population"] = datum["population"];
            newDatum["gdp"] = datum["gdp"];
            newDatum["year"] = datum["year"];
            newData.push(newDatum);
        }
        return newData;
    }

    static __collectLineChartData(barChartData, numberOfChoices) {
        const lineChartData = {};
        const yearSums = {};
        for (let barChartDatum of barChartData) {
            const year = barChartDatum["year"];
            const value = barChartDatum["encoding"];
            if (yearSums[year] === undefined) {
                yearSums[year] = 0;
            }
            yearSums[year] += value;
        }
        for (let barChartDatum of barChartData) {
            const year = barChartDatum["year"];
            const name = barChartDatum["name"];
            const value = barChartDatum["encoding"];
            if (lineChartData[name] === undefined) {
                lineChartData[name] = [];
            }
            lineChartData[name].push({
                x: DATE_PARSER(year),
                y: value / yearSums[year]
            });
        }
        const buffer = [];
        for (let name of Object.keys(lineChartData)) {
            buffer.push({
                key: name.toUpperCase(),
                values: lineChartData[name].sort((a, b) => {
                    if (a.x < b.x) {
                        return -1;
                    } else if (a.x > b.x) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
            });
        }
        return buffer;
    }

    static __applySlider(data) {
        const slider = InteractiveBlock.selectSlider();
        const sliderYear = parseInt(slider.property("value"));
        return data.filter(datum => datum["year"] === sliderYear);
    }

    static __applyCheckboxes(data) {
        const choices = ContentMaker.__defineChoices();
        if (choices.length > 0) {
            return data.filter(datum => choices.includes(datum["continent"]));
        } else {
            return data;
        }
    }

    static __defineChoices() {
        const checkboxes = InteractiveBlock.selectCheckboxes();
        const choices = [];
        checkboxes.each(function() {
            const checkbox = d3.select(this);
            if (checkbox.property("checked")) {
                choices.push(checkbox.property("value"));
            }
        });
        return choices;
    }

    static __applyAggregationRadioButtons(data, yearRange, numberOfChoices) {
        let value = "";
        const radioButtons = InteractiveBlock.selectAggregationRadioButtons();
        radioButtons.each(function() {
            const radioButton = d3.select(this);
            if (radioButton.property("checked")) {
                value = radioButton.property("value");
                if (value === "country") {
                    value = "name";
                }
            }
        });
        const yearRangeMin = yearRange.min;
        const yearRangeMax = yearRange.max;
        const aggregatedData = [];
        if (value === "name") {
            d3.nest()
                .key(datum => datum[value])
                .rollup(data => {
                    const aggregatedDatum = {
                        name: data[0]["name"],
                        continent: data[0]["continent"],
                        encoding: d3.mean(data, obj => obj["encoding"]),
                        population: d3.mean(data, obj => obj["population"]),
                        gdp: d3.mean(data, obj => obj["gdp"]),
                        year: yearRangeMin + "-" + yearRangeMax,
                        numberOfChoices: numberOfChoices
                    };
                    aggregatedData.push(aggregatedDatum);
                })
                .entries(data);
        } else if (value === "continent") {
            d3.nest()
                .key(datum => datum["year"])
                .key(datum => datum[value])
                .rollup(data => {
                    const aggregatedDatum = {
                        name: data[0][value],
                        continent: data[0][value],
                        encoding: d3.sum(data, obj => obj["encoding"]),
                        population: d3.sum(data, obj => obj["population"]),
                        gdp: d3.sum(data, obj => obj["gdp"]),
                        year: data[0]["year"],
                        numberOfChoices: numberOfChoices
                    };
                    aggregatedData.push(aggregatedDatum);
                })
                .entries(data);
        }
        return aggregatedData;
    }

    static __applySortingRadioButtons(data) {
        let value = "";
        const radioButtons = InteractiveBlock.selectSortingRadioButtons();
        radioButtons.each(function() {
            const radioButton = d3.select(this);
            if (radioButton.property("checked")) {
                value = radioButton.property("value");
            }
        });
        data.sort((a, b) => ContentMaker.__sortTabs(value, a, b));
        return data
    }

    static __sortTabs(feature, tab1, tab2) {
        let comparisonResult = d3["descending"](tab1[feature], tab2[feature]);
        if (comparisonResult === 0) {
            switch (feature) {
                case "encoding":
                    comparisonResult = ContentMaker.__sortTabs("continent", tab1, tab2);
                    break;
                case "continent":
                    comparisonResult = ContentMaker.__sortTabs("name", tab1, tab2);
                    break;
                case "name":
                    comparisonResult = 0;
                    break;
                default:
                    comparisonResult = ContentMaker.__sortTabs("continent", tab1, tab2);
            }
        }
        return comparisonResult;
    }
}

function createInteractiveBlockElement(contentContainer) {
    return contentContainer.append("div")
        .attr("id", INTERACTIVE_BLOCK_ID)
        .attr("class", INTERACTIVE_BLOCK_ID);
}

function createChartElement(contentContainer, blockId, chartId) {
    return contentContainer.append("div")
        .attr("id", blockId)
        .attr("class", blockId)
        .append("svg")
        .attr("id", chartId)
        .attr("class", chartId);
}

function defineMinMaxValueOfData(data, feature) {
    let min = data[0][feature];
    let max = data[0][feature];
    for (let datum of data) {
        const currentValue = datum[feature];
        if (currentValue > max) {
            max = currentValue;
        } else if (currentValue < min) {
            min = currentValue;
        }
    }
    return {
        min: 0,
        max: max,
        delta: max - min
    };
}

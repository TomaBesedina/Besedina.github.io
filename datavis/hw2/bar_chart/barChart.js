import {d3} from '../../libraries'

const MARGINS = {top: 10, bottom: 10, left: 200, right: 40};
const WIDTH = 1200 - MARGINS["left"] - MARGINS["right"];
const BAR_HEIGHT = 19;
const BAR_BLOCK_HEIGHT = BAR_HEIGHT + 1;
const BAR_BLOCK_HALF_HEIGHT = BAR_BLOCK_HEIGHT / 2;
const SCALE = d3.scaleLinear().rangeRound([0, WIDTH]);

export default class BarChart {

    constructor(mainElement, dataProcessor) {
        mainElement
            .attr("width", WIDTH + MARGINS["left"] + MARGINS["right"]);
        this.mainElement = mainElement;
        this.dataProcessor = dataProcessor;
        this.mainGroup = this._addMainGroup();
    }

    _addMainGroup() {
        return this.mainElement.append("g")
            .attr("transform", "translate(" + MARGINS["left"] + "," + MARGINS["top"] + ")");
    }

    updateChart(newData) {
        const height = BAR_BLOCK_HEIGHT * newData.length;
        SCALE.domain([0, d3.max(newData, datum => datum["encoding"])]);
        this.mainElement
            .attr("height", height + MARGINS["top"] + MARGINS["bottom"]);
        const barGroups = this.mainGroup.selectAll("g")
            .data(newData, (datum, index) => datum["name"] + datum["encoding"] + datum["numberOfChoices"] + index);
        const barGroup = barGroups.enter().append("g")
            .attr("transform", (datum, index) => "translate(0," + index * BAR_BLOCK_HEIGHT + ")");
        barGroups.exit().selectAll("rect").transition()
            .duration(300)
            .ease(d3.easeLinear)
            .attr("width", 0);
        barGroups.exit().selectAll("text").transition()
            .duration(300)
            .ease(d3.easeLinear)
            .attr("fill", "none");
        barGroups.exit().transition()
            .duration(300)
            .remove();
        const label = barGroup.append("text")
            .attr("x", 0)
            .attr("y", BAR_BLOCK_HALF_HEIGHT)
            .attr("dy", ".35em")
            .attr("fill", "none")
            .text(datum => datum["name"])
            .transition()
            .duration(300)
            .ease(d3.easeLinear)
            .attr("fill", "black");
        const bar = barGroup.append("rect")
            .attr("x", 20)
            .attr("height", BAR_HEIGHT)
            .transition()
            .duration(300)
            .ease(d3.easeLinear)
            .attr("width", datum => SCALE(datum["encoding"]));
    }

    static __tableDataKeyFunction(datum, index) {
        return datum["name"] + datum["population"] + datum["gdp"] + index;
    }

}

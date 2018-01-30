import {d3} from '../../libraries'

import InteractiveBlock from "./InteractiveBlock";
import Table from "./Table";

const INTERACTIVE_BLOCK_ID = "interactive_block";
const TABLE_ID = "main_table";

export default class ContentMaker {

    constructor(contentContainer, dataProcessor) {
        this.data = dataProcessor.data;
        const interactiveBlockElement = createInteractiveBlockElement(contentContainer);
        this.interactiveBlock = new InteractiveBlock(interactiveBlockElement, dataProcessor);
        const tableElement = createTableElement(contentContainer);
        this.table = new Table(tableElement, dataProcessor);
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
        const newData = ContentMaker.__produceNewData(this.data);
        this.table.updateTable(newData);
    }

    static __produceNewData(data) {
        let newData = ContentMaker.__applySlider(data);
        newData = ContentMaker.__applyCheckboxes(newData);
        newData = ContentMaker.__applyRadioButtons(newData);
        return newData;
    }

    static __applySlider(data) {
        const slider = InteractiveBlock.selectSlider();
        const sliderYear = parseInt(slider.property("value"));
        return data.filter(datum => datum["year"] === sliderYear);
    }

    static __applyCheckboxes(data) {
        const checkboxes = InteractiveBlock.selectCheckboxes();
        const choices = [];
        checkboxes.each(function() {
            const checkbox = d3.select(this);
            if (checkbox.property("checked")) {
                choices.push(checkbox.property("value"));
            }
        });
        if (choices.length > 0) {
            return data.filter(datum => choices.includes(datum["continent"]));
        } else {
            return data;
        }
    }

    static __applyRadioButtons(data) {
        const mainRadioButton = InteractiveBlock.selectMainRadioButton();
        if (mainRadioButton.property("checked")) {
            const aggregatedData = [];
            d3.nest()
                .key(datum => datum["year"])
                .key(datum => datum["continent"])
                .rollup(continentData => {
                    const aggregatedDatum = {
                        name: continentData[0]["continent"],
                        continent: continentData[0]["continent"],
                        gdp: d3.sum(continentData, obj => obj["gdp"]),
                        population: d3.sum(continentData, obj => obj["population"]),
                        life_expectancy: d3.mean(continentData, obj => obj["life_expectancy"]),
                        year: continentData[0]["year"]
                    };
                    aggregatedData.push(aggregatedDatum);
                })
                .entries(data);
            return aggregatedData;
        } else {
            return data;
        }
    }

}

function createInteractiveBlockElement(contentContainer) {
    return contentContainer.append("div")
        .attr("id", INTERACTIVE_BLOCK_ID)
        .attr("class", INTERACTIVE_BLOCK_ID);
}

function createTableElement(contentContainer) {
    return contentContainer.append("table")
        .attr("id", TABLE_ID)
        .attr("class", TABLE_ID)
}

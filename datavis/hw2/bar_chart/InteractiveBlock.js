import {d3} from 'https://github.com/TomaBesedina/Besedina.github.io/tree/master/datavis/hw2'
import {RADIO_BUTTON_CONTENTS} from "./radioButtons";

const INTERACTIVE_BLOCK_LABEL_ID = "interactive_block_label";
const SLIDER_BLOCK_ID = "slider_block";
const SLIDER_ID = "year_slider";
const RADIO_BUTTONS_BLOCK_ID = "radio_buttons_block";
const RADIO_BUTTON_BLOCK_ID = "radio_button_block";
const RADIO_BUTTON_ID = "radio_button";
const ENCODING_RADIO_BUTTONS_BLOCK_ID = "encoding_" + RADIO_BUTTONS_BLOCK_ID;
const AGGREGATION_RADIO_BUTTONS_BLOCK_ID = "aggregation_" + RADIO_BUTTONS_BLOCK_ID;
const SORTING_RADIO_BUTTONS_BLOCK_ID = "sorting_" + RADIO_BUTTONS_BLOCK_ID;
const CHECKBOXES_BLOCK_ID = "checkboxes_block";
const CHECKBOX_BLOCK_ID = "checkbox_block";
const CHECKBOX_ID = "continent_checkbox";

export default class InteractiveBlock {

    static selectCheckboxes() {
        return d3.selectAll("." + CHECKBOX_ID);
    }

    static selectSlider() {
        return d3.select("#" + SLIDER_ID);
    }

    static selectRadioButtons() {
        return d3.selectAll("." + RADIO_BUTTON_ID);
    }

    static selectEncodingRadioButtons() {
        return d3.select("#" + ENCODING_RADIO_BUTTONS_BLOCK_ID).selectAll("." + RADIO_BUTTON_ID);
    }

    static selectAggregationRadioButtons() {
        return d3.select("#" + AGGREGATION_RADIO_BUTTONS_BLOCK_ID).selectAll("." + RADIO_BUTTON_ID);
    }

    static selectSortingRadioButtons() {
        return d3.select("#" + SORTING_RADIO_BUTTONS_BLOCK_ID).selectAll("." + RADIO_BUTTON_ID);
    }

    constructor(mainElement, data, contentMaker) {
        this.mainElement = mainElement;
        this.data = data;
        this.contentMaker = contentMaker;
        this._addElements();
    }

    _addElements() {
        this._addSlider(this.data.yearRange);
        this._addEncodingRadioButtons();
        this._addCheckboxes(this.data.continents);
        this._addAggregationRadioButtons();
        this._addSortingRadioButtons();
    }

    _addSlider(range) {
        const sliderBlock = this.mainElement.append("div")
            .attr("id", SLIDER_BLOCK_ID)
            .attr("class", SLIDER_BLOCK_ID);
        sliderBlock.append("p").attr("class", INTERACTIVE_BLOCK_LABEL_ID).text("Time update:");
        sliderBlock.append("span").attr("class", INTERACTIVE_BLOCK_LABEL_ID).text(range.min);
        const slider = sliderBlock.append("input")
            .attr("type", "range")
            .attr("id", SLIDER_ID)
            .attr("class", SLIDER_ID)
            .property("min", range.min)
            .property("max", range.max)
            .property("step", 1)
            .property("value", range.min);
        sliderBlock.append("label")
            .attr("for", SLIDER_ID)
            .text("");
        sliderBlock.append("span").attr("class", INTERACTIVE_BLOCK_LABEL_ID).text(range.max);
        return slider;
    }

    _addEncodingRadioButtons() {
        return this._addRadioButtonsByTheme(ENCODING_RADIO_BUTTONS_BLOCK_ID, "encode");
    }

    _addAggregationRadioButtons() {
        return this._addRadioButtonsByTheme(AGGREGATION_RADIO_BUTTONS_BLOCK_ID, "aggregate");
    }

    _addSortingRadioButtons() {
        return this._addRadioButtonsByTheme(SORTING_RADIO_BUTTONS_BLOCK_ID, "sort");
    }

    _addRadioButtonsByTheme(blockId, theme) {
        const radioButtonContent = RADIO_BUTTON_CONTENTS[theme];
        const radioButtonsBlock = this.mainElement.append("div")
            .attr("id", blockId)
            .attr("class", RADIO_BUTTONS_BLOCK_ID);
        radioButtonsBlock.append("p")
            .attr("class", INTERACTIVE_BLOCK_LABEL_ID)
            .text(radioButtonContent.label);
        let radioButtonCheck = true;
        const radioButtons = [];
        const radioButtonFields = radioButtonContent.fields;
        for (let radioButtonField of radioButtonFields) {
            const radioButtonBlock = radioButtonsBlock.append("div")
                .attr("class", RADIO_BUTTON_BLOCK_ID);
            const radioButtonId = "radio_button_" + theme + "_" + radioButtonField.idSuffix;
            const radioButton = radioButtonBlock.append("input")
                .attr("type", "radio")
                .attr("id", radioButtonId)
                .attr("class", RADIO_BUTTON_ID + " " + theme + "_radio_button")
                .property("checked", radioButtonCheck)
                .property("value", radioButtonField.idSuffix)
                .on("click", function() {
                    InteractiveBlock.__updateRadioButtons(blockId, d3.select(this));
                });
            radioButtons.push(radioButton);
            radioButtonsBlock.append("label")
                .attr("for", radioButtonId)
                .text(radioButtonField.text);
            radioButtonCheck = false;
        }
        return radioButtons;
    }

    static __updateRadioButtons(blockId, clickedButton) {
        d3.select("#" + blockId).selectAll("." + RADIO_BUTTON_ID)
            .property("checked", false);
        clickedButton.property("checked", true);
    }

    _addCheckboxes(labels) {
        const checkboxesBlock = this.mainElement.append("div")
            .attr("id", CHECKBOXES_BLOCK_ID)
            .attr("class", CHECKBOXES_BLOCK_ID);
        checkboxesBlock.append("p")
            .attr("class", INTERACTIVE_BLOCK_LABEL_ID)
            .text("Filter by:");
        const checkboxBlocks = checkboxesBlock.selectAll("#" + CHECKBOXES_BLOCK_ID + "." + CHECKBOX_BLOCK_ID)
            .data(labels);
        const checkboxBlock = checkboxBlocks.enter().append("div")
            .attr("class", CHECKBOX_BLOCK_ID);
        const checkboxes = [];
        checkboxBlock.each(function () {
            const checkbox = d3.select(this).append("input")
                .attr("type", "checkbox")
                .attr("id", (datum, i) => "checkbox_" + i)
                .attr("class", CHECKBOX_ID)
                .property("value", datum => datum);
            checkboxes.push(checkbox);
            d3.select(this).append("label")
                .attr("for", (datum, i) => "checkbox_" + i)
                .text(datum => datum);
        });
        return checkboxes;
    }

}

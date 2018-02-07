import {d3} from 'https://github.com/TomaBesedina/Besedina.github.io/tree/master/datavis/hw2'


const INTERACTIVE_BLOCK_LABEL_ID = "interactive_block_label";
const SLIDER_BLOCK_ID = "slider_block";
const SLIDER_ID = "year_slider";
const CHECKBOXES_BLOCK_ID = "checkboxes_block";
const CHECKBOX_BLOCK_ID = "checkbox_block";
const CHECKBOX_ID = "continent_checkbox";
const RADIO_BUTTONS_BLOCK_ID = "radio_buttons_block";
const RADIO_BUTTON_BLOCK_ID = "radio_button_block";
const RADIO_BUTTON_ID = "radio_button";
const MAIN_RADIO_BUTTON_ID_ROOT = "radio_button";
const MAIN_RADIO_BUTTON_ID_SUFFIX = "by_continent";
const MAIN_RADIO_BUTTON_ID = MAIN_RADIO_BUTTON_ID_ROOT + "_" + MAIN_RADIO_BUTTON_ID_SUFFIX;

export default class InteractiveBlock {

    static selectCheckboxes() {
        return d3.selectAll("." + CHECKBOX_ID);
    }

    static selectSlider() {
        return d3.select("#" + SLIDER_ID);
    }

    static selectMainRadioButton() {
        return d3.select("#" + MAIN_RADIO_BUTTON_ID);
    }

    static selectRadioButtons() {
        return d3.selectAll("." + RADIO_BUTTON_ID);
    }

    constructor(mainElement, data) {
        this.mainElement = mainElement;
        this.data = data;
        this._addElements();
    }

    _addElements() {
        this._addSlider(this.data.yearRange);
        this._addCheckboxes(this.data.continents);
        this._addRadioButtons();
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
                .attr("id", (d, i) => "checkbox_" + i)
                .attr("class", CHECKBOX_ID)
                .property("value", d => d);
            checkboxes.push(checkbox);
            d3.select(this).append("label")
                .attr("for", (d, i) => "checkbox_" + i)
                .text(d => d);
        });
        return checkboxes;
    }

    _addRadioButtons() {
        const radioButtonsBlock = this.mainElement.append("div")
            .attr("id", RADIO_BUTTONS_BLOCK_ID)
            .attr("class", RADIO_BUTTONS_BLOCK_ID);
        radioButtonsBlock.append("p")
            .attr("class", INTERACTIVE_BLOCK_LABEL_ID)
            .text("Aggregation:");
        const radioButtonFields = [
            {
                text: "None",
                id_suffix: "none",
            },
            {
                text: "By continent",
                id_suffix: MAIN_RADIO_BUTTON_ID_SUFFIX,
            }
        ];
        let radioButtonCheck = true;
        const radioButtons = [];
        for (let field of radioButtonFields) {
            const radioButtonBlock = radioButtonsBlock.append("div")
                .attr("class", RADIO_BUTTON_BLOCK_ID);
            const radioButtonId = MAIN_RADIO_BUTTON_ID_ROOT + "_" + field.id_suffix;
            const radioButton = radioButtonBlock.append("input")
                .attr("type", "radio")
                .attr("id", radioButtonId)
                .attr("class", RADIO_BUTTON_ID)
                .property("checked", radioButtonCheck)
                .on("click", function() {
                    InteractiveBlock.__updateRadioButtons(d3.select(this));
                });
            radioButtons.push(radioButton);
            radioButtonBlock.append("label")
                .attr("for", radioButtonId)
                .text(field.text);
            radioButtonCheck = false;
        }
        return radioButtons;
    }

    static __updateRadioButtons(clickedButton) {
        d3.select("#" + RADIO_BUTTONS_BLOCK_ID).selectAll("." + RADIO_BUTTON_ID)
            .property("checked", false);
        clickedButton.property("checked", true);
    }
}

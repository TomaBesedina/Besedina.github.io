class RadioButtonField {

    constructor(text, idSuffix) {
        this.text = text;
        this.idSuffix = idSuffix;
    }

}

class RadioButtonContent {

    constructor(label, fields) {
        this.label = label + ":";
        this.fields = fields;
    }

}

const RADIO_BUTTON_CONTENTS = {
    encode: new RadioButtonContent("Encode bars by", [
        new RadioButtonField("Population", "population"),
        new RadioButtonField("GDP", "gdp")
    ]),
    aggregate: new RadioButtonContent("Aggregate by", [
        new RadioButtonField("Continent", "continent"),
        new RadioButtonField("Country", "country")
    ]),
    sort: new RadioButtonContent("Sort by", [
        new RadioButtonField("Name", "name"),
        new RadioButtonField("Population", "population"),
        new RadioButtonField("GDP", "gdp")
    ])
};

export {RADIO_BUTTON_CONTENTS}

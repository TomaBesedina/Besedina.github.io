import {d3} from 'https://github.com/TomaBesedina/Besedina.github.io/tree/master/datavis/hw2'

export default class {

    constructor(value) {
        this.value = value;
    }

    formatWithComma() {
        return d3.format(",")(this.value);
    }

    formatAsDecimal() {
        return d3.format(",.1f")(this.value);
    }

    formatAsMoney() {
        return "$" + d3.format(".2s")(this.value);
    }

}

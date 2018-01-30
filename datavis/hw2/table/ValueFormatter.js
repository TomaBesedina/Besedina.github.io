import {d3} from '../../libraries'

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

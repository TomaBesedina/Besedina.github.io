export default class {

    constructor(data) {
        this.continents = new Set();
        this.yearRange = {
            min: Number.MAX_SAFE_INTEGER,
            max: 0
        };
        this.data = this._reformatData(data["data"]);
        this.headers = this._extractHeaders(this.data[0]);
    }

    _reformatData(data) {
        const newData = [];
        for (let obj of data) {
            const name = obj["name"];
            const continent = obj["continent"];
            this.continents.add(continent);
            const yearObjects = obj["years"];
            for (let yearObject of yearObjects) {
                const year = parseInt(yearObject["year"]);
                if (this.yearRange.max < year) {
                    this.yearRange.max = year;
                }
                if (this.yearRange.min > year) {
                    this.yearRange.min = year;
                }
                const newObject = {
                    name: name,
                    continent: continent,
                    gdp: yearObject["gdp"],
                    population: yearObject["population"],
                    life_expectancy: yearObject["life_expectancy"],
                    year: year
                };
                newData.push(newObject)
            }
        }
        this.continents = [...this.continents];
        return newData;
    }

    _extractHeaders() {
        return Object.keys(this.data[0]);
    }

}

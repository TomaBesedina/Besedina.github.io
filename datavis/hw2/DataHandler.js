export default class {

    constructor(name) {
        this.name = name;
        this.address = "https://github.com/TomaBesedina/Besedina.github.io/edit/master/datavis/hw2/" + name + ".json";
    }

    handle(f) {
        fetch(this.address)
            .then(response => response.json())
            .then(data => f(data));
    }

}

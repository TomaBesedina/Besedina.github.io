/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******

        var map = d3.select('#map');
        map.selectAll('.countries')
            .attr('class', 'countries');
        map.selectAll('.host')
            .attr('class', 'countries');
        map.selectAll('.team')
            .attr('class', 'countries');

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        this.clearMap();
        // ******* TODO: PART V *******

        var proj = this.projection;
        var path = d3.geoPath().projection(this.projection);

        worldcupData.teams_iso.forEach(function (team, i, arr) {
            d3.select('#'+ team)
                .attr('class', 'team');
        });
        d3.select('#'+ worldcupData.host_country_code)
            .attr('class', 'host');

        d3.select('#points').select('.gold')
            .attr("r", "8")
            .attr("transform", "translate(" + proj([worldcupData.win_pos[0], worldcupData.win_pos[1]]) + ")");


        d3.select('#points').select('.silver')  
            .attr("r", "8")
            .attr("transform", "translate(" + proj([worldcupData.ru_pos[0], worldcupData.ru_pos[1]]) + ")");
    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        // ******* TODO: PART IV *******
        var map = d3.select('#map');
        var path = d3.geoPath().projection(this.projection);
        var countries = topojson.feature(world, world.objects.countries).features;

        map.selectAll('.countries')
            .data(countries)
            .enter()
            .append('path')
            .attr('id', function (d) { return d.id;})
            .attr('class', 'countries')
            .attr('d', path);

        map.append('path')
            .datum(d3.geoGraticule())
            .attr('class', 'grat')
            .attr('d', path);

        d3.select('#points').append('circle').attr('class', 'gold');
        d3.select('#points').append('circle').attr('class', 'silver');
    }


}

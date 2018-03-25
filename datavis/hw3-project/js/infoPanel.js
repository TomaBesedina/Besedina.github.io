/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {
        // ******* TODO: PART III *******
        d3.select('#edition').text(d => oneWorldCup.EDITION);
        d3.select('#host').text(d => oneWorldCup.host);
        d3.select('#winner').text(d => oneWorldCup.winner);
        d3.select('#silver').text(d => oneWorldCup.runner_up);

        var teams = d3.select('#teams')
                      .selectAll('li')
                      .data(oneWorldCup.teams_names);
        teams.exit().remove();
        teams = teams.enter()
            .append('li')
            .merge(teams)
            .text(d => d);
    }

}
/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice();

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';


        /** Setup the scales*/
        this.goalWidht = 200;
        this.goalScale = d3.scaleLinear()
                            .range([10, this.goalWidht-10])
                            .domain([0, 18]);

        /** Used for games/wins/losses*/
        this.gameScale = 10; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
                                     .domain([0, 7])
                                     .range(['#ece2f0', '#016450']);
        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 

        this.sortHeader = 'Team';
        this.ascending = true;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        d3.select('#goalHeader')
            .append('svg')
            .attr('width', this.goalWidht)
            .attr('height', 35)
            .append('g')
            .attr("transform", "translate(0," + 25 + ")")
            .call(d3.axisTop(this.goalScale));     
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        var tbody = d3.select('#matchTable').select('tbody');
        var rows = tbody.selectAll('tr')
                        .data(this.tableElements);
        rows.exit()
            .remove();
        rows = rows
            .enter()
            .append("tr").merge(rows)  
          .on('mouseover', function (row) {
            t.tree.clearTree();
            t.tree.updateTree(row);
          });

    
        var cells = rows
            .selectAll('td')
            .data(function (d) {
                return [{'type': d['value']['type'], 'vis': 'cntrs', 'value': d['key']},
                        {'type': d['value']['type'], 'vis': 'goals', 'value': [d['value']['Goals Made'],d['value']['Goals Conceded']] },
                        {'type': d['value']['type'], 'vis': 'text', 'value': d['value']['Result']['label']},
                        {'type': d['value']['type'], 'vis': 'bar', 'value': d['value']['Wins']},
                        {'type': d['value']['type'], 'vis': 'bar', 'value': d['value']['Losses']},
                        {'type': d['value']['type'], 'vis': 'bar', 'value': d['value']['TotalGames']}
                ];
            });

        cells.exit()
             .remove();
        cells = cells
            .enter()
            .append('td');

        var bar_cells = cells.filter(function (d) {
            return d.vis == 'bar' && d.type == 'aggregate';
        }).attrs(this.cell)
          .append('svg')
          .attrs(this.cell);

        var cs = this.aggregateColorScale;
        var gs = this.gameScale;
        bar_cells.append('rect')
            .style('fill', function (d) { return cs(d.value); })
            .attr('width', function (d) { return d.value*gs;})
            .attr('height', this.bar.height);

        bar_cells.append('text')
            .style('fill', 'white')
            .attr('x', function (d) { return d.value*gs - gs;})            
            .attr('y', this.bar.height - gs/2)
            .text(function (d) { return d.value;})

        cells.filter(function (d) {
            return d.vis == 'text';
        }).text(d => d.value);

        var t = this;
        cells.filter(function (d) {
            return d.vis == 'cntrs';
        })
          .attr('valign', 'right')
          .attr('color', '#317f19')
          .text(function (d) {
            if (d.type == 'aggregate') {
                return d.value;
            } else if (d.type == 'game'){
                return 'x'+ d.value;
            }
          });

        var goals_cell = cells.filter(function (d) {
            return d.vis == 'goals' && d.type == 'aggregate';
        })
            .append('svg')
            .attr('width', this.goalWidht)
            .attr('height', 20);

        goals_cell.append('rect')
            .attr('class', 'goalBar')
            .attr('x', d => this.goalScale(Math.min(d.value[0], d.value[1])) - 4)    
            .attr('y', this.bar.height - gs)
            .attr('width', d => this.goalScale(Math.max(d.value[0], d.value[1]) - Math.min(d.value[0], d.value[1]) - 1))
            .attr('height', 16)
            .attr('fill', function (d) { return d.value[0] > d.value[1] ? 'steelblue' : '#be2714'; });

        goals_cell.append('circle')
            .attr('cx', d => this.goalScale(d.value[0]) - 4)
            .attr('cy', this.bar.height - gs/2)
            .attr('class', 'goalCircle')
            .attr('fill', 'steelblue');

        goals_cell.append('circle')
            .attr('cx', d => this.goalScale(d.value[1]) - 4)
            .attr('cy', this.bar.height - gs/2)
            .attr('class', 'goalCircle')
            .attr('fill', function (d) { return d.value[0] == d.value[1] ? 'grey' : '#be2714'; });

        var goals_cell = cells.filter(function (d) {
            return d.vis == 'goals' && d.type == 'game';
        })
            .append('svg')
            .attr('width', this.goalWidht)
            .attr('height', 20);

        goals_cell.append('rect')
            .attr('class', 'goalBar')
            .attr('x', d => this.goalScale(Math.min(d.value[0], d.value[1])) - 4)    
            .attr('y', this.bar.height - gs + 4)
            .attr('width', d => this.goalScale(Math.max(d.value[0], d.value[1]) - Math.min(d.value[0], d.value[1]) - 1))
            .attr('height', 4)
            .attr('fill', function (d) { return d.value[0] > d.value[1] ? 'steelblue' : '#be2714'; });

        goals_cell.append('circle')
            .attr('cx', d => this.goalScale(d.value[0]) - 4)
            .attr('cy', this.bar.height - gs/2)
            .attr('class', 'goalCircle')
            .attr('border', '4px steelblue');

        goals_cell.append('circle')
            .attr('cx', d => this.goalScale(d.value[1]) - 4)
            .attr('cy', this.bar.height - gs/2)
            .attr('class', 'goalCircle')
            .attr('border', '4px #be2714');



        var extractValue = function (d, i) {
                switch(i){
                    case 0: return d['key'];
                    case 1: return d['value']["Delta Goals"];
                    case 2: return d['value']['Result']['ranking'];
                    case 3: return d['value']['Wins'];
                    case 4: return d['value']['Losses'];
                    case 5: return d['value']['TotalGames'];
                }
            }
        d3.select('#head')
            .selectAll('th')
            .attrs(this.cell)
            .on("click", function(header, i) {
                console.log(header, i);
                t.collapseList();
                t.ascending = !t.ascending;
                tbody.selectAll("tr")
                     .sort(function (a, b) { 
                        return t.ascending 
                                ? d3.ascending(extractValue(a,i), extractValue(b,i))
                                : d3.descending(extractValue(a,i), extractValue(b,i));
                        });
            });
    }

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
  
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
    }


}

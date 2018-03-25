    /**
     * Loads in the table information from fifa-matches.json 
     */



// // // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
 d3.csv("data/fifa-matches.csv", function (error, matchesCSV) {

//     /**
//      * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
//      *
//      */
    
    ResultToVal = function (result) {
        switch(result){
            case 'Winner': return 7;
            case 'Runner-Up': return 6;
            case 'Third Place': return 5;
            case 'Fourth Place': return 4;
            case 'Semi Finals': return 3;
            case 'Quarter Finals': return 2;
            case 'Round of Sixteen': return 1;
            case 'Group': return 0;
        }
    }

    ValToResult = function (result) {
        switch(result){
            case 7: return 'Winner';
            case 6: return 'Runner-Up';
            case 5: return 'Third Place';
            case 4: return 'Fourth Place';
            case 3: return 'Semi Finals';
            case 2: return 'Quarter Finals';
            case 1: return 'Round of Sixteen';
            case 0: return 'Group';
        }
    }


    teamData = d3.nest()
        .key(function (d) {
            return d.Team;
        })
        .rollup(function (leaves) {
            var ranking = d3.max(leaves, function (l) { return ResultToVal(l['Result']); });
            return {
               "Goals Made": d3.sum(leaves,function(l){return l['Goals Made']; }),
               "Goals Conceded": d3.sum(leaves,function(l){return l['Goals Conceded']; }),
               "Delta Goals": d3.sum(leaves,function(l){return l['Delta Goals']; }),
               "Wins": d3.sum(leaves,function(l){return l.Wins; }),
               "Losses": d3.sum(leaves,function(l){return l.Losses; }),
               "Result": {"label": ValToResult(ranking), "ranking": ranking},
               "TotalGames": leaves.length,
               "type": "aggregate",
                "games": leaves.map(function (l) {
                    return {
                           "key": l.Team,
                           "value": {
                               "Goals Made": l['Goals Made'],
                               "Goals Conceded": l['Goal(s Concede)d'],
                               "Delta Goals": [],
                               "Wins": [],
                               "Losses": [],
                               "Result": {"label": l.Result, "ranking": ResultToVal(l['Result'])},
                               "type": "game",
                               "Opponent": l.Opponent
                            }
                        }
                })
            };
        })
        .entries(matchesCSV);


     d3.csv("data/fifa-tree.csv", function (error, treeCSV) {

        treeCSV.forEach(function (d, i) {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(treeCSV);

        //Create Table Object and pass in reference to tree object (for hover linking)
        let table = new Table(teamData,tree);

        table.createTable();
        table.updateTable();

     });
 });
// // ********************** END HACKER VERSION ***************************

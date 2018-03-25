
var columnsToDisplay = ["name", "continent", "gdp", "life_expectancy", "population",  "year"]
var ascending = false;
var format_data = function(row){
	  return columnsToDisplay
	  		.map(function(column) {
				var formatComma = d3.format(","),
				formatDecimal = d3.format(".1f"), 
				formatSI = d3.format('.3s');
				if(column == "gdp"){
					return formatSI(row[column]);
				}
				if(column == "life_expectancy"){
					return formatDecimal(row[column]);
				}
				if(column == "population"){
					return formatComma(row[column]);
				}
	  			return row[column]; 
	  		})
	  	};

 function zebra_color () {
    d3.select('tbody')
      .selectAll("tr.row")
      .style("background-color", 
             function(d, i){
                    return i%2 == 0 ? "lightgray" : "white";
        });
}

function update_table(new_data){
    var new_rows = tbody.selectAll('tr.row').data(new_data);
    new_rows
        .exit()
        .remove();
    new_rows = new_rows
        .enter()
        .append("tr").attr("class", "row").merge(new_rows);

    var n_cells = new_rows
        .selectAll('td')
        .data(format_data);

    n_cells.exit()
        .remove();
    n_cells = n_cells
        .enter()
        .append('td');

    tbody.selectAll('td')
    .text(function (d) { return d; })
    .on("mouseover", function (d, i) {
            d3.select(this.parentNode)
                .style("background-color", "orange");
        }).on("mouseout", function () {
        tbody.selectAll("tr")
            .style("background-color", null)
            .selectAll("td")
            .style("background-color", null)
	     zebra_color();
    });
}; 
 
function filter_continents(_data) {		
		var len = 0;
	var selectedContinents = [];
	d3.selectAll("input[type=checkbox]:checked")
	  .each(function(d){ len = selectedContinents.push(d3.select(this).property("value"));});	
	  
	return len == 0 
		? _data
		: _data.filter(function(d){return selectedContinents.includes(d.continent)});
}

function aggregeate_data(_data) {
	var AggType = d3.select('input[name="Aggregation"]:checked').node().value;
	return AggType == "None" 
		? _data
		: d3.nest()
		    .key(function(d) { return d.continent; })
		    .rollup(function(v) { 
		    	return {
					'name': v[0].continent,
					'continent': v[0].continent,
					'gdp': d3.sum(v, function(d) { return d.gdp; }), 
					'life_expectancy': d3.min(v, function(d) { return d.life_expectancy; }),
					'population': d3.sum(v, function(d) { return d.population; }),
					'year': v[0].year
				}}) 
	  		.entries(_data)
	  		.map(function (d) {return d.value; });
}

function exctract_year(_data) {
	var year = d3.select('input[type=range]').node().valueAsNumber;
	document.getElementById("year").innerHTML = year; 
	return _data.map(function (d) {
			yearItem = d["years"].find(function (item) { return item.year == year;});
			return {
				'name': d.name,
				'continent': d.continent,
				'gdp': yearItem.gdp, 
				'life_expectancy': yearItem.life_expectancy,
				'population': yearItem.population,
				'year': year
			};
	});
}

var sortHeader = null;
function cmp(_a, _b) {
		var aName = _a["name"], bName = _b["name"],
			isNum = (sortHeader == "gdp" || sortHeader == "life_expectancy" || sortHeader == "population" || sortHeader == "year" ),
			a = isNum ? parseFloat(_a[sortHeader]) : _a[sortHeader];
			b = isNum ? parseFloat(_b[sortHeader]) : _b[sortHeader];

		if(ascending) {
			if(sortHeader == "continent") {
	  			return d3.ascending(a, b) || d3.ascending(aName, bName);
			}
			else{
				return d3.ascending(a, b);
			}
		}
		else {
			if(sortHeader == "continent") {
	  			return d3.descending(a, b) || d3.ascending(aName, bName);
			}
			else {
				return d3.descending(a, b);
			}
		}
}


 d3.json("countries_1995_2012.json", function(error, data){

    var table = d3.select("body").append("table").attr("id", "Table"),
      thead = table.append("thead")
                   .attr("class", "thead");
      tbody = table.append("tbody");

    table.append("caption")
      .html("World Countries Ranking");

    thead.append("tr").selectAll("th")
      .data(columnsToDisplay)
    .enter()
      .append("th")
      .text(function(d) { return d;})
      .on("click", function(header, i) {
      	sortHeader = header;
 		ascending = !ascending;
        tbody.selectAll("tr")
			 .sort(function (a, b) { return cmp(a, b);});
		zebra_color();
      });
	
    var rows = tbody.selectAll("tr.row")
      .data(data)
	  .enter()
      .append("tr").attr("class", "row");


    var cells = rows.selectAll("td")
	.data(format_data)
      .enter()
      .append("td")
      .text(function(d) { return d;});
	

	function display(data){
		var disp_data = aggregeate_data(filter_continents(exctract_year(data)));
		update_table(disp_data);
        tbody.selectAll("tr")
			 .sort(function (a, b) { return cmp(a, b);});
		zebra_color();		    		
	  }

	display(data);
    d3.selectAll("input[type=checkbox]")
	  .on("change", function () { display(data); });

	d3.selectAll('input[name="Aggregation"]')
	  .on("change", function () { display(data); });

	d3.selectAll("input[type=range]")
	  .on("change", function () { display(data); });
 });


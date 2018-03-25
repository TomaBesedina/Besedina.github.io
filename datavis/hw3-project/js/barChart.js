/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
        this.d = 0;
        this.selectedYear = null;
        this.selectedI = null;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {

      var t = this;

    	let newData = this.allData.map(function (d) {
    		return {'year': d.year, 'value': d[selectedDimension] };
    	});
    	var width = 500, height = 400, paddingLeft = 65;

		var y = d3.scaleLinear()
			.range([height, 0])
			.domain([0, d3.max(newData, d => d.value)]);

		var x = d3.scaleBand()
			.range([width, paddingLeft])
			.padding(0.1)
			.domain(newData.map(d => d.year));

        var color = d3.scaleLinear()
                        .domain([d3.min(newData, d => d.value),
                               d3.max(newData, d => d.value)])
                        .range(['#4682B4', '#191970']);

        var appending = d3.select('#bars')
        	.selectAll('rect')
	       	.data(newData);
	   appending.exit().remove();

	   appending = appending.enter()
	    	.append('rect')
	    	.merge(appending)
	    	.transition()
	        .duration(this.d)
	        .style("fill", function(d){
                if(t.selectedYear == d.year) return 'red';
                return color(d.value);
          })
	        .attr("y", function(d) { return y(d.value); })
	        .attr("x", function(d) { return x(d.year); })
	        .attr("height",function (d) {return height - y(d.value); })
	        .attr("width",x.bandwidth());

        this.d = 1000;
	    d3.select('#xAxis')
	    	.style("fill", "none")
	    	.style("stroke", "black")
	        .attr("transform", "translate(0," + height + ")")
	        .call(d3.axisBottom(x))
			.selectAll("text")
			    .attr("y", 0)
			    .attr("x", 9)
			    .attr("dy", ".35em")
			    .attr("transform", "rotate(90)")
			    .style("text-anchor", "start");

	    d3.select('#yAxis')
	    	.style("fill", "none")
	    	.style("stroke", "black")
	        .attr("transform", "translate("+paddingLeft+",0)")
	        .call(d3.axisLeft(y));

        // ******* TODO: PART II *******
        var ad = this.allData;
        var map = this.worldMap;
        var info = this.infoPanel;
        var worldcupData = {a:'sdds'};
        d3.select('#bars')
          .selectAll('rect')
          .on("click", function (d, i) {

          	d3.select('#bars')
          	  .selectAll('rect')
          	  .style("fill", function(d){
                return color(d.value);
              });
          	d3.select(this)
          	  .style("fill", "red");

            t.selectedYear = d.year;
            t.selectedI = i;

          	worldcupData = ad.find(function (d) { return d.year === ad[i].year; });
	      	map.updateMap(worldcupData);
	      	info.updateInfo(worldcupData);
          });

      console.log(t.selectedYear, t.selectedI);
      if(t.selectedYear != null){
        // d3.select('#bars')
        //   .selectAll('rect')
        //   .filter(function (d) {
        //       console.log(d.year);
        //      return d.year == t.selectedYear;
        //   })
        //   .style("fill", "red");
          
          worldcupData = ad.find(function (d) { return t.selectedYear === ad[t.selectedI].year; });
          map.updateMap(worldcupData);
          info.updateInfo(worldcupData);

      }
    }
}
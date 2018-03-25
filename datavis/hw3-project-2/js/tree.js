/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        this.nodes = null;
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(flatData) {
        // ******* TODO: PART VI *******

        var treeData = d3.stratify()
          .id(function(d,i) { return i; })
          .parentId(function(d) { return d.ParentGame; })
          (flatData);
         
        treeData.each(function(d) {
            d.name = d.data.Team;
          });


        var treemap = d3.tree()
            .size([800, 300]);

        var nodes = d3.hierarchy(treeData, function(d) {
            return d.children;
          });

        nodes = treemap(nodes);
        this.nodes = nodes;

        var g = d3.select('#tree')
                  .attr("transform", "translate(100,0)");

        var link = g.selectAll(".link")
            .data( nodes.descendants().slice(1))
          .enter().append("path")
            .attr("class", "link")
            .attr("d", function(d) {
               return "M" + d.y + "," + d.x
                 + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                 + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                 + " " + d.parent.y + "," + d.parent.x;
               });

        var node = g.selectAll(".node")
            .data(nodes.descendants())
          .enter().append("g")
            .attr("class", function(d) { 
                return (d.data.data.Wins == "0" ? "node" : 'node winner') + 
                (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) { 
              return "translate(" + d.y + "," + d.x + ")"; });

        node.append("circle")
          .attr("r", 5);

        node.append("text")
          .attr("dy", ".35em")
          .attr("x", function(d) { return d.children ? -13 : 13; })
          .style("text-anchor", function(d) { 
            return d.children ? "end" : "start"; })
          .text(function(d) { return d.data.name; });
    
       
    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(rows) {
        // ******* TODO: PART VII *******
         d3.selectAll('.link')
            .filter(function(d){
                return d.data.data.Team == rows.key && d.parent.data.data.Team == rows.key;
            })
            .attr('class', 'link selected')

        d3.selectAll('.node').selectAll('text')
            .filter(function(d){
                return d.data.data.Team == rows.key;
            })
            .attr('class', 'selectedLabel')
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******     
        d3.selectAll('.selected').attr('class', 'link');
        d3.selectAll('.selectedLabel').attr('class', 'label');
    }
}

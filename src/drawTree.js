// code adapted from https://stackoverflow.com/a/38222841/322819
function drawTree(o) {

    d3.select("#"+o.divID).select(".tooltip").remove()

    var div = d3.select("#"+o.divID)
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)

    d3.select("#"+o.divID).select("svg").remove()

    var viz = d3.select("#"+o.divID)
        .append("svg")
        .attr("width", o.width)
        .attr("height", o.height)

    var vis = viz.append("g")
        .attr("id","treeg")
        .attr("transform", "translate("+ o.padding +","+ o.padding +")")

    var tree = d3.layout.tree()
        .size([o.width - (2 * o.padding), o.height - (2 * o.padding)]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.x, d.y]; });

    var nodes = tree.nodes(o.treeData);

    var link = vis.selectAll("pathlink")
        .data(tree.links(nodes)).enter()
        .append("path")
        .attr("class", "edge")
        .attr("d", diagonal)

    var node = vis.selectAll("g.node")
        .data(nodes).enter()
        .append("g")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

    node.append("circle")
        .attr("r", 20)
        .style("fill", function(d) { return (d.children) ? "#E14B3B" : "#1C8B98" });

    node.append("svg:text")
        .attr("dx", function(d) { return d.children ? 0 : 0; })
        .attr("dy", function(d) { return d.children ? 5 : 5; })
        .attr("text-anchor", function(d) { return d.children ? "middle" : "middle"; })
        .style("fill", "white").text(function(d) { return d.name; })

    node.on("mouseover", function(d) {
        if (!d.children) {
            return
        }
        div.transition()
            .duration(200)
            .style("opacity", 0.99)

        div.html(d.value)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px")
    })
    node.on("mouseout", function(d) {
        div.transition()
            .duration(500)
            .style("opacity", 0)
    })
}

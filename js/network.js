/*
var nodes = [].concat(
  d3.range(1).map(function() { return {type: "c"}; }),
  d3.range(4).map(function() { return {type: "a"}; }),
  d3.range(16).map(function() { return {type: "b"}; }),
  d3.range(64).map(function() { return {type: "d"}; }),
  d3.range(256).map(function() { return {type: "e"}; })
);*/




function drawNetwork(nodes){

    const numberOfNodes = nodes.length;

    var node = d3.select("svg")
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { return d.getColor(); })

    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceCollide().radius(5))
        .force("r", d3.forceRadial(function(d) {
            return d.range * numberOfNodes * 0.03;
        }))
        .on("tick", ticked);

    function ticked() {
      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

}


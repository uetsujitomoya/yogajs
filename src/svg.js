import d3 from "d3"

var width = 1200,
height = 250;

var color = d3.scale.category20c();

var force = d3.layout.force()
.charge(-120)
.linkDistance(120)
.size([width, height]);

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);

export {force, svg, color, width, height};

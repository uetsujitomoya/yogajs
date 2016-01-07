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


var viz=(stackdataArr,color2) => {

  var stack = d3.layout.stack()
  .x(function(d){return 1;})
  .y(function(d){return d.y;})
  .values(function(d){return d;});
  var stackdata = stack(stackdataArr);
  var max = d3.max(stackdata[stackdata.length-1], function(d){return d.y + d.y0;});
  var scaleX = d3.scale.linear().domain([0,color2.length]).range([width/(color2.length),width]);
  var scaleY = d3.scale.linear().domain([0,max]).range([0,height]);
  var colors = ["#7777ff","#77ff77","#ff7777"];

  var area = d3.svg.area()
  .x(function(d,i){return (i+1) * width/color2.length})
  .y0(function(d){return height})
  .y1(function(d){return height - scaleY(d.y+d.y0)});
  svg.selectAll("path")
  .data(stackdata.reverse())
  .enter()
  .append("path")
  .attr("d", area)
  .attr("fill",function(d,i){return colors[i]});

  //奇数発言目
  //grid line
  //引数はstart,stop,stepの順
  //[190,170,150,130,110,90,70,50,30,10]と同等
  var range = d3.range((width)-(width/(color2.length*2)), color2.length-1, -width/(color2.length));
  svg.selectAll("line.v")
  .data(range).enter().append("line")
  .attr("x1", function(d,i){return d;}).attr("y1", 0)
  .attr("x2", function(d,i){return d;}).attr("y2", height);
  svg.selectAll("line")
  .attr("stroke", function(d,i){return color2[color2.length-1-i]})
  .attr("stroke-width", 3)
};



export {force, svg, color, width, height, viz};

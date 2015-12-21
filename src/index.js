/* global kuromoji */
import d3 from "d3"
import "kuromoji"


var svg = d3.select("body").append("svg")
            .attr("width",200)
            .attr("height",200);
        var dataArr = [
            [{x:1,y:3},{x:2,y:5},{x:3,y:7},{x:4,y:3},{x:5,y:5},{x:6,y:7}],
            [{x:1,y:2},{x:2,y:4},{x:3,y:9},{x:4,y:7},{x:5,y:6},{x:6,y:4}],
            [{x:1,y:1},{x:2,y:8},{x:3,y:5},{x:4,y:3},{x:5,y:5},{x:6,y:7}],
            [{x:1,y:8},{x:2,y:6},{x:3,y:3},{x:4,y:2},{x:5,y:7},{x:6,y:4}]
        ];
        var stack = d3.layout.stack()
            .x(function(d){return 1;})
            .y(function(d){return d.y;})
            .values(function(d){return d;});
        var data = stack(dataArr);
        var max = d3.max(data[data.length - 1], function(d){return d.y + d.y0;});
        var scaleX = d3.scale.linear().domain([0,6]).range([0,200]);
        var scaleY = d3.scale.linear().domain([0,max]).range([0,200]);
        var colors = ["blue","purple","red","orange","yellow","#0f0","green"];
        var area = d3.svg.area()
            .x(function(d,i){return i * 200/5})
            .y0(function(d){return 200})
            .y1(function(d){return 200 - scaleY(d.y+d.y0)});
        svg.selectAll("path")
            .data(data.reverse())
            .enter()
            .append("path")
            .attr("d", area)
            .attr("fill",function(d,i){return colors[i]});
    

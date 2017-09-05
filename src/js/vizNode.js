/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import d3 from "d3";
import $ from "jquery"

let color_of_client="red"
let color_of_people_around_client="gray"


let vizNodes=(nodeArray)=>{
    var svg = d3.select("#example").append("svg")
        .attr({
            width: 640,
            height: 480,
        });

    var g = svg.selectAll('g')
        .data(nodeArray).enter().append('g')
        .attr({
            transform: function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            },
        });

    g.append('circle')
        .attr({
            'r': function(d) { return d.r; },
            'stroke':function(d,i){if(i==0){return color_of_client}else{return color_of_people_around_client}},
            'fill': "white",
            'stroke-width': (d)=>{return d.circleStrokeWidth}
        });

    g.append('text')
        .attr({
            'text-anchor': "middle",
            'dy': ".35em",
            'fill': 'black',
        })
        .text(function(d) { return d.nodeCharacter });

    $("#ex2").slider({})
}

export {vizNodes}
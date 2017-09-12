/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import d3 from "d3";
import $ from "jquery"

const color_of_client="red"
const color_of_people_around_client="gray"

const r=60
const yajirushi_refX = 16;

const markerFillColor ="red"

const characterChartAreaID = "#example"

let vizNodes=(nodeArray)=>{
    //console.log("entered vizNodes")
    var svg = d3.select(characterChartAreaID).append("svg")
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
            'r': function(d) { return r; },
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

    if(nodeArray.length>=2){
        vizArrow(svg,nodeArray)
    }

}

let vizArrow=(svg,nodeArray)=>{
    let circle_data_array=[[nodeArray[0].x, nodeArray[0].y, r],[nodeArray[1].x, nodeArray[1].y, r]]

    var marker = svg.append("defs").append("marker")
        .attr({
            'id': "arrowhead",
            // 矢印の位置を一番後ろから手前に少しずらす
            'refX': yajirushi_refX,
            'refY': 2,
            'markerWidth': 4,
            'markerHeight': 4,
            'orient': "auto"
        });
    marker.append("path")
        .attr({
            d: "M 0,0 V 4 L4,2 Z",
            fill: markerFillColor
        });

    var line = d3.svg.line()
        .interpolate('basis')
        .x(function(d) {return d[0];})
        .y(function(d) {return d[1];});

    var path = svg.append('path')
        .attr({
            'd': line(circle_data_array),
            'stroke': "red",
            'stroke-width': 5,
            'fill': 'none',
            'marker-end':"url(#arrowhead)",
        });

    // pathの長さを調べて、丸の半径２個分＋矢印を後ろに下げる分の長さを引きます。
    var totalLength = path.node().getTotalLength();
    var t = totalLength - (r+r+yajirushi_refX);
    path.attr({
        // 破線の指定を行います。
        'stroke-dasharray': "0 " + r + " " + t + " " + r,
        // 破線の開始相対位置を指定します
        'stroke-dashoffset': 0,
    });
}

let removeSVG = () => {
    d3.select(characterChartAreaID).select("svg").remove()
}

export {vizNodes,removeSVG}
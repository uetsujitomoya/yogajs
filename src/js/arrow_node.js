/**
 * Created by uetsujitomoya on 2017/08/13.
 */

//createsvg();

let color_of_client = "red"
let color_of_people_around_client = "gray"


class arrow{
    constructor(character_of_start_point,character_of_end_point,sentence,node_array){


    }
}


let show_node = () => {

}


let show_arrow = (node) => {

}



function createsvg () {
    var svg = d3.select("#example").append("svg")
        .attr({
            width: 640,
            height: 480,
        });

    // pathの計算で使うので、半径と矢印の微調整パラメータを別定義にしている。
    var r1 = 30;
    var r2 = 20;
    var ref1 = 8;
    var c1 = [100, 90, r1];
    var c2 = [200, 120, r2];
    var carray = [c1, c2];

    var marker = svg.append("defs").append("marker")
        .attr({
            'id': "arrowhead",
            // 矢印の位置を一番後ろから手前に少しずらす
            'refX': ref1,
            'refY': 2,
            'markerWidth': 4,
            'markerHeight': 4,
            'orient': "auto"
        });
    marker.append("path")
        .attr({
            d: "M 0,0 V 4 L4,2 Z",
            fill: "steelblue"
        });

    var color = d3.scale.category10();

    var g = svg.selectAll('g')
        .data(carray).enter().append('g')
        .attr({
            transform: function(d) {
                return "translate(" + d[0] + "," + d[1] + ")";
            },
        });

    g.append('circle')
        .attr({
            'r': function(d) { return d[2]; },
            'fill': function(d,i) { return color(i); },
        });

    g.append('text')
        .attr({
            'text-anchor': "middle",
            'dy': ".35em",
            'fill': 'white',
        })
        .text(function(d,i) { return i+1; });

    var line = d3.svg.line()
        .interpolate('basis')
        .x(function(d) {return d[0];})
        .y(function(d) {return d[1];});

    var path = svg.append('path')
        .attr({
            'd': line(carray),
            'stroke': 'lightgreen',
            'stroke-width': 5,
            'fill': 'none',
            'marker-end':"url(#arrowhead)",
        });

    // pathの長さを調べて、丸の半径２個分＋矢印を後ろに下げる分の長さを引きます。
    var totalLength = path.node().getTotalLength();
    var t = totalLength - (r1+r2+ref1);
    path.attr({
        // 破線の指定を行います。
        'stroke-dasharray': "0 " + r1 + " " + t + " " + r2,
        // 破線の開始相対位置を指定します
        'stroke-dashoffset': 0,
    });
};

export {createsvg}
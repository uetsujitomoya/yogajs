/**
 * Created by uetsujitomoya on 2017/08/13.
 */

//createsvg();

import d3 from "d3";

const color_of_client = "red"
const color_of_people_around_client = "gray"
const circleStrokeWidth = 5

const path_stroke_with = 5
const pathStrokeColor = color_of_client

const markerRefX=0
const markerRefY=0
const markerWidth=4
const markerHeight=4
const markerFillColor = color_of_client



class arrow{
    constructor(character_of_start_point,character_of_end_point,sentence,node_array){
    }
}

//verb情報+object+subject情報


//1.subject+verbのみ→◯
//2.object+subject+verb→矢印

let show_node = () => {

}


let show_arrow = (node) => {

}



function createsvg () {
    console.log("entered createsvg")

    var svg = d3.select("#example").append("svg")
        .attr({
            width: 640,
            height: 480,
        });

    // pathの計算で使うので、半径と矢印の微調整パラメータを別定義にしている。
    var r1 = 30;
    var r2 = 20;
    var yajirushi_refX = 8;
    var c1 = [100, 90, r1];
    var c2 = [200, 120, r2];
    var circle_data_array = [c1, c2];

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

    var color = d3.scale.category10();

    var g = svg.selectAll('g')
        .data(circle_data_array).enter().append('g')
        .attr({
            transform: function(d) {
                return "translate(" + d[0] + "," + d[1] + ")";
            },
        });

    g.append('circle')
        .attr({
            'r': function(d) { return d[2]; },
            'stroke':function(d,i){if(i==0){return color_of_client}else{return color_of_people_around_client}},
            'fill': "white",
            'stroke-width': circleStrokeWidth
        });

    g.append('text')
        .attr({
            'text-anchor': "middle",
            'dy': ".35em",
            'fill': 'black',
        })
        .text(function(d,i) { return i+1; });

    var line = d3.svg.line()
        .interpolate('basis')
        .x(function(d) {return d[0];})
        .y(function(d) {return d[1];});

    var path = svg.append('path')
        .attr({
            'd': line(circle_data_array),
            'stroke': pathStrokeColor,
            'stroke-width': 5,
            'fill': 'none',
            'marker-end':"url(#arrowhead)",
        });

    // pathの長さを調べて、丸の半径２個分＋矢印を後ろに下げる分の長さを引きます。
    var totalLength = path.node().getTotalLength();
    var t = totalLength - (r1+r2+yajirushi_refX);
    path.attr({
        // 破線の指定を行います。
        'stroke-dasharray': "0 " + r1 + " " + t + " " + r2,
        // 破線の開始相対位置を指定します
        'stroke-dashoffset': 0,
    });

    console.log("end of createsvg")
};


/*

function createsvg () {
    // id:exampleが指定されているタグ(ここではdivタグ)の下に、svgを追加します。
    // widthとheightを指定します。
    var svg = d3.select("#example").append("svg")
        .attr({
            width: 640,
            height: 480,
        });
};
*/

let append_circle = (svg,cx,cy,r) => {
// svgの下にcircleを追加します。
    // cx,cy:中心座標(x,y)、r:半径を指定します。
    svg.append('circle')
        .attr({
            'cx': cx,
            'cy': cy,
            'r': r,
        });
}

let append_circles = (svg, character_array) => {
    var circle = svg.selectAll('circle').data(character_array).enter().append('circle')
        .attr({
            'cx': function(d) { return d.Node.node_cx; },
            'cy': function(d) { return d.Node.node_cy; },
            'r': function(d) { return d.Node.circle_r; },
            'fill': function(d) { return d.Node.circle_color; }
        });
}

let append_circle_groups = (svg,character_array) => {
    var node_g = svg.selectAll('g')
        .data(character_array).enter().append('g')
        .attr({
            // 座標はg側で設定する
            // 座標設定を動的に行う
            transform: function(d) {
                return "translate(" + d.node.x + "," + d.node.y + ")";
            },
        });

    // g.appendでデータ毎に要素を追加できる
    node_g.append('circle')
        .attr({
            'r': function(d) { return d.node.y; },
            'fill': function(d) { return d.node.color; },
        });
    node_g.append('text')
        .attr({
            // 真ん中若干下に配置されるように、文字色は白に。
            'text-anchor': "middle",
            'dy': ".35em",
            'fill': "white",
        })
        // iは0から始まるので、+1しておく
        .text(function(d) { return d.name; });
}


let append_arrow = (svg,arrow_data_array) => {
    var marker = svg.append("defs").append("marker")
        .attr({
            'id': "arrowhead",
            'refX': markerRefX,//path方向
            'refY': markerRefY,//pathに垂直な方向
            'markerWidth': markerWidth,
            'markerHeight': markerHeight,
            'orient': "auto"
        });
    // 矢印の形をpathで定義します。
    marker.append("path")
        .attr({
            d: "M 0,0 v 4 l0,2 Z",
            fill: markerFillColor
        });

    var line = d3.svg.line()
        .interpolate('basis')
        .x(function(d) {return d[0];})
        .y(function(d) {return d[1];});

    var path = svg.append('path')
        .attr({
            'd': line(arrow_data_array),
            'stroke': pathStrokeColor,
            'stroke-width': path_stroke_with,
            'fill': 'none',
            // pathの属性として、上で定義した矢印を指定します
            'marker-end':"url(#arrowhead)",
        });
}

export {createsvg}
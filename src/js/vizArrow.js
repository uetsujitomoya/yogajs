/**
 * Created by uetsujitomoya on 2017/09/04.
 */

let vizNodes=(svg,arrowArray)=>{
    var gOfArrow = svg.selectAll('g')
        .data(nodeArray).enter().append('g')

    var marker = gOfArrow.append("defs").append("marker")
        .attr({
            'id': function(d) {return d.markerId;},//id１個１個つくらなあかん？
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



    // 線の関数"line()"を定義
    var line = d3.svg.line()
        .interpolate('basis')
        .x(function(arrow) {return arrow.x})
        .y(function(arrow) {return arrow.y})

    // 線要素定義
    var path = gOfArrow.append('path')
        .attr({
            'd': line(d),
            'stroke': 'lightgreen',
            'stroke-width': 5,
            'fill': 'none',
            'marker-end':"url(#arrowhead)",
        })


    // pathの長さを調べて、丸の半径２個分＋矢印を後ろに下げる分の長さを引きます。
    var totalLength = path.node().getTotalLength();
    var t = totalLength - (r1+r2+yajirushi_refX);
    path.attr({
        // 破線の指定を行います。
        'stroke-dasharray': "0 " + r1 + " " + t + " " + r2,
        // 破線の開始相対位置を指定します
        'stroke-dashoffset': 0,
    });
}
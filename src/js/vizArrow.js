/**
 * Created by uetsujitomoya on 2017/09/04.
 */

let vizNodes=(svg,arrowArray)=>{
    var g = svg.selectAll('g')
        .data(nodeArray).enter().append('g')

    g.append('circle')
        .attr({
            'r': function(d) { return d.r; },
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



    // 線の関数"line()"を定義
    var line = d3.svg.line()
        .interpolate('basis')
        .x(function(d) {return d.x;})
        .y(function(d) {return d.y;});

    // 線要素定義
    var path = svg.append('path')
        .attr({
            'd': line(arrowArray),
            'stroke': 'lightgreen',
            'stroke-width': 5,
            'fill': 'none',
            'marker-end':"url(#arrowhead)",
        });
}
/**
 * Created by uetsujitomoya on 2017/09/04.
 */

let color_of_client
let color_of_people_around_client


let vizNodes=(svg,nodeArray)=>{
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
            'stroke-width': circleStrokeWidth
        });

    g.append('text')
        .attr({
            'text-anchor': "middle",
            'dy': ".35em",
            'fill': 'black',
        })
        .text(function(d,i) { return i+1; });
}
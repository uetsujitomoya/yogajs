/* global kuromoji */
import d3 from "d3"
import "kuromoji"

var width = 960,
    height = 500;

var color = d3.scale.category20c();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
  const path = tokenizer.tokenize("すもももももももものうち");
  console.log(path);

  d3.json("miserables.json", function(error, graph) {
    if (error) throw error;

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();


    var link = svg.selectAll(".link")
        .data(graph.links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
        .data(graph.nodes)
      .enter().append("text")
        .attr("class", "node")
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag)
        .text(function(d) { return d.name.substring(0,4); });




    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });
    });
  });
});



var b = ["酒","借金"];
var c = ["借りる","過食"];
 var a = [b,c];



 /*var k_danraku = {    //形態素解析段落
   "danraku1":[
     "私",
     "生きる",
     "いる"
   ],
   "danraku2":[
     "ここ",
     "生きる"
   ]
 }
*/


var danraku0 = ["A","B","C"];
var danraku1 = ["B","D"];
var k_danraku = [danraku0,danraku1];



/*danraku1.add()

var danraku = ["段落あ","段落い"];
var A =
*/

var tangoset = new Set();



tangoset.add(danraku.tango);




var tangoset = ["a","b","c","d"];

var keitaisokaiseki = [[1,0],[1,1],[1,0],[0,1]];
var link = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
var i,j,k,l;
for(i=0; i<tangoset.size; ++i){
for(j=i+1; j<tangoset.size; ++j){
for(k=0; k<danraku.size; ++k){
  for(l=0; l<danraku.size; ++l){
    if(keitaisokaiseki[i][k]==1&&keitaisokaiseki[j][l]==1){
      link[i][j]=1;
    }
  }
}
}
}



var jaccard


var miserable = {
  "nodes":[
    {"name":"1","group":1},
    {"name":"2","group":2},
    {"name":"3","group":3},
    {"name":"4","group":4},
    {"name":"8","group":8},
    {"name":"7","group":7},
    {"name":"6","group":6},
    {"name":"5","group":5},
    {"name":"結局","group":1},
    {"name":"思う","group":6},
    {"name":"関係","group":6},
    {"name":"入る","group":2},
    {"name":"仕事","group":5},
    {"name":"人","group":4},
    {"name":"嘔吐","group":8},
    {"name":"見える","group":2},
    {"name":"分かる","group":3},
    {"name":"過食","group":7},
    {"name":"嫌い","group":1},
    {"name":"悪い","group":2},
    {"name":"2つ","group":7},
    {"name":"対人","group":1},
    {"name":"ストレス","group":8},
    {"name":"風","group":3},
    {"name":"信頼","group":2},
    {"name":"一つ","group":5},
    {"name":"行動","group":1},
    {"name":"調子","group":4},
    {"name":"考える","group":4},
    {"name":"気持ち","group":2},
    {"name":"言う","group":2},
    {"name":"ま","group":3},
    {"name":"自分","group":2},
    {"name":"B","group":1}
  ],
  "links":[
    {"source":11,"target":8,"value":1},
    {"source":13,"target":11,"value":8},
    {"source":13,"target":12,"value":10},
    {"source":12,"target":9,"value":6},
    {"source":10,"target":9,"value":1},
    {"source":14,"target":10,"value":1},
    {"source":15,"target":13,"value":1},
    {"source":16,"target":14,"value":1},
    {"source":17,"target":14,"value":2},
    {"source":18,"target":15,"value":1},
    {"source":19,"target":16,"value":1},
    {"source":20,"target":17,"value":3},
    {"source":21,"target":19,"value":3},
    {"source":22,"target":20,"value":5},
    {"source":25,"target":23,"value":1},
    {"source":24,"target":23,"value":1},
    {"source":26,"target":24,"value":1},
    {"source":27,"target":22,"value":1},
    {"source":25,"target":22,"value":4},
    {"source":28,"target":27,"value":4},
    {"source":29,"target":25,"value":4},
    {"source":31,"target":28,"value":4},
    {"source":30,"target":29,"value":4},
    {"source":32,"target":31,"value":4},
    {"source":33,"target":32,"value":3}
  ]
};

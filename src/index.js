import d3 from "d3"

var i,j,k,l;

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


    //以下計算中
/*
    var b = ["酒","借金"];
    var c = ["借りる","過食"];
     var a = [b,c];

*/

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
    var keitaisokaiseki = [["あ","い","う"],["い","え"]];

console.log(keitaisokaiseki[0][0]);

    /*danraku1.add()

    var danraku = ["段落あ","段落い"];
    var A =
    */




//for
//    tangoset.add(danraku.tango);












    var jaccard







    var miserables = {
      "nodes":[
        {"id":0,"name":"1","group":1},
        {"id":1,"name":"2","group":2},
        {"id":2,"name":"3","group":3},
        {"id":3,"name":"4","group":4},
        {"id":4,"name":"8","group":8},
        {"id":5,"name":"7","group":7},
        {"id":6,"name":"6","group":6},
        {"id":7,"name":"5","group":5},
        {"id":8,"name":"結局","group":1},
        {"id":9,"name":"思う","group":6},
        {"id":10,"name":"関係","group":6},
        {"id":11,"name":"入る","group":2},
        {"id":12,"name":"仕事","group":5},
        {"id":13,"name":"人","group":4},
        {"id":14,"name":"嘔吐","group":8},
        {"id":15,"name":"見える","group":2},
        {"id":16,"name":"分かる","group":3},
        {"id":17,"name":"過食","group":7},
        {"id":18,"name":"嫌い","group":1},
        {"id":19,"name":"悪い","group":2},
        {"id":20,"name":"2つ","group":7},
        {"id":21,"name":"対人","group":1},
        {"id":22,"name":"ストレス","group":8},
        {"id":23,"name":"風","group":3},
        {"id":24,"name":"信頼","group":2},
        {"id":25,"name":"一つ","group":5},
        {"id":26,"name":"行動","group":1},
        {"id":27,"name":"調子","group":4},
        {"id":28,"name":"考える","group":4},
        {"id":29,"name":"気持ち","group":2},
        {"id":30,"name":"言う","group":2},
        {"id":31,"name":"ま","group":3},
        {"id":32,"name":"自分","group":2},
        {"id":33,"name":"B","group":1}
      ],
      "links":[
        {"source":11,"target":8,"value":0},
        {"source":13,"target":11,"value":0},
        {"source":13,"target":12,"value":0},
        {"source":12,"target":9,"value":0},
        {"source":10,"target":9,"value":0},
        {"source":14,"target":10,"value":0},
        {"source":15,"target":13,"value":0},
        {"source":16,"target":14,"value":0},
        {"source":17,"target":14,"value":0},
        {"source":18,"target":15,"value":0},
        {"source":19,"target":16,"value":0},
        {"source":20,"target":17,"value":0},
        {"source":21,"target":19,"value":0},
        {"source":22,"target":20,"value":0},
        {"source":25,"target":23,"value":0},
        {"source":24,"target":23,"value":0},
        {"source":26,"target":24,"value":0},
        {"source":27,"target":22,"value":0},
        {"source":25,"target":22,"value":0},
        {"source":28,"target":27,"value":0},
        {"source":29,"target":25,"value":0},
        {"source":31,"target":28,"value":0},
        {"source":30,"target":29,"value":0},
        {"source":32,"target":31,"value":0},
        {"source":33,"target":32,"value":0}
      ]
    };


miserables.nodes = new Set();
miserables.links = new Set();
var tangoset = miserables.nodes;

//nodes書き換え。nodesはオブジェクトmiserables内にある配列
//keitaisokaiseki.length は段落数
//keitaisokaiseki[i].lengthは段落[i]内の単語数
console.log(keitaisokaiseki.length);
for(i=0;i<keitaisokaiseki.length;++i){
  console.log(keitaisokaiseki[i].length);
  for(j=0;j<keitaisokaiseki[i].length;++j){
    tangoset.add(keitaisokaiseki[i][j]);
  }
}
console.log(miserables.nodes);

for(k=0;k<tangoset.length;++k){
  miserables.nodes[k].name =miserables.nodes[k];

  miserables.nodes[k].group =1;//ゆくゆくはjaccard係数に
}
//node作成終了。miserables.nodes.lengthがtangosetになってるはず
  console.log(miserables.nodes);

var danrakusuu = keitaisokaiseki.length;

console.log(danrakusuu);
//あとはlinksの作成だけ
//まずはlistをつくる
var list;
//list作成
//keitaisokaisekiとnodesを照らしあわせる
for(i=0;i<keitaisokaiseki.length;++i){//danrakusuuはkeitaisokaisekiとlistで共通
  for(j=0;j<keitaisokaiseki[i].length;++j){
    for(k=0;k<tangoset.length;++k){
      if(keitaisokaiseki[i][j]==tangoset[k].name){
        list[i][k]=1;
      } else{
        list[i][k]=0;
      }
    }
  }
}
console.log(list);
//listはi*k
var list3//どの段落でどれとどれが共起されてるか
//listからmiserables.linksとlist3をつくる
for(i=0;i<keitaisokaiseki.length;++i){

    for(k=0;k<tangoset.length;++k){
      for(l=k+1;l<tangoset.length;++l){//別の単語を見る
      if(list[i][k]==1 && list[i][l]==1){
        miserables.links.add({"source":l,"target":k,"value":0});
        list3[i][k][l]=1;
      }else{
        list3[i][k][l]=0;

      }
      }
    }
  }

//list3[段落][単語k][単語l]

//value太さをつける
var edges = miserables.links;

for(i=0;i<keitaisokaiseki.length;++i){

    for(k=0;k<tangoset.length;++k){
      for(l=k+1;l<tangoset.length;++l){//別の単語を見る

for(j=0;k<edges.length;++k){  //edgesをjで見ていく
  if(list3[i][k][l]==1 && edges[j].source==l && edges[j].target==k){
  edges[j].value++;
}
}
}
}
}





/*
for(i=0;i<keitaisokaiseki.length;++i){
  for(j=0;j<keitaisokaiseki[i].length;++j){
    miserables.nodes.add();
    miserables.nodes[].name =;
    miserables.nodes[].group =1;//ゆくゆくはjaccard係数に
  }
}
*/
/*    for(i=0; i<tangoset.length; ++i){
    for(j=i+1; j<tangoset.length; ++j){
    for(k=0; k<k_danraku.length; ++k){
      for(l=0; l<k_danraku.length; ++l){
        if(keitaisokaiseki[i][k]==1&&keitaisokaiseki[j][l]==1){
          miserables.nodes[i].value=1;
        }
      }
    }
    }
  }*/


//以上計算中

var graph = miserables;
//d3.json("miserables.json", function(error, graph) {


//  if (error) throw error;

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
//});

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




    var danraku0 = ["A","B","C"];
    var danraku1 = ["B","D"];
    var keitaisokaiseki = [["あ","い","う"],["い","え"]];

console.log(keitaisokaiseki[0][0]);







var tangoset = new Set();


//var tangoset = miserables.nodes;

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
var miserables={"nodes":new Array,"links":new Array};

console.log(tangoset);

miserables.nodes = Array.from(tangoset).map(function(t) {
  return {name:t};
  // body...
});

console.log(miserables.nodes[0]);

for(k=0;k<miserables.nodes.length;++k){


  miserables.nodes[k].group =1;//ゆくゆくはjaccard係数に
}
//node作成終了。miserables.nodes.lengthがtangosetになってるはず
  console.log(miserables.nodes);
  console.log(miserables.nodes.length);

var danrakusuu = keitaisokaiseki.length;

console.log(danrakusuu);
//あとはlinksの作成だけ
//まずはlistをつくる
var list = new Array(keitaisokaiseki.length);
//list作成
//keitaisokaisekiとnodesを照らしあわせる
for(i=0;i<keitaisokaiseki.length;++i){//danrakusuuはkeitaisokaisekiとlistで共
  list[i] = new Array(miserables.nodes.length);
  for(j=0;j<keitaisokaiseki[i].length;++j){
    for(k=0;k<miserables.nodes.length;++k){
      if(keitaisokaiseki[i][j]==miserables.nodes[k].name){
        list[i][k]=1;
        console.log(i,k,list[i][k]);
      }
    }
  }
}
console.log(keitaisokaiseki[0][0]);
console.log(miserables.nodes[0].name);
console.log(list);
console.log(list[0][0]);
//listはi*k

//listからmiserables.linksとlist3をつくる

var x,y;

for(i=0;i<keitaisokaiseki.length;++i){

    for(k=0;k<miserables.nodes.length;++k){

      for(l=k+1;l<miserables.nodes.length;++l){//別の単語を見る
        console.log(list[i][k]);
        console.log(list[i][l]);
        x=list[i][k];
        y=list[i][l];
      if(x==1 && y==1){
        console.log("hello");
        console.log(i);
        console.log(k);
        console.log(l);
        miserables.links.push({"source":l,"target":k,"value":1});

      }
      }
    }
  }
console.log(miserables.links[0]);

//list3[段落][単語k][単語l]

//value太さをつける
var edges = miserables.links;
/*
for(i=0;i<keitaisokaiseki.length;++i){

    for(k=0;k<miserables.nodes.length;++k){
      for(l=k+1;l<miserables.nodes.length;++l){//別の単語を見る*/
/*
for(j=0;k<edges.length;++k){  //edgesをjで見ていく
  if(list3[i][k][l]==1 && edges[j].source==l && edges[j].target==k){
  edges[j].value++;
}
}
}
}
}

*/



/*
for(i=0;i<keitaisokaiseki.length;++i){
  for(j=0;j<keitaisokaiseki[i].length;++j){
    miserables.nodes.add();
    miserables.nodes[].name =;
    miserables.nodes[].group =1;//ゆくゆくはjaccard係数に
  }
}
*/
/*    for(i=0; i<miserables.nodes.length; ++i){
    for(j=i+1; j<miserables.nodes.length; ++j){
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
      .text(function(d) { return d.name; });




  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
  });

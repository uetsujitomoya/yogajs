/* global kuromoji */
import d3 from "d3"
import "kuromoji"



document.getElementById('load-button').addEventListener('click', function () {
        var file = document.getElementById('file-input').files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            var data = JSON.parse(event.target.result);
            console.log(data);
        };
        reader.readAsText(file);
var i,j,k,l;

var width = 960,
    height = 500;

var color = d3.scale.category20c();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(60)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);






kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
  const path = tokenizer.tokenize(file); //1集計単位ごとにこの関数を用いよう
  console.log(path);

  var keitaisokaiseki = new Array; //このlengthは段落数


  i=0; //iは全データ内で何文字目か
  j=0; //集計単位の何個目か。
  while(i<path.length){
    keitaisokaiseki[j] = new Array;
    k=0; //集計単位内で何文字目か
    while(i<path.length){
      if(path[i].basic_form=="。"){
        i++
        break;
      } else if(path[i].pos=="助詞"||path[i].pos=="助動詞"){
        i++
        continue;
      }
      keitaisokaiseki[j][k] = path[i].basic_form;
      i++;
      k++;
    }
    j++;
  }



//以下、想定していた形態素解析後の結果から、共起ネットワークのノード・エッジ作成へ



console.log(keitaisokaiseki);







var tangoset = new Set();



console.log(keitaisokaiseki.length);
for(i=0;i<keitaisokaiseki.length;++i){
  console.log(keitaisokaiseki[i]);
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


  miserables.nodes[k].group =1;//ゆくゆくは媒介中心性に
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

var x,y,z;

var edge=-1;

    for(k=0;k<miserables.nodes.length;++k){

      for(l=k+1;l<miserables.nodes.length;++l){//別の単語を見る
        //現在単語2個の組み合わせを選択中

        //ここから段落を指定して縦になめる


        for(i=0;i<keitaisokaiseki.length;++i){
          x=list[i][k];
          y=list[i][l];

          if(x==1 && y==1){
            console.log("hello");
            console.log(i);
            console.log(k);
            console.log(l);
            miserables.links.push({"source":l,"target":k,"value":0});
            edge++;//最初のedgeが0
            break;
          }
        }
        //とりあえずエッジつくってbreak
        //こっからvalueを与える
        for(i=0;i<keitaisokaiseki.length;++i){
          x=list[i][k];
          y=list[i][l];
          if(x==1 && y==1){
            z = miserables.links[edge].value;
            z++;
            miserables.links[edge].value = z;
          }
        }
      }
    }
console.log(miserables.links[0]);

//以上計算中

var graph = miserables;



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
    });
  });

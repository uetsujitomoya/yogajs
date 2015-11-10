/* global kuromoji */
import d3 from "d3"
import "kuromoji"


var i,j,k,l;

var width = 848,
    height = 480;

var color = d3.scale.category20c();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(120)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


document.getElementById('load-button').addEventListener('click', function () {
        var file = document.getElementById('file-input').files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            var data = JSON.parse(event.target.result);
            console.log(data);







            kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
              const path = tokenizer.tokenize(data[0].a); //1集計単位ごとにこの関数を用いよう
              console.log(path);

              var keitaisokaiseki = new Array; //このlengthは段落数
              var reasonMatrix = new Array;

              var buntou;
              var tegakari;
              var toutencount;
              var toutenbasho=0;
              i=0; //iは全データ内で何文字目か
              j=0; //何個目の集計単位か。
              var karabasho;
              var reason;
              var kara="から"
              while(i<path.length){
                tegakari=0;//手がかりがあるか
                keitaisokaiseki[j] = new Array; //一文
                reasonMatrix[j] = new Array;
                buntou=i; //現在の文の文頭が何単語目か
                toutencount=0
                reason=1;
                //まずは手がかり語があるか探す

                while(i<path.length){ //kara捜索
                  if(path[i].basic_form==kara){ //手がかり語があったら3区間指定
                    karabasho = i;
                    while(i>0){
                      i=i-1;
                      if(path[i].basic_form=="。"||path[i].basic_form=="？"||path[i].basic_form=="?"||path[i].basic_form=="、"){

                          buntou=i;
                          toutencount=0;
                          break;

                      }
                    }
                    if(i==0){
                      buntou=0;
                    }
                    console.log(buntou);
                    tegakari=1;
                    break;//「から」が見つかった
                  }
                  i++;
                }

                //手がかりがなければbreak
                if(i==path.length){
                  console.log("All kara was found.");
                  break;
                }


                i=buntou
                toutencount=0;
                k=0; //集計単位内で何文字目か
                while(i<path.length){
                  if(i==karabasho+1){
                    reason=0;
                  }
                  if(path[i].basic_form=="。"||path[i].basic_form=="？"||path[i].basic_form=="?"||path[i].basic_form=="、"){
                    if(toutencount<3){
                      i++;
                      toutencount++;
                      continue;
                    } else{
                      i++;
                      toutencount=0;
                      break;//3区間終了
                    }
                  }
                  if(path[i].basic_form==kara||path[i].basic_form=="たぶん"||path[i].basic_form=="られる"||path[i].basic_form=="する"||path[i].basic_form=="なる"||path[i].basic_form=="れる"||path[i].basic_form=="思う"||path[i].basic_form=="自分"||path[i].basic_form=="ちょっと"){
                    i++;
                    continue;
                  }
                  if(path[i].pos=="助詞"||path[i].pos=="助動詞"||path[i].pos=="接続詞"||path[i].pos=="記号"||path[i].pos_detail_1=="非自立"||path[i].basic_form=="それで"||path[i].basic_form=="こう"||path[i].basic_form=="そう"||path[i].pos_detail_1=="代名詞"){
                      i++;
                      continue;
                  }
                  if(path[i].basic_form=="もう"||path[i].basic_form=="こんなに"||path[i].basic_form=="そんな"||path[i].basic_form=="さん"){
                    i++;
                    continue;
                  }

                  keitaisokaiseki[j][k] = path[i].basic_form;
                  reasonMatrix[j][k] = reason;
                  i++;
                  k++;
                }
                if(i==path.length){break;}//keitaisokaiseki作成完了
                i=karabasho+1;
                j++;
              }



            //以下、想定していた形態素解析後の結果から、共起ネットワークのノード・エッジ作成へ



            console.log(keitaisokaiseki);
            console.log(reasonMatrix);







            var tangoset = new Set();




            for(i=0;i<keitaisokaiseki.length;++i){

              for(j=0;j<keitaisokaiseki[i].length;++j){
                tangoset.add({name:keitaisokaiseki[i][j],
                              group:reasonMatrix[i][j]

                            });

            }
          }

          var tangosett = new Array;;

          tangosett = Array.from(tangoset).map(function(t) {
            return {t};
            // body...
          });


            var miserables={"nodes":new Array,"links":new Array};


            for(i=0;i<tangosett.length;i++){
              miserables.nodes[i]=tangosett[i].t;
            }


            console.log(miserables.nodes);
            console.log(miserables.nodes.length);
/*
            for(k=0;k<miserables.nodes.length;++k){


              miserables.nodes[k].group =1;//ゆくゆくは媒介中心性に
            }*/
            //node作成終了。miserables.nodes.lengthがtangosetになってるはず


            var danrakusuu = keitaisokaiseki.length;


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

                  }
                }
              }
            }
            console.log(list);
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

                        miserables.links.push({source:l,target:k,value:0});
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
                console.log(miserables.links);


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
                  .style("fill", function(d) {
                    if(d.group==1){
                      return "red";
                    } else{
                      return "blue";
                    }

                  })
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
        };
        reader.readAsText(file);


        /*clustering*/



  });


  var cluster = require('hierarchical-clustering');
  var colors = [
  [20, 20, 80],
  [22, 22, 90],
  [250, 255, 253],
  [100, 54, 255]
  ];

  // Euclidean distance
  function distance(a, b) {
  var d = 0;
  for (var i = 0; i < a.length; i++) {
  d += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(d);
  }

  // Single-linkage clustering
  function linkage(distances) {
  return Math.min.apply(null, distances);
  }

  var levels = cluster({
  input: colors,
  distance: distance,
  linkage: linkage,
  minClusters: 2, // only want two clusters
  });

  var clusters = levels[levels.length - 1].clusters;
  console.log(clusters);
  // => [ [ 2 ], [ 3, 1, 0 ] ]
  clusters = clusters.map(function (cluster) {
  return cluster.map(function (index) {
  return colors[index];
  });
  });
  console.log(clusters);
  // => [ [ [ 250, 255, 253 ] ],
  // => [ [ 100, 54, 255 ], [ 22, 22, 90 ], [ 20, 20, 80 ] ] ]

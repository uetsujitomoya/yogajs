/* global kuromoji */
import d3 from "d3"
import "kuromoji"

if(1){
  document.write("JavaScriptはONです。");
}


var i,j,k,l,m,n,bunsuu;  //mは段落

var width = 1320,
    height = 660;

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
              n=0; //nは全データ内で何文字目か
              bunsuu=0; //全段落内で何分目か
              m=0; //何個目の発言か
              var karabasho;
              var reason;
              var kara="から"
              while(n<path.length){//発言ごとのループ
                keitaisokaiseki[m] = new Array; //一発言
                i=0; //段落内の何文目か。
                while(n<path.length){//文ごとのループ
                  keitaisokaiseki[m][i] = new Array; //文
                  keitaisokaiseki[m][i].length = 0;
                  reasonMatrix[i] = new Array;
                  k=0; //集計単位内で何単語目か
                  while(n<path.length){//単語ごとのループ
                      if(path[n].basic_form=="。"||path[n].basic_form=="？"||path[n].basic_form=="?"||path[n].word_id=="2613630"){
                        bunsuu++;
                        toutencount=0;
                        break;//3区間終了
                      }
                      keitaisokaiseki[m][i][k] = path[n].basic_form;
                      reasonMatrix[i][k] = reason;
                      n++;
                      k++;
                  }
                  if(n==path.length){//確認
                    break;
                  }
                  if(path[n].word_id=="2613630"){
                    n++;
                    break;
                  }//1段落作成完了
                  n++;
                  i++;//段落内の何文目か
                }
                m++;
              }




            //以下、想定していた形態素解析後の結果から、共起ネットワークのノード・エッジ作成へ



            console.log(keitaisokaiseki);






            var tangoset = new Set();


            var tmp=new Array;

            for(m=0;m
              <keitaisokaiseki.length;++m){
              for(i=0;i<keitaisokaiseki[m].length;++i){
                tmp = keitaisokaiseki[m][i];
                console.log("m=%d,i=%d",m,i);
                console.log(tmp);
                if(keitaisokaiseki[m][i] ==false||keitaisokaiseki[m][i]==new Array){
                  keitaisokaiseki[m][i].length=0;
                  continue;
                }
                for(j=0;j<tmp.length;++j){
                  tangoset.add({name:keitaisokaiseki[m][i][j],
                                group:reasonMatrix[i][j]

                              });

                  }
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






            /*あとはlinksの作成だけ
            まずはlistをつくる*/
            var list = new Array(keitaisokaiseki.length);
            //list作成

            var RGBlist  = new Array(keitaisokaiseki.length);

            //keitaisokaisekiとnodesを照らしあわせる
            for(m=0;m<keitaisokaiseki.length;++m){
              list[m] = new Array(keitaisokaiseki[m].length);
              RGBlist[m] = new Array(keitaisokaiseki[m].length);
              for(i=0;i<keitaisokaiseki[m].length;++i){
                list[m][i] = new Array(miserables.nodes.length);
                RGBlist[m][i] = new Array(3);
                RGBlist[m][i][0]=0;
                RGBlist[m][i][1]=0;
                RGBlist[m][i][2]=0;
                for(j=0;j<keitaisokaiseki[m][i].length;++j){
                  for(k=0;k<miserables.nodes.length;++k){
                    if(keitaisokaiseki[m][i][j]==miserables.nodes[k].name){
                      list[m][i][k]=1;
                      if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"){

                        RGBlist[m][i][0]=RGBlist[m][i][0]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="仕事"||keitaisokaiseki[m][i][j]=="休み"||keitaisokaiseki[m][i][j]=="風邪")
                        RGBlist[m][i][2]=RGBlist[m][i][2]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="友人"){
                        RGBlist[m][i][1]=RGBlist[m][i][1]+1;
                      }

                    }
                  }

                  console.log(RGBlist[m][i]);
                }
              }

              //ドットで区切る
              //単語グループ分け -> 形態素解析時点で。

              //クライアントの各文の得点換算
              //stackdataArr完成


                        var stackdataArr = [
                            [{x:1,y:3},{x:2,y:5},{x:3,y:7},{x:4,y:3},{x:5,y:5},{x:6,y:7}],
                            [{x:1,y:2},{x:2,y:4},{x:3,y:9},{x:4,y:7},{x:5,y:6},{x:6,y:4}],
                            [{x:1,y:1},{x:2,y:8},{x:3,y:5},{x:4,y:3},{x:5,y:5},{x:6,y:7}],
                            [{x:1,y:18},{x:2,y:7},{x:3,y:3},{x:4,y:11},{x:5,y:8},{x:6,y:6}]
                        ];
                        var stack = d3.layout.stack()
                            .x(function(d){return 1;})
                            .y(function(d){return d.y;})
                            .values(function(d){return d;});
                        var stackdata = stack(stackdataArr);
                        var max = d3.max(stackdata[stackdata.length - 1], function(d){return d.y + d.y0;});
                        var scaleX = d3.scale.linear().domain([0,6]).range([0,width/2]);
                        var scaleY = d3.scale.linear().domain([0,max]).range([0,200]);
                        var colors = ["lightgray","#77ff77","#ff7777","#7777ff","yellow","#0f0","green"];
                        var colors2 = ["gray","#d4d","#d4d","gray","#d4d","#d4d","gray"];
                        var area = d3.svg.area()
                            .x(function(d,i){return i * width/10})
                            .y0(function(d){return 200})
                            .y1(function(d){return 200 - scaleY(d.y+d.y0)});
                        svg.selectAll("path")
                            .data(stackdata.reverse())
                            .enter()
                            .append("path")
                            .attr("d", area)
                            .attr("fill",function(d,i){return colors[i]});



                            //grid line
                            //引数はstart,stop,stepの順
                            //[190,170,150,130,110,90,70,50,30,10]と同等
                          var range = d3.range((width/2)-(width/20),4,-width/10);
                          svg.selectAll("line.v")
                            .data(range).enter().append("line")
                            .attr("x1", function(d,i){return d;}).attr("y1", 0)
                            .attr("x2", function(d,i){return d;}).attr("y2", 200);
                          svg.selectAll("line")
                            .attr("stroke", function(d,i){return colors2[i]})
                            .attr("stroke-width", 10)

            //console.log(list);
            //listはi*k

            //listからmiserables.linksとlist3をつくる

            var x,y,z;

            var edge=-1;



                for(k=0;k<miserables.nodes.length;++k){

                  for(l=k+1;l<miserables.nodes.length;++l){//別の単語を見る
                    //現在単語2個の組み合わせを選択中

                    //ここから段落を指定して縦になめる

                    for(m=0;m<keitaisokaiseki.length;++m){
                      for(i=0;i<keitaisokaiseki[m].length;++i){
                        x=list[m][i][k];
                        y=list[m][i][l];

                        if(x==1 && y==1){

                          miserables.links.push({source:l,target:k,value:0});
                          edge++;//最初のedgeが0
                          break;
                        }
                      }
                    }
                      //とりあえずエッジつくってbreak
                      //こっからvalueを与える
                    for(m=0;m<keitaisokaiseki.length;++m){
                      for(i=0;i<keitaisokaiseki[m].length;++i){
                        x=list[m][i][k];
                        y=list[m][i][l];
                        if(x==1 && y==1){
                          z = miserables.links[edge].value;
                          z++;
                          miserables.links[edge].value = z;
                        }
                      }
                    }


                    }


                  }

                //console.log(miserables.links);


            //以上計算中

            var graph = miserables;


//共起マップ
/*
                force
                    .nodes(graph.nodes)
                    .links(graph.links)
                    .start();

*/
/*
                var link = svg.selectAll(".link")
                    .data(graph.links)
                  .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", function(d) { return Math.sqrt(d.value); });
*/
/*              var node = svg.selectAll(".node")
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
*/




/*
                force.on("tick", function() {
                  link.attr("x1", function(d) { return d.source.x; })
                      .attr("y1", function(d) { return d.source.y; })
                      .attr("x2", function(d) { return d.target.x; })
                      .attr("y2", function(d) { return d.target.y; });

                  node.attr("x", function(d) { return d.x; })
                      .attr("y", function(d) { return d.y; });
                });

*/

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










//チェックボックス




              function boxCheck(){

                //チェックされた項目を記録する変数
                var str="";

                //for文でチェックボックスを１つずつ確認
                for( i=0; i<6; i++ )
                {
                  //チェックされているか確認する
                  if( document.chbox.elements[i].checked )
                  {
                    //変数strが空でない時、区切りのコンマを入れる
                    if( str != "" ) str=str+",";

                    //チェックボックスのvalue値を変数strに入れる
                    str=str+document.chbox.elements[i].value;
                  }
                }

                //strが空の時、警告を出す
                if( str=="" ){
                   alert( "どれか選択してください。" );
                }else{
                  alert( str + "が選択されました。" );
                }
              }

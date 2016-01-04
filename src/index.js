/* global kuromoji */
import d3 from "d3"
import "kuromoji"




var h,i,j,k,l,m,n,c,bunsuu;  //mは段落

var width = 960,
    height = 540;

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
              var RGBlist  = new Array;

              var buntou;
              var tegakari;
              var toutencount;
              var toutenbasho=0;
              n=0; //nは全データ内で何文字目か
              bunsuu=0; //全段落内で何分目か
              m=0; //何個目の発言か。これの偶奇わけで判断。カウンセラーが奇数。患者が偶数。1文は1文で格納
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
                  j=0; //集計単位内で何単語目か
                  while(n<path.length){//単語ごとのループ
                      if(path[n].basic_form=="。"||path[n].basic_form=="？"||path[n].basic_form=="?"||path[n].word_id=="2613630"){
                        bunsuu++;
                        toutencount=0;
                        break;//3区間終了
                      }
                      keitaisokaiseki[m][i][j] = path[n].basic_form;
                      reasonMatrix[i][j] = reason;
                      if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"){

                        RGBlist[m][0]=RGBlist[m][0]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="借金"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

                        RGBlist[m][0]=RGBlist[m][0]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="病気"||keitaisokaiseki[m][i][j]=="お金"||keitaisokaiseki[m][i][j]=="両親"||keitaisokaiseki[m][i][j]=="言う"||keitaisokaiseki[m][i][j]=="お母様"||keitaisokaiseki[m][i][j]=="お父様"){

                        RGBlist[m][0]=RGBlist[m][0]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="借金"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

                        RGBlist[m][0]=RGBlist[m][0]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="仕事"||keitaisokaiseki[m][i][j]=="休み"||keitaisokaiseki[m][i][j]=="風邪"||keitaisokaiseki[m][i][j]=="いや"||keitaisokaiseki[m][i][j]=="風"){
                        RGBlist[m][2]=RGBlist[m][2]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="分かる"||keitaisokaiseki[m][i][j]=="焼ける"){
                        RGBlist[m][2]=RGBlist[m][2]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="友人"){
                        RGBlist[m][1]=RGBlist[m][1]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="いかが"||keitaisokaiseki[m][i][j]=="どの"||keitaisokaiseki[m][i][j]=="どのように"||keitaisokaiseki[m][i][j]=="いつ"||keitaisokaiseki[m][i][j]=="どういう"){
                        console.log("%d発言めの%d文目は開かれた質問です",m,i);
                        RGBlist[m][3]=RGBlist[m][3]+1;
                      }
                      if(keitaisokaiseki[m][i][j]=="ね"||keitaisokaiseki[m][i][j]=="そうですね"){
                        console.log("%d発言めの%d文目は閉じられた質問かもしれません",m,i);
                        RGBlist[m][4]=RGBlist[m][4]+1;
                      }
                      n++;
                      j++;
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
                console.log(RGBlist[m]);
                m++;
              }




            //以下、想定していた形態素解析後の結果から、共起ネットワークのノード・エッジ作成へ



            console.log(keitaisokaiseki);






            var tangoset = new Set();


            var tmp=new Array;

            for(m=0;m<keitaisokaiseki.length;++m){
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
            /*あとはlinksの作成だけ
            まずはlistをつくる*/
            var list = new Array(keitaisokaiseki.length);
            	//list作成

            var checkboxlist=new Array;//checkboxに入る一覧
            c=0;

            //keitaisokaisekiとnodesを照らしあわせる
            for(m=0;m<keitaisokaiseki.length;++m){
              list[m] = new Array(keitaisokaiseki[m].length);
              for(i=0;i<keitaisokaiseki[m].length;++i){
                list[m][i] = new Array(miserables.nodes.length);
                
                for(j=0;j<keitaisokaiseki[m][i].length;++j){
                  

                  for(k=0;k<miserables.nodes.length;++k){

                    if(keitaisokaiseki[m][i][j]==miserables.nodes[k].name){
                      list[m][i][k]=1;


                    }

                  	//checkbox用

                    if(keitaisokaiseki[m][i][j]=="母"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    	checkboxlist[c]=keitaisokaiseki[m][i][j];
                    	c++;



                    }
                    if(keitaisokaiseki[m][i][j]=="姉"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="母親"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="お姉さん"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="父"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="家族"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="借金"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="兄"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="子"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="子ども"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="妹"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="弟"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="病気"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="お金"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="両親"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="言う"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="お母様"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="お父様"){

                    	RGBlist[m][0]=RGBlist[m][0]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="仕事"){
                    	RGBlist[m][2]=RGBlist[m][2]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="休み"){
                    	RGBlist[m][2]=RGBlist[m][2]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="風邪"){
                    	RGBlist[m][2]=RGBlist[m][2]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="いや"){
                    	RGBlist[m][2]=RGBlist[m][2]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="風"){
                    	RGBlist[m][2]=RGBlist[m][2]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="分かる"){
                    	RGBlist[m][2]=RGBlist[m][2]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="焼ける"){
                    	RGBlist[m][2]=RGBlist[m][2]+1;
                    }
                    if(keitaisokaiseki[m][i][j]=="友人"){
                    	RGBlist[m][1]=RGBlist[m][1]+1;
                    }
                    

                  }

                  console.log(RGBlist[m][i]);
                }
              }
            //var list = new Array(keitaisokaiseki.length);

            	//list作成終了


//listからcheckboxをつくる
            	/*<div id="disp">この文章を表示したり消したりします。</div>
					
					<form>
					<input type="button" value="表示" onclick="hyoji1(0)">
					<input type="button" value="非表示" onclick="hyoji1(1)">
					</form>*/
            	//listからif文をつくる→checkboxをつくって表示

            	//単語0の番号取得→単語1の番号取得→単語2の番号取得
            	//単語リストmiserables.nodesとlist番号を照らしあわせる→checkbox表示
            	//miserablesnodesから単語名を表示、idとする



            function hyoji1(num)
            {
            	if (num == 0)

            	{
            		document.getElementById("disp").style.display="block";
            	}
            	else
            	{
            		document.getElementById("disp").style.display="none";
            	}
            }

            	//ドットで区切る
            	//単語グループ分け -> 形態素解析時点で。

            	//クライアントの各文の得点換算
            	//stackdataArr完成
            	//偶数発言目
//checkbox情報取得
            	//checkboxからcheckリストをつくり、RGBlistつくる


            	/*<form name="form1" action="">
					<input id="Checkbox1" type="checkbox" /><label for="Checkbox1">チェック項目1</label><br />
					<input id="Checkbox2" type="checkbox" /><label for="Checkbox2">チェック項目2</label><br />
					<input type="button" value="Exec" onclick="onButtonClick();" />
				  </form>
				 
				  <div id="output"></div>*/

            var check = new Array(3);//rgbに対応
            check[0]=new Array;
            check[1]=new Array;
            check[2]=new Array;


            function onButtonClick() {
				while(i<)
            	check[i] = document.form1.i.checked;//リストつくる作業完了、こっから舐める
            	check2 = document.form1.Checkbox2.checked;
 
            	target = document.getElementById("output");
            	if (check[i] == true) {
            		RGBlist[m][0]=RGBlist[m][0]+1;
            	} else {
            		target.innerHTML = "チェック項目1がチェックされていません。<br/>";
            	}
            	if (check2 == true) {
            		target.innerHTML += "チェック項目2がチェックされています。<br/>";
            	} else {
            		target.innerHTML += "チェック項目2がチェックされていません。<br/>";
            	}
            }


            	//check配列でonの単語について、文を舐めてRGBlistをつくる。

            	//偶奇1setでカウント（同じm内に収める）

            m=0;//発言数
            n=0;//偶奇1setのセット数
            while(m<keitaisokaiseki.length){//発言ごとのループ

            	RGBlist[n] = new Array(5);
            	RGBlist[n][0]=0;
            	RGBlist[n][1]=0;
            	RGBlist[n][2]=0;
            	RGBlist[n][3]=0;
            	RGBlist[n][4]=0;
//まずは偶数から（カウンセラー）
            	 //iは発言内の何文目か。
            	for(i=0;i<keitaisokaiseki[m].length;i++){
            		j=0; //集計単位内で何単語目か
            		for(j=0;j<keitaisokaiseki[m][i].length;j++){//単語ごとのループ
            			
            			if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"){

            				RGBlist[n][0]=RGBlist[n][0]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="借金"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

            				RGBlist[m][0]=RGBlist[m][0]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="病気"||keitaisokaiseki[m][i][j]=="お金"||keitaisokaiseki[m][i][j]=="両親"||keitaisokaiseki[m][i][j]=="言う"||keitaisokaiseki[m][i][j]=="お母様"||keitaisokaiseki[m][i][j]=="お父様"){

            				RGBlist[m][0]=RGBlist[m][0]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="借金"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

            				RGBlist[m][0]=RGBlist[m][0]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="仕事"||keitaisokaiseki[m][i][j]=="休み"||keitaisokaiseki[m][i][j]=="風邪"||keitaisokaiseki[m][i][j]=="いや"||keitaisokaiseki[m][i][j]=="風"){
            				RGBlist[m][2]=RGBlist[m][2]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="分かる"||keitaisokaiseki[m][i][j]=="焼ける"){
            				RGBlist[m][2]=RGBlist[m][2]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="友人"){
            				RGBlist[m][1]=RGBlist[m][1]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="いかが"||keitaisokaiseki[m][i][j]=="どの"||keitaisokaiseki[m][i][j]=="どのように"||keitaisokaiseki[m][i][j]=="いつ"||keitaisokaiseki[m][i][j]=="どういう"){
            				console.log("%d発言めの%d文目は開かれた質問です",m,i);
            				RGBlist[m][3]=RGBlist[m][3]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="ね"||keitaisokaiseki[m][i][j]=="そうですね"){
            				console.log("%d発言めの%d文目は閉じられた質問かもしれません",m,i);
            				RGBlist[m][4]=RGBlist[m][4]+1;
            			}
            			
            		}

            	}

            	m++;

//奇数（患者）
            	for(i=0;i<keitaisokaiseki[m].length;i++){
            		j=0; //集計単位内で何単語目か
            		for(j=0;j<keitaisokaiseki[m][i].length;j++){//単語ごとのループ
            			
            			if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"){

            				RGBlist[n][0]=RGBlist[n][0]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="借金"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

            				RGBlist[m][0]=RGBlist[m][0]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="病気"||keitaisokaiseki[m][i][j]=="お金"||keitaisokaiseki[m][i][j]=="両親"||keitaisokaiseki[m][i][j]=="言う"||keitaisokaiseki[m][i][j]=="お母様"||keitaisokaiseki[m][i][j]=="お父様"){

            				RGBlist[m][0]=RGBlist[m][0]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="借金"||keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

            				RGBlist[m][0]=RGBlist[m][0]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="仕事"||keitaisokaiseki[m][i][j]=="休み"||keitaisokaiseki[m][i][j]=="風邪"||keitaisokaiseki[m][i][j]=="いや"||keitaisokaiseki[m][i][j]=="風"){
            				RGBlist[m][2]=RGBlist[m][2]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="分かる"||keitaisokaiseki[m][i][j]=="焼ける"){
            				RGBlist[m][2]=RGBlist[m][2]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="友人"){
            				RGBlist[m][1]=RGBlist[m][1]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="いかが"||keitaisokaiseki[m][i][j]=="どの"||keitaisokaiseki[m][i][j]=="どのように"||keitaisokaiseki[m][i][j]=="いつ"||keitaisokaiseki[m][i][j]=="どういう"){
            				console.log("%d発言めの%d文目は開かれた質問です",m,i);
            				RGBlist[m][3]=RGBlist[m][3]+1;
            			}
            			if(keitaisokaiseki[m][i][j]=="ね"||keitaisokaiseki[m][i][j]=="そうですね"){
            				console.log("%d発言めの%d文目は閉じられた質問かもしれません",m,i);
            				RGBlist[m][4]=RGBlist[m][4]+1;
            			}
            			
            		}

            	}
            	console.log(RGBlist[m]);
            	m++;	
				n++;
            }



		//checkboxのステータスからポイント加算
            			
   



  
			//color2のlistをつくる。奇数RGBlistから。
            	//var colors2 = ["gray","#d4d","#d4d","gray","#d4d","#d4d","gray"];//奇数用
            var color2=new Array();
            for(m=0;m<keitaisokaiseki.length;m=m+2){
            	if(RGBlist[m][3]>=1){

            		color2[m]="#d4d";

            	}else{
            		color2[m]="gray";
            	}
            }
                        
                        var stackdataArr = new Array(5);
                        for(h=0;h<5;h++){
                          stackdataArr[h] = new Array();
                          for(m=0;m<keitaisokaiseki.length/2;m++){//2個飛ばしにしたら後が面倒くさい
                            stackdataArr[h][m]=new Object();
                            stackdataArr[h][m]= {x:m+1,y:28*RGBlist[2m][h]/keitaisokaiseki[m].length};
                          }
                        }
                        var stack = d3.layout.stack()
                            .x(function(d){return 1;})
                            .y(function(d){return d.y;})
                            .values(function(d){return d;});
                        var stackdata = stack(stackdataArr);
                        var max = d3.max(stackdata[stackdata.length - 1], function(d){return d.y + d.y0;});
                        var scaleX = d3.scale.linear().domain([0,keitaisokaiseki.length]).range([0,width]);
                        var scaleY = d3.scale.linear().domain([0,max]).range([0,200]);
                        var colors = ["white","white","#aaaaff","#bbffbb","#ffbbbb","lightgray","#0f0","green"];
                        
                        var area = d3.svg.area()
                            .x(function(d,i){return i * width/keitaisokaiseki.length})
                            .y0(function(d){return 200})
                            .y1(function(d){return 200 - scaleY(d.y+d.y0)});
                        svg.selectAll("path")
                            .data(stackdata.reverse())
                            .enter()
                            .append("path")
                            .attr("d", area)
                            .attr("fill",function(d,i){return colors[i]});


//奇数発言目
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

                        if(x==
1 && y==1){

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

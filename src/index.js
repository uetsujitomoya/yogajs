/* global kuromoji */
import d3 from "d3"
import "kuromoji"




var h,i,j,k,l,m,n,c,r,g,b,x,y,z,bunsuu;  //mは段落

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
		//console.log(data);







		kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
			const path = tokenizer.tokenize(data[0].a); //1集計単位ごとにこの関数を用いよう
			console.log(path);

			var keitaisokaiseki = new Array; //このlengthは段落数
			var hinshi = new Array;
			var RGB = new Array;//どの発言にRGBが入っているか大まかに色分け
			var RGBlist  = new Array;//checkboxのセレクト結果

			var buntou;
			var tegakari;
			var toutencount;
			var toutenbasho=0;
			n=0; //nは全データ内で何文字目か
			bunsuu=0; //全段落内で何分目か
			m=0; //何個目の発言か。これの偶奇わけで判断。カウンセラーが奇数。患者が偶数。1文は1文で格納
			while(n<path.length){//発言ごとのループ
				keitaisokaiseki[m] = new Array; //一発言
				hinshi[m] = new Array;
				RGB[m] = new Array;
				
				if(m%2==1){
					RGBlist[(m-1)/2] = new Array(5);
				}
				
				i=0; //段落内の何文目か。
				while(n<path.length){//文ごとのループ
					keitaisokaiseki[m][i] = new Array; //文
					hinshi[m][i]=new Array;
					keitaisokaiseki[m][i].length = 0;
					RGB[m][i] = new Array(3);
					RGB[m][i][0]=0;
					RGB[m][i][1]=0;
					RGB[m][i][2]=0;
					
					j=0; //集計単位内で何単語目か
					while(n<path.length){//単語ごとのループ
						if(path[n].basic_form=="。"||path[n].basic_form=="？"||path[n].basic_form=="?"||path[n].word_id=="2613630"){
							bunsuu++;
							toutencount=0;
							break;
						}
						if(path[n].pos_detail_1=="接尾"||path[n].basic_form=="*"||path[n].pos=="助詞"||path[n].basic_form=="、"||path[n].pos=="記号"||path[n].pos=="助動詞"||path[n].pos=="感動詞"||path[n].pos=="接続詞"||path[n].pos=="接頭詞"||path[n].pos_detail_1=="非自立"){
							n++;//これないと延々ループする
							continue;
						}
						keitaisokaiseki[m][i][j] = path[n].basic_form;
						hinshi[m][i][j]=new Object();
						hinshi[m][i][j]=path[n];

						//ぐう期分け
						if(m%2==0){
							//カウンセラー（この発言rgbにがあることを示す）

							if(keitaisokaiseki[m][i][j]=="母"||keitaisokaiseki[m][i][j]=="姉"||keitaisokaiseki[m][i][j]=="母親"||keitaisokaiseki[m][i][j]=="お姉さん"||keitaisokaiseki[m][i][j]=="父"||keitaisokaiseki[m][i][j]=="家族"){

								RGB[m][i][0]=1;
							}
							if(keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

								RGB[m][i][0]=1;
							}
							if(keitaisokaiseki[m][i][j]=="両親"||keitaisokaiseki[m][i][j]=="お母様"||keitaisokaiseki[m][i][j]=="お父様"){

								RGB[m][i][0]=1;
							}
							if(keitaisokaiseki[m][i][j]=="兄"||keitaisokaiseki[m][i][j]=="子"||keitaisokaiseki[m][i][j]=="子ども"||keitaisokaiseki[m][i][j]=="妹"||keitaisokaiseki[m][i][j]=="弟"){

								RGB[m][i][0]=1;
							}
							if(keitaisokaiseki[m][i][j]=="仕事"||keitaisokaiseki[m][i][j]=="休み"){
								RGB[m][i][2]=1;
							}
							
							if(keitaisokaiseki[m][i][j]=="友人"||keitaisokaiseki[m][i][j]=="親友"||keitaisokaiseki[m][i][j]=="友達"||keitaisokaiseki[m][i][j]=="友"||keitaisokaiseki[m][i][j]=="交友"||keitaisokaiseki[m][i][j]=="友好"){
								RGB[m][i][1]=1;
							}
                      	
						}else if(m%2==1){
							//患者

							if(keitaisokaiseki[m][i][j]=="いかが"||keitaisokaiseki[m][i][j]=="どの"||keitaisokaiseki[m][i][j]=="どのように"||keitaisokaiseki[m][i][j]=="いつ"||keitaisokaiseki[m][i][j]=="どういう"){
								console.log("%d発言めの%d文目は開かれた質問です",m,i);
								RGBlist[(m-1)/2][3]=1;
								RGBlist[(m-1)/2][4]=0;
							}
							if(keitaisokaiseki[m][i][j]=="ね"||keitaisokaiseki[m][i][j]=="そうですね"){
								console.log("%d発言めの%d文目は閉じられた質問かもしれません",m,i);
								RGBlist[(m-1)/2][3]=0;
								RGBlist[(m-1)/2][4]=1;
								
							}

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
				m++;
			}


			//keitaisokaiseki完成


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
							group:0
						});//tangoset終了


					}
				}
			}


			var tangosett = new Array;;

			tangosett = Array.from(tangoset).map(function(t) {
				return {t};
				// body
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

				var checkboxlist=new Array(miserables.nodes.length);//checkboxに入る単語に1+RGBどれかの情報が3次元
				for(k=0;k<miserables.nodes.length;k++){
					checkboxlist[k]=new Array;
					checkboxlist[k][0]=0;
					checkboxlist[k][1]=0;
					checkboxlist[k][2]=0;
					checkboxlist[k][3]=0;
				}
				var checkboxRGB=new Array(3);
				checkboxRGB[0]=new Array;
				checkboxRGB[1]=new Array;
				checkboxRGB[2]=new Array;

				var chboxlist=new Array;//通し番号


				c=0;
				r=0;
				b=0;
				g=0;

				var target = document.getElementById("chbox");//checkboxを出す場所


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

							if(RGB[m][i][0]+RGB[m][i][1]+RGB[m][i][2]>=1){

								//checkboxを出す
								//<input id=Checkbox1 type=checkbox /><label for=Checkbox1>チェック項目1</label><br />
								
								
								
								
								

								if(RGB[m][i][0]==1){
									if(checkboxlist[k][1]==0){//単語とグループの組み合わせの重複を防ぐ
										target.innerHTML += "<input id=\"" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「愛(恋愛･家族関係)」に。</label><br />";
										console.log("%d,%d,%d,%sを愛に",m,i,j,miserables.nodes[k].name);
										console.log(hinshi[m][i][k]);
										checkboxlist[k][0]=1;
										checkboxlist[k][1]=1;
										chboxlist[c]=new Array(2);
										chboxlist[c][0]=miserables.nodes[k].name;
										chboxlist[c][1]=0;
										c++;
									}
								}
								if(RGB[m][i][1]==1){
									if(checkboxlist[k][2]==0){
										target.innerHTML += "<input id=\"" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「交友関係」に。</label><br />";
										console.log("%sを交友に",miserables.nodes[k].name);
										console.log(hinshi[m][i][k]);
										checkboxlist[k][0]=1;
										checkboxlist[k][2]=1;
										chboxlist[c]=new Array(2);
										chboxlist[c][0]=miserables.nodes[k].name;
										chboxlist[c][1]=1;
										c++;
									}
								}
								if(RGB[m][i][2]==1){
									if(checkboxlist[k][3]==0){
										target.innerHTML += "<input id=\"" + c + "\" type=checkbox checked /><label for="+c+">「" + miserables.nodes[k].name + "」を「仕事関係」に。</label><br />";
										console.log("%sを仕事に",miserables.nodes[k].name);
										console.log(hinshi[m][i][k]);
										checkboxlist[k][0]=1;
										checkboxlist[k][3]=1;
										chboxlist[c]=new Array(2);
										chboxlist[c][0]=miserables.nodes[k].name;
										chboxlist[c][1]=2;
										c++;
									}
								}

								

								
								//関連発言内の全単語を出力する



							}
                    

						}

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



           

				//ドットで区切る
				//単語グループ分け -> 形態素解析時点で。

				//クライアントの各文の得点換算
				//stackdataArr完成
				//偶数発言目
				//checkbox情報取得
				//checkboxからcheckリストをつくり、RGBlistつくる


				/*<form name="form1" id="checkbox" action="">
					<input type="button" value="Exec" onclick="onButtonClick();" />
					<input id="Checkbox1" type="checkbox" /><label for="Checkbox1">チェック項目1</label><br />
					<input id="Checkbox2" type="checkbox" /><label for="Checkbox2">チェック項目2</label><br />
					
				  </form>
				 
				  <div id="output"></div>*/

			

			}
		})//kuromoji.builder終了
		};//reader.onload終了。これとなんちゃら(file)が並列してないといけない
	reader.readAsText(file);


	});//document.getElementById終了






			//これか。

document.getElementById('check-button').addEventListener('click', function () {
	console.log("手順2に進んだよ")
	var checked = new Array(chboxlist.length);
					
	for(c=0;i<chboxlist.length;c++){
		checked[i] = document.form1.i.checked;//リストつくる作業完了、こっから舐める
	}
	console.log(checked);
						
	//check2 = document.form1.Checkbox2.checked;
 
					

	//check配列でonの単語について、文を舐めてRGBlistをつくる。

	//偶奇1setでカウント（同じm内に収める）

	m=0;//発言数
	n=0;//偶奇1setのセット数
	while(m<keitaisokaiseki.length){//発言ごとのループ

						
		RGBlist[n][0]=0;
		RGBlist[n][1]=0;
		RGBlist[n][2]=0;
						
		//まずは偶数から（カウンセラー）
		//iは発言内の何文目か。
		for(i=0;i<keitaisokaiseki[m].length;i++){
			j=0; //集計単位内で何単語目か
			for(j=0;j<keitaisokaiseki[m][i].length;j++){//単語ごとのループ
				for(c=0;c<checkboxlist.length;c++){
								
					if (checked[c] == true) {
						if(keitaisokaiseki[m][i][j]==chboxlist[c][0]){
							if(chboxlist[c][1]=0){
								RGBlist[n][0]=RGBlist[n][0]+1;
							}else if(chboxlist[c][1]=1){
								RGBlist[n][1]=RGBlist[n][1]+1;
							}else if(chboxlist[c][1]=2){
								RGBlist[n][2]=RGBlist[n][2]+1;
							}
						}
									
										
					}
				}
            			
								
            			
			}

		}

		m++;

		//奇数（患者）
						
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
			stackdataArr[h][m]= {x:m+1,y:28*RGBlist[2*m][h]/keitaisokaiseki[m].length};
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


					
});


	//checkbox依存部分終わり


	//console.log(list);
	//listはi*k

	//listからmiserables.linksとlist3をつくる

			

	var edge=-1;

	/*
	
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
	
	*/

	//console.log(miserables.links);


	//以上計算中

	//var graph = miserables;


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

		
		
		


	/*clustering*/



	


	var cluster = require('hierarchical-clustering');
	/*var colors = [
	[20, 20, 80],
	[22, 22, 90],
	[250, 255, 253],
	[100, 54, 255]
	];*/



	// Euclidean distance
	/*function distance(a, b) {
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
	//console.log(clusters);
	// => [ [ 2 ], [ 3, 1, 0 ] ]
	clusters = clusters.map(function (cluster) {
		return cluster.map(function (index) {
			return colors[index];
		});
	});
	//console.log(clusters);
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
	}*/

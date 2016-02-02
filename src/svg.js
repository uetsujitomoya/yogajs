import d3 from "d3"

var height0=200,width=1320
var height =0;

var viz=(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki,RGBmaxmax) => {
	var m;
	var bunsuu=2;//前後の余白
	for(m=1;m<hatsugen.length;m=m+2){//患者の発言で間隔を作る
		if(m==hatsugen.length-1){
			bunsuu = bunsuu + hatsugen[m].length/2;
			break;
		}
		bunsuu = bunsuu + hatsugen[m].length;
	}
	var nagasa=[];//縦棒の位置
	nagasa[0]=1*width/(bunsuu+1);
	for(m=1;m<hatsugen.length;m=m+2){
		nagasa[(m+1)/2]=nagasa[-1 + (m+1)/2]+hatsugen[m].length*width/bunsuu;
	}
	var stack = d3.layout.stack()
	.x(function(d){return 1;})
	.y(function(d){return d.y;})
	.values(function(d){return d;});
	var stackdata = stack(stackdataArr);
	var scaleX = d3.scale.linear().domain([0,color2.length]).range([width/(color2.length),width]);
	var scaleY = d3.scale.linear().domain([0,6]).range([0,height0]);
	var colors = ["#7777ff","#77ff77","#ff7777"];
	var colorBun=["dimgray","#ff7777","#77ff77","#7777ff"];
	var area0 = d3.svg.area()
	.x(function(d,i){return (nagasa[i]+nagasa[i+1])/2})
	.y0(function(d){return height0})
	.y1(function(d){return height0 - scaleY(d.y+d.y0)});

	var margin = {top: 50+height0, right: 10, bottom: 20, left: 40};

	var margin2 = {top: 10, right: 10, bottom: 50, left: 40};

	/*var focus = svg.append("g") //ズームグラフグループ作成
	.attr("class", "focus")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/

	var context = svg.append("g") //全体グラフグループ作成
	.attr("class", "context")
	.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

	context.selectAll("path")
	.data(stackdata.reverse())
	.enter()
	.append("path")
	.attr("d", area0)
	.attr("fill",function(d,i){return colors[i]});


	var range = d3.range((width)-(width/(color2.length*2)), color2.length-1, -width/(color2.length));
	context.selectAll("line.v")
	.data(range).enter().append("line")
	.attr("x1", function(d,i){
		return nagasa[i];
	}).attr("y1", 0)
	.attr("x2", function(d,i){return nagasa[i];}).attr("y2", height0);
	context.selectAll("line")
	.attr("stroke", function(d,i){return color2[i]})
	.attr("stroke-width", function(d,i){
		return(Math.sqrt(keitaisokaiseki[2*i].length));
	})
	.on('mouseover', function(d,i){
		var e = document.getElementById('msg');
		var k,l;
		e.innerHTML = "";
		for(k=-3;k<=3;k++){
			if(2*(i)+k<0||2*(i)+k>=hatsugen.length){
				continue;
			}
			if(k==0){
				e.innerHTML += "<b><u><font size=3>"+(1+2*i)+" <font color="+color2[i]+">【</font>"+hatsugen[2*i]+"<font color="+color2[i]+">】</font></font></u></b><font size=1><br><br></font>";
			}else if(k%2==0){
				e.innerHTML += "<font size=1>"+(1+k+2*i)+" <font color="+color2[k/2+i]+"><b>【</b></font>"+hatsugen[k+2*i]+"<font color="+color2[k/2+i]+"><b>】</b></font><br><br></font>";
			}else{
				e.innerHTML += (1+k+2*i)+" ";
				for(l=0;l<bun[k+2*i].length;l++){
					if(bun[k+2*i][l]==""){continue;}
					e.innerHTML += "<font size=1><font color="+colorBun[checkedBun[k+2*i][l]]+"><b>【</b></font>"+bun[k+2*i][l]+"<font color="+colorBun[checkedBun[k+2*i][l]]+"><b>】</b></font></font>";
				}
				e.innerHTML += "<font size=1><br><br></font>";
			}
		}
	})



	//以下追加分

	//ズームグラフ用（ズーム後グラフ）、margin, scale, axis設定

	//var width = 960 - margin.left - margin.right;


	var scaleX2 = d3.scale.linear().domain([0,bunsuu]).range([0,width]);
	var scaleX2copy = d3.scale.linear().domain([0,bunsuu]).range([0,width]);
	var scaleY2 = d3.scale.linear().domain([0,RGBmaxmax]).range([height,0]);
	var xAxisF = d3.svg.axis().scale(scaleX2).orient("bottom");//focus
	var yAxis = d3.svg.axis().scale(scaleY2).orient("left");//focus


	var xAxisC = d3.svg.axis().scale(scaleX2).orient("bottom");//context


	//ズームグラフareaオブジェクト
	/*
	var area = d3.svg.area()
	.x(function(d,i){return (nagasa[i]+nagasa[i+1])/2})
	.y0(height)
	.y1(function(d){return height - scaleY(d.y+d.y0)});


	//フォーカス時のズームグラフズーム前グラフの表示位置調整のためにクリップパスを作成
	svg.append("defs").append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width)
	.attr("height", height);
*/




	//focusの描画
/*
	focus.selectAll("path")
	.attr("class", "area")
	.data(stackdata.reverse())
	.enter()
	.append("path")
	.attr("class", "area")
	//.attr("clip-path", "url(#clip)") //クリップパスを適用
	.attr("d", area)
	.attr("fill",function(d,i){return colors[i]});

	focus.selectAll("line.v")
	.data(range).enter().append("line")
	.attr("class", "area")
	.attr("x1", function(d,i){
		return nagasa[i];
	}).attr("y1", 0)
	.attr("x2", function(d,i){return nagasa[i];}).attr("y2", height);
	focus.selectAll("line")
	.attr("class", "area")
	.attr("stroke", function(d,i){return color2[i]})
	.attr("stroke-width", function(d,i){
		return(Math.sqrt(keitaisokaiseki[2*i].length));
	})
	.on('mouseover', function(d,i){
		var e = document.getElementById('msg');
		var k,l;
		e.innerHTML = "";
		for(k=-3;k<=3;k++){
			if(2*(i)+k<0||2*(i)+k>=hatsugen.length){
				continue;
			}
			if(k==0){
				e.innerHTML += "<b><u><font size=3>"+(1+2*i)+" <font color="+color2[i]+">【</font>"+hatsugen[2*i]+"<font color="+color2[i]+">】</font></font></u></b><font size=1><br><br></font>";
			}else if(k%2==0){
				e.innerHTML += "<font size=1>"+(1+k+2*i)+" <font color="+color2[k/2+i]+"><b>【</b></font>"+hatsugen[k+2*i]+"<font color="+color2[k/2+i]+"><b>】</b></font><br><br></font>";
			}else{
				e.innerHTML += (1+k+2*i)+" ";
				for(l=0;l<bun[k+2*i].length;l++){
					if(bun[k+2*i][l]==""){continue;}
					e.innerHTML += "<font size=1><font color="+colorBun[checkedBun[k+2*i][l]]+"><b>【</b></font>"+bun[k+2*i][l]+"<font color="+colorBun[checkedBun[k+2*i][l]]+"><b>】</b></font></font>";
				}
				e.innerHTML += "<font size=1><br><br></font>";
			}
		}
	})

	focus.append("g")  //focusのx目盛軸
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxisF);
	*/
	context.append("g") //focusのy目盛軸
	.attr("class", "y axis")
	.call(yAxis);


	/*
	context.append("path") //全体グラフ描画

	.datum(data)
	.attr("d", area2);
	*/

	context.append("g") //全体x目盛軸
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height0 + ")")
	.call(xAxisC);


	/*
	*brushは透明なrectをグループ上設置しマウスイベントを取得する。
	*設置したrect上ではドラッグで範囲選択が可能
	*範囲が選択されている状態でbrush.extent()メソッドを実行するとその範囲のデータ値を返す
	*/
/*
	var brush = d3.svg.brush() //brushオブジェクト作成
	.x(scaleX2copy) //全体グラフx軸を選択可能範囲に指定
	.on("brush", brushed);

	context.append("g") //brushグループを全体グラフに作成
	.attr("class", "x brush")
	.call(brush)
	.selectAll("rect")
	.attr("y", -6)
	.attr("height", height0 + 7);


	function brushed() {
		console.log( brush.extent());
		scaleX2.domain(brush.empty() ? scaleX.domain() : brush.extent()); //選択されたデータセットの範囲をscaleX2のdomainに反映
		focus.select(".area").attr("d", area); //ズームグラフアップデート（focus描画）
		focus.select(".x.axis").call(xAxisF); //ズームx軸アップデート
	}
	*/

	//以上追加分

};









var funcChecked = (chboxlist,checked,taiou,chboxlength) => {
	var c;
	for(c=1;c<=chboxlength;c++){
		const radio = document.getElementById("r"+c).children;
		for(let i = radio.length-3, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				if(radio[i].control.value=="1"){
					checked[taiou[c-1]] =1;
					break;
				}else if(radio[i].control.value=="2"){
					checked[taiou[c-1]] =2;
					break;
				}else if(radio[i].control.value=="3"){
					checked[taiou[c-1]] =3;
					break;
				}
			}else{
				checked[taiou[c-1]] =0;
			}
		}
	}
};

var funcChecked2 = (chboxlist,chboxlist2,checked2,taiou,chboxlength,chboxlength2) => {
	var c;
	for(c=chboxlength+1;c<=chboxlength+chboxlength2;c++){
		const radio = document.getElementById("r"+c).children;
		for(let i = radio.length-5, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				if(radio[i].control.value=="3"){
					checked2[taiou[c-1]] =3;
					break;
				}
				if(radio[i].control.value=="4"){
					checked2[taiou[c-1]] =4;
					break;
				}
				if(radio[i].control.value=="5"){
					checked2[taiou[c-1]] =5;
					break;
				}
				if(radio[i].control.value=="6"){
					checked2[taiou[c-1]] =6;
					break;
				}
			}else{
				checked2[taiou[c-1]] =7;
			}
		}
	}
};

var setForViz = (keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2) => {
	d3.select("#svgdiv").select("svg").remove();
	var svg = d3.select("#svgdiv").append("svg")
	.attr("height",height0+height+70)

	.attr("width",width);
	var color2=[];
	var stackdataArr = [];
	if(chboxlength>=1){
		funcChecked(chboxlist,checked,taiou,chboxlength);
	}
	if(chboxlength2>=1){
		funcChecked2(chboxlist,chboxlist2,checked2,taiou,chboxlength,chboxlength2);
	}

	var h,i,j,c,m,n;

	for(n=0;n<RGBlist.length;n++){
		RGBlist[n][0]=0;
		RGBlist[n][1]=0;
		RGBlist[n][2]=0;
	}
	var checkedBun=[];
	n=0;//m=1;m<keitaisokaiseki.length;m=m+2の外
	for(m=1;m<keitaisokaiseki.length;m=m+2){
		checkedBun[m]=[];//svgでの描画ではm→i
		for(i=0;i<keitaisokaiseki[m].length;i++){
			checkedBun[m][i]=0;
			for(c=1;c<chboxlist.length;c++){
				if(bun[m][i]==chboxlist[c][0]){
					if(checked[c-1]==1){
						RGBlist[n][0]=RGBlist[n][0]+1;
						checkedBun[m][i]=1;
					}else if(checked[c-1]==2){
						RGBlist[n][1]=RGBlist[n][1]+1;
						checkedBun[m][i]=2;
					}else if(checked[c-1]==3){
						RGBlist[n][2]=RGBlist[n][2]+1;
						checkedBun[m][i]=3;
					}
				}
			}
		}
		n++
	}
	for(c=0;c<checked2.length;c++){
		if(checked2[c]==3){
			color2[c]="deeppink";
		}else if(checked2[c]==5){
			color2[c]="purple";
		}else if(checked2[c]==4){
			color2[c]="blue";
		}else if(checked2[c]==6){
			color2[c]="orangered";
		}else{
			color2[c]="black";
		}
	}

	var RGBmax=[];
	var RGBmaxmax=1;

	for(m=0;m<((keitaisokaiseki.length-1)/2);m++){//2個飛ばしにしたら後が面倒くさい。患者 1→0　3→1 長さ9なら番号は8まで
		RGBmax[m]=1;
		for(h=0;h<3;h++){
			RGBmax[m]=RGBmax[m]+RGBlist[m][h];
		}
		if(RGBmaxmax<RGBmax[m]){
			RGBmaxmax=RGBmax[m];
		}
	}

	for(h=0;h<3;h++){
		stackdataArr[h] = [];
		for(m=0;m<((keitaisokaiseki.length-1)/2);m++){//2個飛ばしにしたら後が面倒くさい。患者 1→0　3→1 長さ9なら番号は8まで
			stackdataArr[h][m]=new Object();
			stackdataArr[h][m]= {x:m+1,y:(5*(RGBlist[m][h])/RGBmaxmax)};
		}
	}
	viz(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki,RGBmaxmax);
	return{
		chboxlist:chboxlist,
		chboxlist2:chboxlist2,
		RGBlist:RGBlist,
		checked:checked,
		checked2:checked2,
		chboxlength:chboxlength,
		chboxlength2:chboxlength2
	}
}

export {setForViz};

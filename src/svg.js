import d3 from "d3";


var height0=200,width=1320;
var height =200;

var viz=(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki,RGBmaxmax,startTime,graph) => {
	var m;
	var bunsuu=2;//前後の余白
	for(m=1;m<hatsugen.length;m=m+2){//患者の発言で間隔を作る
		bunsuu = bunsuu + hatsugen[m].length;
	}
	var nagasa=[];//縦棒の位置
	nagasa[0]=1*width/(bunsuu+1);
	for(m=1;m<hatsugen.length;m=m+2){
		nagasa[(m+1)/2]=nagasa[-1 + (m+1)/2]+hatsugen[m].length*width/bunsuu;
	}

	var margin2 = {top: 10, right: 10, bottom: 50, left: 40};



	if(graph==3){

		var dataset = [11, 25, 45, 30, 33];

		var w = 500;
		var h = 200;
		var padding = 20;

		var xScale = d3.scale.linear()
		.domain([0, d3.max(dataset)])
		.range([padding, w  - padding])
		.nice();

		var svg2 = d3.select("body").append("svg").attr({width:w, height:h});

		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

		svg2.append("g")
		.attr({
			class: "axis",
			transform: "translate(0, 180)"
		})
		.call(xAxis);

		svg2.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr({
			x: padding,
			y: function(d, i) { return i * 25; },
			width: function(d) { return xScale(d) - padding; },
			height: 20,
			fill: "red"
		});
	}else{
		//stack
		var context = svg.append("g") //全体グラフグループ作成
		.attr("class", "context")
		.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

		var scaleY = d3.scale.linear().domain([0,6]).range([0,height0]);
		var colors = ["#d7d7ff","#d7ffd7","#ffd7d7"];
		var colorBun=["white","#ffdddd","#ddffdd","#ddddff"];

		var stack = d3.layout.stack()
		.x(function(){return 1;})
		.y(function(d){return d.y;})
		.values(function(d){return d;});
		var stackdata = stack(stackdataArr);


		var area0 = d3.svg.area()
		.x(function(d,i){
			if(i%3==0){return nagasa[i/3];}else if(i%3==1){return nagasa[(i-1)/3+1]-3;}else{return nagasa[(i-2)/3+1]-2;}

		})//nagasa[i]+nagasa[i+1])/2
		.y0(function(){return height0;})
		.y1(function(d){return height0 - scaleY(d.y+d.y0);});



		context.selectAll("path")
		.data(stackdata.reverse())
		.enter()
		.append("path")
		.attr("d", area0)
		.attr("fill",function(d,i){return colors[i];});
		//以上、stack

		//棒
		var range = d3.range((width)-(width/(color2.length*2)), color2.length-1, -width/(color2.length));
		context.selectAll("line.v")
		.data(range).enter().append("line")
		.attr("x1", function(d,i){
			return nagasa[i];
		}).attr("y1", 0)
		.attr("x2", function(d,i){return nagasa[i];}).attr("y2", height0);
		context.selectAll("line")
		.attr("stroke", function(d,i){return color2[i];})
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
					e.innerHTML += "<b><u><font size=3>"+(1+2*i)+"(T) <font color="+color2[i]+">【</font>"+hatsugen[2*i]+"<font color="+color2[i]+">】</font></font></u></b><font size=2><br><br></font>";
				}else if(k%2==0){
					e.innerHTML += "<font size=2>"+(1+k+2*i)+"(T) <font color="+color2[k/2+i]+"><b>【</b></font>"+hatsugen[k+2*i]+"<font color="+color2[k/2+i]+"><b>】</b></font><br><br></font>";
				}else{
					e.innerHTML += (1+k+2*i)+"(C) ";
					for(l=0;l<bun[k+2*i].length;l++){
						if(bun[k+2*i][l]==""){continue;}
						e.innerHTML += "<font size=2><font color="+colorBun[checkedBun[k+2*i][l]]+"><b>【</b></font>"+bun[k+2*i][l]+"<font color="+colorBun[checkedBun[k+2*i][l]]+"><b>】</b></font></font>";
					}
					e.innerHTML += "<font size=2><br><br></font>";
				}
			}
		});

		var scaleX2 = d3.scale.linear().domain([0,bunsuu]).range([0,width]);
		var scaleY2 = d3.scale.linear().domain([0,RGBmaxmax]).range([height,0]);
		var yAxisC = d3.svg.axis().scale(scaleY2).orient("left");//focus

		var xAxisC = d3.svg.axis().scale(scaleX2).orient("bottom");//context

		context.append("g") //focusのy目盛軸
		.attr("class", "y axis")
		.call(yAxisC);

		context.append("g") //全体x目盛軸
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height0 + ")")
		.call(xAxisC);
	}









	var endTime = new Date();
	console.log((endTime - startTime) / 1000 + '秒経過');
	var timeKeeping=(endTime - startTime) / 1000 + '秒経過';
	var timeKeepingArea = document.getElementById('timeKeeping');
	timeKeepingArea.innerHTML = "<br>"+timeKeeping+"<br>";

};









var funcChecked = (name,storage,chboxlist,checked,taiou,chboxlength) => {
	var c;
	for(c=1;c<=chboxlength;c++){
		const radio = document.getElementById("r"+c).children;
		for(let i = radio.length-3, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				if(radio[i].control.value=="1"){
					checked[taiou[c-1]] =1;
					storage.setItem(name+"RGB"+c, 0);
					break;
				}else if(radio[i].control.value=="2"){
					checked[taiou[c-1]] =2;
					storage.setItem(name+"RGB"+c, 1);
					break;
				}else if(radio[i].control.value=="3"){
					checked[taiou[c-1]] =3;
					storage.setItem(name+"RGB"+c, 2);
					break;
				}
			}else{
				checked[taiou[c-1]] =0;
			}
		}
	}
};

var funcChecked2 = (name,storage,chboxlist,chboxlist2,checked2,taiou,taiou2,chboxlength,chboxlength2) => {

	var c;

	var black=0;
	for(c=1;c<=chboxlength2;c++){
		const radio = document.getElementById("rs"+c).children;
		for(let i = radio.length-5, l = radio.length; i < l; i++){

			if(radio[i].control.checked==true){
				//storage.getItem(name+"RGBlist"+m)=
				if(radio[i].control.value=="3"){
					checked2[taiou[c-1]] =3;
					storage.setItem(name+"RGBlist"+c, 3);
					console.log("c=%d,tf=3",c);
					break;
				}
				if(radio[i].control.value=="4"){
					checked2[c-1] =4;
					storage.setItem(name+"RGBlist"+c, 4);
					console.log("c=%d,tf=4",c);
					break;
				}
				if(radio[i].control.value=="5"){
					checked2[c-1] =5;
					storage.setItem(name+"RGBlist"+c, 5);
					console.log("c=%d,tf=5",c);
					break;
				}
				if(radio[i].control.value=="6"){
					checked2[c-1] =6;
					storage.setItem(name+"RGBlist"+c, 6);
					console.log("c=%d,tf=6",c);
					break;
				}
			}else{
				checked2[c-1] =7;
				storage.setItem(name+"RGBlist"+c, 7);
				console.log("c=%d,tf=7",c);
			}
		}
		if(checked2[c-1]==7){
			black++;
		}
	}
	console.log("black=%d",black);
};

var setForViz = (name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph) => {
	console.log("chboxlength2 in svg.js=%d",chboxlength2);
	d3.select("#svgdiv").select("svg").remove();
	var svg = d3.select("#svgdiv").append("svg")
	.attr("height",270)

	.attr("width",width);
	var color2=[];
	var stackdataArr = [];
	if(chboxlength>=1){
		funcChecked(name,storage,chboxlist,checked,taiou,chboxlength);
	}
	console.log("chboxlength2 in svg.js=%d",chboxlength2);
	if(chboxlength2>=1){
		funcChecked2(name,storage,chboxlist,chboxlist2,checked2,taiou,taiou2,chboxlength,chboxlength2);
	}
	console.log("chboxlength2 in svg.js=%d",chboxlength2);

	var h,i,c,m,n;

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
		n++;
	}
	for(c=0;c<checked2.length;c++){
		if(checked2[c]==3){
			color2[c]="#b52f25";
		}else if(checked2[c]==5){
			color2[c]="purple";
		}else if(checked2[c]==4){
			color2[c]="#2b4e91";
		}else if(checked2[c]==6){
			color2[c]="orange";
		}else{
			color2[c]="black";
		}
	}

	var RGBmax=[];
	var RGBmaxmax=1;

	for(m=0;m<((keitaisokaiseki.length-1)/2);m++){
		//2個飛ばしにしたら後が面倒くさい。患者 1→0,3→1,長さ9なら番号は8まで
		RGBmax[m]=1;
		for(h=0;h<3;h++){
			RGBmax[m]=RGBmax[m]+RGBlist[m][h];
		}
		if(RGBmaxmax<RGBmax[m]){
			RGBmaxmax=RGBmax[m];
		}
	}

	const radio = document.getElementById("graph").children;
	console.info(radio);
	for(let i=0;i<=2;i++){
		if(radio[i].control.checked==true){
			//storage.getItem(name+"RGBlist"+m)=
			if(radio[i].control.value=="12"){
				graph=2;
			}else if(radio[i].control.value=="13"){
				graph=3;
			}else{
				graph=1;
			}
		}
	}

	for(h=0;h<3;h++){
		stackdataArr[h] = [];
		for(m=0;m<((keitaisokaiseki.length-1)/2);m++){
			stackdataArr[h][3*m]=new Object();
			if(graph==2){
				stackdataArr[h][3*m]= {x:3*m+1,y:0};
			}else{
				stackdataArr[h][3*m]= {x:3*m+1,y:(5*(RGBlist[m][h])/RGBmaxmax)};
			}

			stackdataArr[h][3*m+1]=new Object();
			stackdataArr[h][3*m+1]= {x:3*m+2,y:(5*(RGBlist[m][h])/RGBmaxmax)};
			stackdataArr[h][3*m+2]=new Object();
			stackdataArr[h][3*m+2]= {x:3*m+3,y:0};
		}
	}
	viz(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki,RGBmaxmax,startTime,graph);
	//console.log("chboxlength2 in svg.js=%d",chboxlength2);
	return{
		chboxlist:chboxlist,
		chboxlist2:chboxlist2,
		RGBlist:RGBlist,
		checked:checked,
		checked2:checked2,
		chboxlength:chboxlength,
		chboxlength2:chboxlength2
	};
};

export {setForViz};

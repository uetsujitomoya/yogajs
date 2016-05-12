import d3 from "d3";

<<<<<<< HEAD
var height=200,width=2000;

var viz=(stackdataArr,color2,bun,svg) => {
	//console.log("func viz start");
=======
var height0=200,width=1320;
var height =200;
>>>>>>> katamukikesu

var viz=(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki,RGBmaxmax,startTime) => {
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
	var stack = d3.layout.stack()
	.x(function(d){return 1;})
	.y(function(d){return d.y;})
	.values(function(d){return d;});
	var stackdata = stack(stackdataArr);
	var scaleX = d3.scale.linear().domain([0,color2.length]).range([width/(color2.length),width]);
<<<<<<< HEAD
	var scaleY = d3.scale.linear().domain([0,6]).range([0,height]);
	var colors = ["#7777ff","#77ff77","#ff7777"];

	var area = d3.svg.area()
	.x(function(d,i){return (width/(color2.length*2)-(color2.length-1)*(-1+width/(color2.length))+(i+1)*(-1+width/color2.length))})
	.y0(function(d){return height})
	.y1(function(d){return height - scaleY(d.y+d.y0)});
	svg.selectAll("path")
=======
	var scaleY = d3.scale.linear().domain([0,6]).range([0,height0]);
	var colors = ["#d7d7ff","#d7ffd7","#ffd7d7"];
	var colorBun=["white","#ffdddd","#ddffdd","#ddddff"];
	var area0 = d3.svg.area()
	.x(function(d,i){
		if(i%3==0){return nagasa[i/3];}else if(i%3==1){return nagasa[(i-1)/3+1]-3;}else{return nagasa[(i-2)/3+1]-2;}

	})//nagasa[i]+nagasa[i+1])/2
	.y0(function(d){return height0;})
	.y1(function(d){return height0 - scaleY(d.y+d.y0)});



	var margin = {top: 50+height0, right: 10, bottom: 20, left: 40};

	var margin2 = {top: 10, right: 10, bottom: 50, left: 40};



	var context = svg.append("g") //全体グラフグループ作成
	.attr("class", "context")
	.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

	context.selectAll("path")
>>>>>>> katamukikesu
	.data(stackdata.reverse())
	.enter()
	.append("path")
	.attr("d", area0)
	.attr("fill",function(d,i){return colors[i];});


<<<<<<< HEAD

	console.log("range,%d,%d,%d",width-(width/(color2.length*2)), color2.length-1,1-width/(color2.length));
	var range = d3.range(width-(width/(color2.length*2)), color2.length-1, 1-width/(color2.length));
	svg.selectAll("line.v")
=======
	var range = d3.range((width)-(width/(color2.length*2)), color2.length-1, -width/(color2.length));
	context.selectAll("line.v")
>>>>>>> katamukikesu
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
<<<<<<< HEAD
		//console.log("%d,%s",2*(color2.length-i-1),bun[2*(color2.length-i-1)]);
		console.log("%d,%d",d,i);
		var e = document.getElementById('msg');
<<<<<<< HEAD
		e.innerHTML = (-2+2*(color2.length-i-1))+" "+bun[-3+2*(color2.length-i-1)]+"<br>"+(-1+2*(color2.length-i-1))+" "+bun[-2+2*(color2.length-i-1)]+"<br>"+(2*(color2.length-i-1))+" "+bun[-1+2*(color2.length-i-1)]+"<br><b><u>"+(1+2*(color2.length-i-1))+" "+bun[2*(color2.length-i-1)]+"</u></b><br>"+(2+2*(color2.length-i-1))+" "+bun[1+2*(color2.length-i-1)]+"<br>"+(3+2*(color2.length-i-1))+" "+bun[2+2*(color2.length-i-1)]+"<br>"+(4+2*(color2.length-i-1))+" "+bun[3+2*(color2.length-i-1)];
=======
		if(i==color2.length-1){
			e.innerHTML = "<b><u>"+(1+2*(color2.length-i-1))+" "+bun[2*(color2.length-i-1)]+"</u></b><br>"+(2+2*(color2.length-i-1))+" "+bun[1+2*(color2.length-i-1)]+"<br>"+(3+2*(color2.length-i-1))+" "+bun[2+2*(color2.length-i-1)]+"<br>"+(4+2*(color2.length-i-1))+" "+bun[3+2*(color2.length-i-1)];
		}else if(i==color2.length-2){
			e.innerHTML = (-1+2*(color2.length-i-1))+" "+bun[-2+2*(color2.length-i-1)]+"<br>"+(2*(color2.length-i-1))+" "+bun[-1+2*(color2.length-i-1)]+"<br><b><u>"+(1+2*(color2.length-i-1))+" "+bun[2*(color2.length-i-1)]+"</u></b><br>"+(2+2*(color2.length-i-1))+" "+bun[1+2*(color2.length-i-1)]+"<br>"+(3+2*(color2.length-i-1))+" "+bun[2+2*(color2.length-i-1)]+"<br>"+(4+2*(color2.length-i-1))+" "+bun[3+2*(color2.length-i-1)];
		}else if(i==1){
			e.innerHTML = (-2+2*(color2.length-i-1))+" "+bun[-3+2*(color2.length-i-1)]+"<br>"+(-1+2*(color2.length-i-1))+" "+bun[-2+2*(color2.length-i-1)]+"<br>"+(2*(color2.length-i-1))+" "+bun[-1+2*(color2.length-i-1)]+"<br><b><u>"+(1+2*(color2.length-i-1))+" "+bun[2*(color2.length-i-1)]+"</u></b><br>"+(2+2*(color2.length-i-1))+" "+bun[1+2*(color2.length-i-1)]+"<br>"+(3+2*(color2.length-i-1))+" "+bun[2+2*(color2.length-i-1)];
		}else if(i==0){
			e.innerHTML = (-2+2*(color2.length-i-1))+" "+bun[-3+2*(color2.length-i-1)]+"<br>"+(-1+2*(color2.length-i-1))+" "+bun[-2+2*(color2.length-i-1)]+"<br>"+(2*(color2.length-i-1))+" "+bun[-1+2*(color2.length-i-1)]+"<br><b><u>"+(1+2*(color2.length-i-1))+" "+bun[2*(color2.length-i-1)]+"</u></b>";
		}else{
			e.innerHTML = (-2+2*(color2.length-i-1))+" "+bun[-3+2*(color2.length-i-1)]+"<br>"+(-1+2*(color2.length-i-1))+" "+bun[-2+2*(color2.length-i-1)]+"<br>"+(2*(color2.length-i-1))+" "+bun[-1+2*(color2.length-i-1)]+"<br><b><u>"+(1+2*(color2.length-i-1))+" "+bun[2*(color2.length-i-1)]+"</u></b><br>"+(2+2*(color2.length-i-1))+" "+bun[1+2*(color2.length-i-1)]+"<br>"+(3+2*(color2.length-i-1))+" "+bun[2+2*(color2.length-i-1)]+"<br>"+(4+2*(color2.length-i-1))+" "+bun[3+2*(color2.length-i-1)];
		}
>>>>>>> system3
		e.style.color = color2[color2.length-1-i];
	})
=======
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
	var scaleX2copy = d3.scale.linear().domain([0,bunsuu]).range([0,width]);
	var scaleY2 = d3.scale.linear().domain([0,RGBmaxmax]).range([height,0]);
	var xAxisF = d3.svg.axis().scale(scaleX2).orient("bottom");//focus
	var yAxisC = d3.svg.axis().scale(scaleY2).orient("left");//focus

	var xAxisC = d3.svg.axis().scale(scaleX2).orient("bottom");//context

	context.append("g") //focusのy目盛軸
	.attr("class", "y axis")
	.call(yAxisC);

	context.append("g") //全体x目盛軸
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height0 + ")")
	.call(xAxisC);


	var endTime = new Date();
	console.log((endTime - startTime) / 1000 + '秒経過');
	var timeKeeping=(endTime - startTime) / 1000 + '秒経過';
	var timeKeepingArea = document.getElementById('timeKeeping');
	timeKeepingArea.innerHTML = "<br>"+timeKeeping+"<br>";
>>>>>>> katamukikesu
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
<<<<<<< HEAD
	console.log(chboxlist2.length);
	for(c=1;c<=chboxlist2.length;c++){
		//console.log("c=%d",c);
		//console.log(document.getElementById(c-1+chboxlist.length));
		const radio = document.getElementById(c-1+chboxlist.length).children;
		for(let i = 1, l = radio.length; i < l; i++){
=======
	var black=0;
	for(c=1;c<=chboxlength2;c++){
		const radio = document.getElementById("rs"+c).children;
		for(let i = radio.length-5, l = radio.length; i < l; i++){
>>>>>>> katamukikesu
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

var setForViz = (name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime) => {
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

	var h,i,j,c,m,n;

	for(n=0;n<RGBlist.length;n++){
		RGBlist[n][0]=0;
		RGBlist[n][1]=0;
		RGBlist[n][2]=0;
	}
<<<<<<< HEAD

	for(c=1;c<chboxlist.length;c++){
		if (checked[c]>=1) {
			//console.log("checked[%d]=%d",c,checked[c]);
			n=0;
			for(m=1;m<keitaisokaiseki.length;m=m+2){
				for(i=0;i<keitaisokaiseki[m].length;i++){
					j=0;
					for(j=0;j<keitaisokaiseki[m][i].length;j++){
						if(keitaisokaiseki[m][i][j]==chboxlist[c][0]){
							//console.log(chboxlist[c][0]);

							if(checked[c-1]==1){

								RGBlist[n][0]=RGBlist[n][0]+1;
								//console.log("c=%d,m=%d,n=%d,%s,RGBlist[%d][%d]=%d",c,m,n,chboxlist[c][0],n,checked[c]-1,RGBlist[n][0]);

							}else if(checked[c-1]==2){

								RGBlist[n][1]=RGBlist[n][1]+1;
								//console.log("c=%d,m=%d,n=%d,%s,RGBlist[%d][%d]=%d",c,m,n,chboxlist[c][0],n,checked[c]-1,RGBlist[n][1]);

							}else if(checked[c-1]==3){

								RGBlist[n][2]=RGBlist[n][2]+1;
								//console.log("c=%d,m=%d,n=%d,%s,RGBlist[%d][%d]=%d",c,m,n,chboxlist[c][0],n,checked[c]-1,RGBlist[n][2]);

							}
						}
=======
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
>>>>>>> katamukikesu
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

	for(h=0;h<3;h++){
		stackdataArr[h] = [];
		for(m=0;m<((keitaisokaiseki.length-1)/2);m++){
			stackdataArr[h][3*m]=new Object();
			stackdataArr[h][3*m]= {x:3*m+1,y:(5*(RGBlist[m][h])/RGBmaxmax)};
			stackdataArr[h][3*m+1]=new Object();
			stackdataArr[h][3*m+1]= {x:3*m+2,y:(5*(RGBlist[m][h])/RGBmaxmax)};
			stackdataArr[h][3*m+2]=new Object();
			stackdataArr[h][3*m+2]= {x:3*m+3,y:0};
		}
	}
	viz(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki,RGBmaxmax,startTime);
	console.log("chboxlength2 in svg.js=%d",chboxlength2);
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

import d3 from "d3"

var width = 1200,
height = 250;

var color = d3.scale.category20c();

var force = d3.layout.force()
.charge(-120)
.linkDistance(120)
.size([width, height]);

var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height);


var viz=(stackdataArr,color2) => {
	console.log("func viz start");

	var stack = d3.layout.stack()
	.x(function(d){return 1;})
	.y(function(d){return d.y;})
	.values(function(d){return d;});
	var stackdata = stack(stackdataArr);
	var max = d3.max(stackdata[stackdata.length-1], function(d){return d.y + d.y0;});
	var scaleX = d3.scale.linear().domain([0,color2.length]).range([width/(color2.length),width]);
	var scaleY = d3.scale.linear().domain([0,max]).range([0,height]);
	var colors = ["#7777ff","#77ff77","#ff7777"];

	var area = d3.svg.area()
	.x(function(d,i){return (i+1) * width/color2.length})
	.y0(function(d){return height})
	.y1(function(d){return height - scaleY(d.y+d.y0)});
	svg.selectAll("path")
	.data(stackdata.reverse())
	.enter()
	.append("path")
	.attr("d", area)
	.attr("fill",function(d,i){return colors[i]});

	//偶数発言目
	//grid line
	//引数はstart,stop,stepの順
	//[190,170,150,130,110,90,70,50,30,10]と同等
	var range = d3.range((width)-(width/(color2.length*2)), color2.length-1, -width/(color2.length));
	svg.selectAll("line.v")
	.data(range).enter().append("line")
	.attr("x1", function(d,i){return d;}).attr("y1", 0)
	.attr("x2", function(d,i){return d;}).attr("y2", height);
	svg.selectAll("line")
	.attr("stroke", function(d,i){return color2[color2.length-1-i]})
	.attr("stroke-width", 3)
	.on("mouseover",  function(d,i){ mouseover(i); })
};

var funcChecked = (chboxlist,checked) => {
	console.log("funcChecked");
	var c;
	for(c=1;c<chboxlist.length;c++){
		//console.log(c);
		const radio = document.getElementById(c).children;
		//console.log(radio);
		for(let i = 1, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				//console.log("c=%d,i=%d",c,i);
				//console.log(radio[i].control.value);
				checked[c-1] = radio[i].control.value;
				if(radio[i].control.value=="1"){
					checked[c-1] =1;
				}else if(radio[i].control.value=="2"){
					checked[c-1] =2;
				}else if(radio[i].control.value=="3"){
					checked[c-1] =3;
				}else{
					checked[c-1] =0;
				}
			}
		}
	}
};

var setForViz = (keitaisokaiseki,checkboxlist,chboxlist,RGBlist,hatsugen,bun) => {
	console.log("setForViz");
	var checked = [];
	var color2=[];
	var stackdataArr = [];
	funcChecked(chboxlist,checked);
	var h,i,j,c,m,n;

	console.log(checked);
	//console.log(RGBlist);
	console.log(chboxlist);
	for(c=1;c<chboxlist.length;c++){
		if (checked[c]>=1) {
			console.log("checked[%d]=%d",c,checked[c]);
			n=0;
			for(m=1;m<keitaisokaiseki.length;m=m+2){//発言ごとのループ
				//（患者のみ）
				//console.log(hatsugen[m]);
				//iは発言内の何文目か。
				for(i=0;i<keitaisokaiseki[m].length;i++){
					j=0; //集計単位内で何単語目か
					for(j=0;j<keitaisokaiseki[m][i].length;j++){//単語ごとのループ
						if(keitaisokaiseki[m][i][j]==chboxlist[c][0]){
							console.log(chboxlist[c][0]);
							if(checked[c]==1){
								console.log("c=%d,m=%d,n=%d,%s",c,m,n,chboxlist[c][0]);
								RGBlist[n][0]=RGBlist[n][0]+1;
							}else if(checked[c]==2){
								console.log("c=%d,n=%d,%s",c,n,chboxlist[c][0]);
								RGBlist[n][1]=RGBlist[n][1]+1;
							}else if(checked[c]==3){
								console.log("c=%d,n=%d,%s",c,n,chboxlist[c][0]);
								RGBlist[n][2]=RGBlist[n][2]+1;
							}
						}
					}
				}
				n++ //発言ごとにnを回す
			}

		}
	}
	console.log(RGBlist);


	for(m=0;m<keitaisokaiseki.length/2;m++){
		if(RGBlist[m][3]>=1){
			color2[m]="#d4d";
		}else{
			color2[m]="gray";
		}
	}
	console.log(color2);

	for(h=0;h<3;h++){
		stackdataArr[h] = [];
		for(m=0;m<((keitaisokaiseki.length-1)/2);m++){//2個飛ばしにしたら後が面倒くさい。患者 1→0　3→1 長さ9なら番号は8まで
			stackdataArr[h][m]=new Object();
			stackdataArr[h][m]= {x:m+1,y:(28*(RGBlist[m][h])/(keitaisokaiseki[2*m+1].length))};
			console.log(stackdataArr[h][m]);
		}
	}

	viz(stackdataArr,color2);
}

//      radio[i].onchange = () => {};


export {force, svg, color, width, height, setForViz};

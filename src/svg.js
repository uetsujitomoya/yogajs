import d3 from "d3"

var height=200,width=1200;

var viz=(stackdataArr,color2,bun,svg) => {
	console.log("func viz start");

	var stack = d3.layout.stack()
	.x(function(d){return 1;})
	.y(function(d){return d.y;})
	.values(function(d){return d;});
	var stackdata = stack(stackdataArr);
	//var max = d3.max(stackdata[stackdata.length-1], function(d){return d.y + d.y0;});
	var scaleX = d3.scale.linear().domain([0,color2.length]).range([width/(color2.length),width]);
	var scaleY = d3.scale.linear().domain([0,6]).range([0,height]);
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

	var range = d3.range((width)-(width/(color2.length*2)), color2.length-1, -width/(color2.length));
	svg.selectAll("line.v")
	.data(range).enter().append("line")
	.attr("x1", function(d,i){return d;}).attr("y1", 0)
	.attr("x2", function(d,i){return d;}).attr("y2", height);
	svg.selectAll("line")
	.attr("stroke", function(d,i){return color2[color2.length-1-i]})
	.attr("stroke-width", 3)
	.on('mouseover', function(d,i){
		//console.log("%d,%s",2*(color2.length-i-1),bun[2*(color2.length-i-1)]);
		var e = document.getElementById('msg');
		e.innerHTML = bun[-3+2*(color2.length-i-1)]+"<br>"+bun[-2+2*(color2.length-i-1)]+"<br>"+bun[-1+2*(color2.length-i-1)]+"<br><b><u>"+bun[2*(color2.length-i-1)]+"</u></b><br>"+bun[1+2*(color2.length-i-1)]+"<br>"+bun[2+2*(color2.length-i-1)]+"<br>"+bun[3+2*(color2.length-i-1)];
		e.style.color = color2[color2.length-1-i];
	})
};

var funcChecked = (chboxlist,checked) => {
	console.log("funcChecked");
	var c;
	for(c=1;c<chboxlist.length;c++){
		const radio = document.getElementById(c).children;
		for(let i = 1, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				//checked[c-1] = radio[i].control.value;
				if(radio[i].control.value=="1"){
					checked[c-1] =1;
					break;
				}else if(radio[i].control.value=="2"){
					checked[c-1] =2;
					break;
				}else if(radio[i].control.value=="3"){
					checked[c-1] =3;
					break;
				}
			}else{
				checked[c-1] =0;
			}
		}
	}
};

var funcChecked2 = (chboxlist,chboxlist2) => {
	var checked2=[];
	console.log("funcChecked2");
	var c;
	console.log(chboxlist2.length);
	for(c=1;c<=chboxlist2.length;c++){
		console.log("c=%d",c);
		console.log(document.getElementById(c-1+chboxlist.length));
		const radio = document.getElementById(c-1+chboxlist.length).children;
		for(let i = 1, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				if(radio[i].control.value=="3"){
					checked2[c-1] =3;
					break;
				}else if(radio[i].control.value=="5"){
					checked2[c-1] =5;
					break;
				}
			}else{
				checked2[c-1] =4;
			}
		}
	}
	return{checked2:checked2};
};

var setForViz = (keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun) => {

	d3.select("#svgdiv").select("svg").remove();

	var svg = d3.select("#svgdiv").append("svg")
	.attr("height",height)
	.attr("width",width);

	console.log("setForViz");
	var checked = [];
	var color2=[];
	var stackdataArr = [];
	funcChecked(chboxlist,checked);
	var result2 = funcChecked2(chboxlist,chboxlist2);
	console.log(result2);
	var checked2 = result2.checked2;
	console.log(checked2);
	var h,i,j,c,m,n;

	//console.log(RGBlist);

	for(n=0;n<RGBlist.length;n++){
		RGBlist[n][0]=0;
		RGBlist[n][1]=0;
		RGBlist[n][2]=0;
	}

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
								console.log("c=%d,m=%d,n=%d,%s,RGBlist[%d][%d]=%d",c,m,n,chboxlist[c][0],n,checked[c]-1,RGBlist[n][0]);

							}else if(checked[c-1]==2){

								RGBlist[n][1]=RGBlist[n][1]+1;
								console.log("c=%d,m=%d,n=%d,%s,RGBlist[%d][%d]=%d",c,m,n,chboxlist[c][0],n,checked[c]-1,RGBlist[n][1]);

							}else if(checked[c-1]==3){

								RGBlist[n][2]=RGBlist[n][2]+1;
								console.log("c=%d,m=%d,n=%d,%s,RGBlist[%d][%d]=%d",c,m,n,chboxlist[c][0],n,checked[c]-1,RGBlist[n][2]);

							}
						}
					}
				}
				n++
			}

		}
	}
	console.log(RGBlist);//←グラフにすなお


	for(c=0;c<checked2.length;c++){
		if(checked2[c]==3){
			color2[c]="#d4d";
		}else if(checked2[c]==5){
			color2[c]="silver";
		}else{
			color2[c]="dimgray";
		}
	}
	console.log("color2");
	console.log(color2);

	for(h=0;h<3;h++){
		stackdataArr[h] = [];
		for(m=0;m<((keitaisokaiseki.length-1)/2);m++){//2個飛ばしにしたら後が面倒くさい。患者 1→0　3→1 長さ9なら番号は8まで
			stackdataArr[h][m]=new Object();
			stackdataArr[h][m]= {x:m+1,y:(1*(RGBlist[m][h])/(keitaisokaiseki[2*m+1].length))};
			//console.log(stackdataArr[h][m]);
		}
	}

	viz(stackdataArr,color2,bun,svg);
	console.log("chboxlist2");
	console.log(chboxlist2);
}

//      radio[i].onchange = () => {};


export {setForViz};

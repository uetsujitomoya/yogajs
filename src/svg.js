import d3 from "d3"

var height=200,width=1200;

var viz=(stackdataArr,color2,bun,hatsugen,svg,checkedBun) => {
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
	var colorBun=["dimgray","#ff7777","#77ff77","#7777ff"];

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
		var e = document.getElementById('msg');
		var k,l;
		e.innerHTML = "";
		for(k=-3;k<=3;k++){
			if(2*(color2.length-i-1)+k<0||2*(color2.length-i-1)+k>=hatsugen.length){
				console.log("%d,continue",2*(color2.length-i-1)+k);
				continue;
			}
			//ｸﾞｳ期分け
			if(k==0){
				e.innerHTML += "<b><u><font color="+color2[color2.length-1-i]+">"+(1+2*(color2.length-i-1))+" "+hatsugen[2*(color2.length-i-1)]+"</font></u></b><br>";

			}else if(k%2==0){
				e.innerHTML += "<font color="+color2[k/2+color2.length-1-i]+">"+(1+k+2*(color2.length-i-1))+" "+hatsugen[k+2*(color2.length-i-1)]+"</u></b><br>";


			}else{
				for(l=0;l<bun[k+2*(color2.length-i-1)].length;l++){
					e.innerHTML += "<font color="+colorBun[checkedBun[k+2*(color2.length-i-1)][l]]+">"+(1+k+2*(color2.length-i-1))+" "+bun[k+2*(color2.length-i-1)][l]+"</font>";
				}
				e.innerHTML += "<br>";
			}
		}
	})
};

var funcChecked = (chboxlist,checked,taiou,chboxlength) => {
	console.log("funcChecked");
	var c;
	for(c=1;c<=chboxlength;c++){
		//console.log(document.getElementById(c));
		const radio = document.getElementById(c).children;
		console.log("radio");
		console.log(radio);
		console.log("radio.length=%d",radio.length);
		for(let i = 2, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				console.log("radio[%d].control.checked==true",i);
				if(radio[i].control.value=="1"){
					console.log("radio[%d].control.value==1",i);
					checked[taiou[c-1]] =1;
					break;
				}else if(radio[i].control.value=="2"){
					console.log("radio[%d].control.value==2",i);
					checked[taiou[c-1]] =2;
					break;
				}else if(radio[i].control.value=="3"){
					console.log("radio[%d].control.value==3",i);
					checked[taiou[c-1]] =3;
					break;
				}
			}else{
				checked[taiou[c]] =0;
			}
		}
	}
};

var funcChecked2 = (chboxlist,chboxlist2,checked2,taiou,chboxlength,chboxlength2) => {
	//console.log("funcChecked2");
	var c;
	//console.log(chboxlength2);
	for(c=chboxlength+1;c<=chboxlength+chboxlength2;c++){
		//console.log("c=%d",c);
		//console.log(document.getElementById(c-1+chboxlength));
		const radio = document.getElementById(c-1+chboxlength).children;
		//console.log(radio);
		//console.log("radio.length=%d",radio.length);
		for(let i = radio.length-3, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				if(radio[i].control.value=="6"){
					//console.log("radio[%d].control.value==6",i);
					checked2[taiou[c-1]] =6;
					break;
				}else if(radio[i].control.value=="7"){
					//console.log("radio[%d].control.value==7",i);
					checked2[taiou[c-1]] =7;
					break;
				}
			}else{
				checked2[taiou[c-1]] =4;
			}
		}
	}
};

var setForViz = (keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2) => {

	d3.select("#svgdiv").select("svg").remove();

	var svg = d3.select("#svgdiv").append("svg")
	.attr("height",height)
	.attr("width",width);

	console.log("setForViz");
	var color2=[];
	var stackdataArr = [];
	console.log("chboxlength=%d",chboxlength);
	if(chboxlength>=1){
		funcChecked(chboxlist,checked,taiou,chboxlength);
	}
	console.log("checked");
	console.log(checked);
	console.log("chboxlist");
	console.log(chboxlist);
	if(chboxlength2>=1){
		funcChecked2(chboxlist,chboxlist2,checked2,taiou,chboxlength,chboxlength2);
	}
	console.log("checked2");
	console.log(checked2);

	var h,i,j,c,m,n;

	//console.log(RGBlist);

	for(n=0;n<RGBlist.length;n++){
		RGBlist[n][0]=0;
		RGBlist[n][1]=0;
		RGBlist[n][2]=0;
	}

	var checkedBun=[];

	for(c=1;c<chboxlist.length;c++){

		n=0;
		for(m=1;m<keitaisokaiseki.length;m=m+2){
			checkedBun[m]=[];//svgでの描画ではm→i
			for(i=0;i<keitaisokaiseki[m].length;i++){
				//for(j=0;j<keitaisokaiseki[m][i].length;j++){
				checkedBun[m][i]=0;
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
				//}//j=0;j<keitaisokaiseki[m][i].length;j++
			}
			n++
		}
	}
	console.log("checkedBun");
	console.log(checkedBun);
	console.log("RGBlist");
	console.log(RGBlist);//←グラフにすなお


	for(c=0;c<checked2.length;c++){
		if(checked2[c]==3){
			color2[c]="#d4d";
		}else if(checked2[c]==5){
			color2[c]="yellow";
		}else if(checked2[c]==4){
			color2[c]="blue";
		}else if(checked2[c]==6){
			color2[c]="red";
		}else{
			color2[c]="silver";
		}
	}

	var RGBmax=[];
	var RGBmaxmax=1;

	console.log("color2");
	console.log(color2.length);

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
			//console.log(stackdataArr[h][m]);
		}
	}

	console.log("stackdataArr");
	console.log(stackdataArr);
	console.log("color2");
	console.log(color2);
	console.log("checkedBun");
	console.log(checkedBun);
	viz(stackdataArr,color2,bun,hatsugen,svg,checkedBun);
	console.log("chboxlist2");
	console.log(chboxlist2);

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

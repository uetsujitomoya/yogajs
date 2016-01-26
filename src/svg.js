import d3 from "d3"

var height=200,width=1320;

var viz=(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki) => {
	console.log("func viz start");
	var m;
	var bunsuu=2;//前後の余白
	for(m=1;m<hatsugen.length;m=m+2){//患者の発言で間隔を作る
		if(m==hatsugen.length-1){
			bunsuu = bunsuu + hatsugen[m].length/2;
			break;
		}
		bunsuu = bunsuu + hatsugen[m].length;
	}
	//console.log("bunsuu=%d",bunsuu);
	var nagasa=[];//縦棒の位置
	nagasa[0]=1*width/(bunsuu+1);
	for(m=1;m<hatsugen.length;m=m+2){
		nagasa[(m+1)/2]=nagasa[-1 + (m+1)/2]+hatsugen[m].length*width/bunsuu;
	}
	//console.log("nagasa");
	//console.log(nagasa);

	var stack = d3.layout.stack()
	.x(function(d){return 1;})
	.y(function(d){return d.y;})
	.values(function(d){return d;});
	var stackdata = stack(stackdataArr);
	//var max = d3.max(stackdata[stackdata.length-1], function(d){return d.y + d.y0;});
	var scaleX = d3.scale.linear().domain([0,color2.length]).range([width/(color2.length),width]);
	var scaleY = d3.scale.linear().domain([0,6]).range([0,height]);
	var colors = ["#7777ff","#77ff77","#ff7777"];
	var colorBun=["dimgray","deeppink","green","dodgerblue"];

	var area = d3.svg.area()
	.x(function(d,i){return (nagasa[i]+nagasa[i+1])/2})
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
	.attr("x1", function(d,i){
		//console.log("i=%d",i);
		return nagasa[i];
	}).attr("y1", 0)//i=1から始まってる？←そんなことはなかった
	.attr("x2", function(d,i){return nagasa[i];}).attr("y2", height);
	svg.selectAll("line")
	.attr("stroke", function(d,i){return color2[i]})
	.attr("stroke-width", function(d,i){
		//console.log("√keitaisokaiseki[%d].length==%d",2*i,Math.sqrt(keitaisokaiseki[2*i].length));
		return(Math.sqrt(keitaisokaiseki[2*i].length));
	})
	.on('mouseover', function(d,i){
		var e = document.getElementById('msg');
		var k,l;
		e.innerHTML = "";
		for(k=-3;k<=3;k++){
			if(2*(i)+k<0||2*(i)+k>=hatsugen.length){
				//console.log("%d,continue",2*i+k);
				continue;
			}
			if(k==0){
				e.innerHTML += "<b><u><font color="+color2[i]+">"+(1+2*i)+" "+hatsugen[2*i]+"</font></u></b><br>";
			}else if(k%2==0){
				e.innerHTML += "<font color="+color2[k/2+i]+">"+(1+k+2*i)+" "+hatsugen[k+2*i]+"</u></b><br>";
			}else{
				e.innerHTML += (1+k+2*i)+" ";
				for(l=0;l<bun[k+2*i].length;l++){
					e.innerHTML += "<font color="+colorBun[checkedBun[k+2*i][l]]+">"+bun[k+2*i][l]+"</font>";
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
		const radio = document.getElementById("r"+c).children;
		console.log("radio");
		console.log(radio);
		console.log("radio.length=%d",radio.length);
		for(let i = radio.length-3, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
				//console.log("radio[%d].control.checked==true",i);
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
				checked[taiou[c-1]] =0;
			}
		}
	}
};

var funcChecked2 = (chboxlist,chboxlist2,checked2,taiou,chboxlength,chboxlength2) => {
	var c;
	for(c=chboxlength+1;c<=chboxlength+chboxlength2;c++){
		//console.log(document.getElementById("r"+c))
		const radio = document.getElementById("r"+c).children;
		for(let i = radio.length-2, l = radio.length; i < l; i++){
			if(radio[i].control.checked==true){
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
	.attr("height",height)
	.attr("width",width);

	console.log("setForViz");
	var color2=[];
	var stackdataArr = [];
	//console.log("chboxlength=%d",chboxlength);
	if(chboxlength>=1){
		funcChecked(chboxlist,checked,taiou,chboxlength);
	}
	//console.log("checked");
	//console.log(checked);
	//console.log("chboxlist");
	//console.log(chboxlist);
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
						console.log("%d,%d,「%s」は「愛」",m,i,bun[m][i]);
					}else if(checked[c-1]==2){
						RGBlist[n][1]=RGBlist[n][1]+1;
						checkedBun[m][i]=2;
						console.log("%d,%d,「%s」は「交友」",m,i,bun[m][i]);
					}else if(checked[c-1]==3){
						RGBlist[n][2]=RGBlist[n][2]+1;
						checkedBun[m][i]=3;
						console.log("%d,%d,「%s」は「仕事」",m,i,bun[m][i]);
					}
				}
			}//c=1;c<chboxlist.length;c++
		}//i=0;i<keitaisokaiseki[m].length;i++
		n++
	}//m=1;m<keitaisokaiseki.length;m=m+2

	console.log("checkedBun");
	console.log(checkedBun);


	for(c=0;c<checked2.length;c++){
		if(checked2[c]==3){
			color2[c]="#ff3333";
		}else if(checked2[c]==5){
			color2[c]="yellow";
		}else if(checked2[c]==4){
			color2[c]="#3333ff";
		}else if(checked2[c]==6){
			color2[c]="orange";
		}else{
			color2[c]="silver";
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
	console.log("checkedBun");
	console.log(checkedBun);
	viz(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki);
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

//<コンパイル方法>
//yogajsまで移動
//npm run build でコンパイル

import d3 from "d3"
import textures from "textures"

//let love="#ffeeff";
//let friend="#c0ffc0";
//let work="#a0e0ff";

const loveColor="#ffeeff";
const friendColor="#c0ffc0";
const workColor="#a0e0ff";

const textureFunctions = {
	love: textures.paths()
        .d("waves")
        .thicker()
        .stroke(loveColor),
	friend: textures.lines()
        .orientation("3/8")
        .stroke(friendColor),
	work: textures.lines()
        .orientation("vertical", "horizontal")
        .size(4)
        .strokeWidth(1)
        .shapeRendering("crispEdges")
        .stroke(workColor),
    self: textures.paths()
        .d("caps")
        .lighter()
        .thicker()
        .stroke("darkorange"),
    spiritual: textures.paths()
        .d("woven")
        .lighter()
        .thicker()
}


/*
 if(checked2[c]==3){
 color2[c]="#b0291b";
 }else if(checked2[c]==5){
 color2[c]="#9b59b6";
 }else if(checked2[c]==4){
 color2[c]="#2980b9";
 }else if(checked2[c]==6){
 color2[c]="#f1c40f";
 }else{
 color2[c]="#2c3e50";
 }
 */

let vizPart=(talker,task,orijinalSentence)=>{

    let box=(talker,task,orijinalSentence)=>{
        //this.viz=;
    };

    let boxArray=[];

};

let originalSentencePart=(talker,task,orijinalSentence)=>{
    let sentenceViz=(talker,task,orijinalSentence)=>{
        //this.viz=;
    };

    let sentenceVizArray=[];
};

const addTextToSVG=(x,y,text)=>{
    d3.select("svg")
        .append("text")
        .attr({
            x:x,
            y:y
        })
        .text(text);
};

let open3="#b0291b";
let close4="#2980b9";
let aiduchi5="#9b59b6";
let seken7="#2c3e50";
let kaishaku6="#f1c40f";

var height0=200;
var height =200;

var viz=(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki,RGBmaxmax,startTime,graph,checked,ranshin,width,bunsuu) => {

    const upperName = "カウンセラー";
    const lowerName = "クライエント";
    const counselorInTextView = '<img src = "./picture/counselor2.jpg" width ="20">';
    const clientInTextView = '<img src = "./picture/client.jpg" width ="17">';
    const fontSizeInTextView = 2;

    var m;

    var nagasa=[];//縦棒の位置
    nagasa[0]=1*width/(bunsuu+1);
    for(m=1;m<hatsugen.length;m=m+2){
        nagasa[(m+1)/2]=nagasa[-1 + (m+1)/2]+hatsugen[m].length*width/bunsuu;
    }

    var margin2 = {top: 10, right: 10, bottom: 50, left: 40};

    var colorBun=["#c0c0c0",loveColor,friendColor,workColor];

    const axisDescriptionY = 240;

    if(graph==3){

        const axisDescription = "横軸の単位：全ての発言の全ての文字数";

        let graphShiftX = 58;
        let axisShiftX = 68;

        var nagasa2=[];//区分
        var mazekoze=[];//カウンセラーを発言毎に、クライエントを文ごとに収録
        var isAnswerInMazekoze=[];//カウンセラーなら0

        let mazekozeColor=[];
        let mazekozeHatsugenNumber=[];
        let h=0;
        let mazekozeRanshin=[];
        //初手カウンセラー
        nagasa2[0]=hatsugen[0].length*width/bunsuu;
        mazekoze[0]=hatsugen[0];
        isAnswerInMazekoze[0]=0;
        mazekozeColor[0]=color2[0];
        mazekozeHatsugenNumber[0]=0;

        let c=0;

        for(m=1;m<hatsugen.length;m=m+2){
            h++;
            //クライエント
            bun[m].forEach((d)=>{
                if(d!=""){
                    nagasa2[h]=d.length*width/bunsuu;
                    mazekoze[h]=d;
                    isAnswerInMazekoze[h]=1;
                    mazekozeColor[h]=colorBun[checked[c]];
                    mazekozeHatsugenNumber[h]=m;
                    h++;
                    c++;

                }
            });
            if(m+1==hatsugen.length){
                break;
            }
            //カウンセラー
            nagasa2[h]=hatsugen[m+1].length*width/bunsuu;
            mazekoze[h]=hatsugen[m+1];
            isAnswerInMazekoze[h]=0;
            mazekozeColor[h]=color2[(m+1)/2];
            mazekozeHatsugenNumber[h]=m+1;
        }

        console.info("ranshin");
        console.info(ranshin);

        c=0;
        for(let m=1;m<ranshin.length;m=m+2){
            for(let i=0;i<ranshin[m].length;i++){
                mazekozeRanshin[c]="";
                if(ranshin[m][i][0]==1){
                    mazekozeRanshin[c]="病\n";
                }
                if(ranshin[m][i][1]==1){
                    mazekozeRanshin[c]="無気\n";
                }
                if(ranshin[m][i][2]==1){
                    mazekozeRanshin[c]="疑\n";
                }
                if(ranshin[m][i][3]==1){
                    mazekozeRanshin[c]="不注\n";
                }
                if(ranshin[m][i][4]==1){
                    mazekozeRanshin[c]="怠\n";
                }
                if(ranshin[m][i][5]==1){
                    mazekozeRanshin[c]="渇\n";
                }
                if(ranshin[m][i][6]==1){
                    mazekozeRanshin[c]="妄想\n";
                }
                if(ranshin[m][i][7]==1){
                    mazekozeRanshin[c]="新境\n";
                }
                if(ranshin[m][i][8]==1){
                    mazekozeRanshin[c]="落着";
                }
                c++;
            }

            //９種の乱心ストレージ保存

            //mazekozeRanshin[c]="";
            //c++;
        }

        console.info("mazekozeRanshin");
        console.info(mazekozeRanshin);

        //let width = width;

        var dataArr = [
            nagasa2,
            nagasa2
        ];//カウンセラ発言長とクライエント各文長の配列

        var xScale = d3.scale.linear()
            .domain([0, d3.sum(nagasa2)/10])
            .range([axisShiftX, width - axisShiftX]);
        //.nice();

        ////////////////////////////////////////////////////////////////

        var rectDataObjectArray = [];
        var jj;
        var textOnRect = [];
        var jjj=0;

        for (jj=0; jj<nagasa2.length; jj++){//色変えたからか。。
            if(mazekozeColor[jj] == open3){
                textOnRect[jj]='開 質問';
            }else if(mazekozeColor[jj] == aiduchi5){
                textOnRect[jj]="相槌";
            }else if(mazekozeColor[jj] == close4){
                textOnRect[jj]="閉 質問";
            }else if(mazekozeColor[jj] ==kaishaku6){
                textOnRect[jj]='解釈';
            }else if(checked[jjj]==0){
                textOnRect[jj]='未';jjj++;
            }else if(checked[jjj]==1){
                textOnRect[jj]='愛';jjj++;
            }else if(checked[jjj]==2){
                textOnRect[jj]='交友';jjj++;
            }else if(checked[jjj]==3){
                textOnRect[jj]='仕事';jjj++;
            }else{
                textOnRect[jj]='世間話';
            }
        }

        for (jj=0; jj<nagasa2.length; jj++){
            rectDataObjectArray[jj] = {x: nagasa2[jj], y:40, color: mazekozeColor[jj],text:textOnRect[jj],which:isAnswerInMazekoze[jj]};
            //moji[jj]}//F_color2moji(color2[jj])}//, text:a}
        }


        //	console.log(rectDataObjectArray.length);
        //	console.log(nagasa2.length);
        ///////////////////////////////////////////////////////
        console.log("mazekozeHatsugenNumber");
        console.log(mazekozeHatsugenNumber);

        let row=0;//graph3の行番号
        //階層構造をとるため，g要素を生成する部分とrect要素を生成している部分が連続している．
        svg.selectAll("g")
            .data(dataArr)
            .enter()
            .append("g")
            .attr("transform", function(d,i){
                return "translate(0," + (i * 50) + ")";
            })
            .selectAll("rect")
            .data(function(d){return d;})
            .enter()
            .append("rect")//四角追加
            .attr("x",function(d,i){
                var arr = nagasa2;
                //var sum = d3.sum(arr);
                var subSum = d3.sum(i==0 ? []:arr.slice(0,i));
                return xScale(subSum)/10 + 10+graphShiftX;
            })
            .attr("y",10)
            .attr("width",function(d){
                //var sum = d3.sum(nagasa2);
                return xScale(d)/10;
            })
            .attr("height",20)
            .attr("fill", function(d, i){
                if((row==0&& isAnswerInMazekoze[i]==0)||(row==1&&isAnswerInMazekoze[i]==1) ){
                    if(i+1==mazekoze.length){
                        row++;
                    }
                    return mazekozeColor[i];
                }else{
                    if(i+1==mazekoze.length){
                        row++;
                    }
                    return "#f9f9f9";
                }
            })

            .on('mouseover', function(d,i){
                var e = document.getElementById('msg');
                let k,l;
                e.innerHTML = "";
                if(isAnswerInMazekoze[i]==0){    //カウンセラー
                    for(k=-3;k<=3;k++){
                        if(mazekozeHatsugenNumber[i]+k<0||mazekozeHatsugenNumber[i]+k>=hatsugen.length){
                            continue;
                        }
                        if(k==0){
                            e.innerHTML += "<b><u><font size=" + fontSizeInTextView + ">"+(1+mazekozeHatsugenNumber[i])+""+counselorInTextView+" <font color="+color2[mazekozeHatsugenNumber[i]/2]+">【</font>"+hatsugen[mazekozeHatsugenNumber[i]]+"<font color="+color2[mazekozeHatsugenNumber[i]/2]+">】</font></u></b><font size=" + fontSizeInTextView + "><br><br>";
                        }else if(k%2==0){
                            e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+mazekozeHatsugenNumber[i])+""+counselorInTextView+" <font color="+color2[k/2+mazekozeHatsugenNumber[i]/2]+"><b>【</b></font>"+hatsugen[k+mazekozeHatsugenNumber[i]]+"<font color="+color2[k/2+mazekozeHatsugenNumber[i]/2]+"><b>】</b></font><br><br>";
                        }else{//forループを回さないと各文ごとの表示ができない
                            e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+mazekozeHatsugenNumber[i])+""+clientInTextView+" ";
                            for(l=0;l<bun[k+mazekozeHatsugenNumber[i]].length;l++){
                                if(bun[k+mazekozeHatsugenNumber[i]][l]==""){continue;}
                                e.innerHTML += "<font size=" + fontSizeInTextView + "><font color="+colorBun[checkedBun[k+mazekozeHatsugenNumber[i]][l]]+"><b>【</b></font>"+bun[k+mazekozeHatsugenNumber[i]][l]+"<font color="+colorBun[checkedBun[k+mazekozeHatsugenNumber[i]][l]]+"><b>】</b></font>";
                            }
                            e.innerHTML += "<font size=" + fontSizeInTextView + "><br><br>";
                        }
                    }
                }else{  //患者
                    for(k=-3;k<=3;k++){
                        if(mazekozeHatsugenNumber[i]+k<0||mazekozeHatsugenNumber[i]+k>=hatsugen.length){
                            continue;
                        }
                        if(k==0){
                            e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+mazekozeHatsugenNumber[i])+""+clientInTextView+" ";
                            for(l=0;l<bun[k+mazekozeHatsugenNumber[i]].length;l++){
                                if(bun[k+mazekozeHatsugenNumber[i]][l]==""){continue;}
                                e.innerHTML += "<u><font size=" + fontSizeInTextView + "><font color="+colorBun[checkedBun[k+mazekozeHatsugenNumber[i]][l]]+"><b>【</b></font>"+bun[k+mazekozeHatsugenNumber[i]][l]+"<font color="+colorBun[checkedBun[k+mazekozeHatsugenNumber[i]][l]]+"><b>】</b></font></font></u>";
                            }
                            e.innerHTML += "<font size=" + fontSizeInTextView + "><br><br></font>";
                        }else if(k%2==0){
                            e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+mazekozeHatsugenNumber[i])+""+clientInTextView+" ";
                            for(l=0;l<bun[k+mazekozeHatsugenNumber[i]].length;l++){
                                if(bun[k+mazekozeHatsugenNumber[i]][l]==""){continue;}
                                e.innerHTML += "<font size=" + fontSizeInTextView + "><font color="+colorBun[checkedBun[k+mazekozeHatsugenNumber[i]][l]]+"><b>【</b></font>"+bun[k+mazekozeHatsugenNumber[i]][l]+"<font color="+colorBun[checkedBun[k+mazekozeHatsugenNumber[i]][l]]+"><b>】</b></font>";
                            }
                            e.innerHTML += "<font size=" + fontSizeInTextView + "><br><br>";


                        }else{//forループを回さないと各文ごとの表示ができない
                            e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+mazekozeHatsugenNumber[i])+""+counselorInTextView+" <font color="+color2[k/2+mazekozeHatsugenNumber[i]/2]+"><b>【</b></font>"+hatsugen[k+mazekozeHatsugenNumber[i]]+"<font color="+color2[k/2+mazekozeHatsugenNumber[i]/2]+"><b>】</b></font><br><br>";
                        }
                    }
                }
            });
        /////////////////////////////////////////////////////////////////////

        //下側の文字？じゃなかった

		/*
		 svg.selectAll("g")
		 .data(rectDataObjectArray)
		 .enter()
		 .append("g")

		 .selectAll('text')
		 .data(rectDataObjectArray)
		 .enter()
		 .append('text')
		 .text((d)=>d.text)
		 .style("font-size",15)

		 .attr("x",function(d,i){
		 var arr = nagasa2;
		 //var sum = d3.sum(arr);
		 var subSum = d3.sum(i==0 ? []:arr.slice(0,i));
		 return xScale(subSum)/10 + 10+graphShiftX;
		 })
		 .attr(
		 "y",function(d){
		 return 35+d.which*50;
		 }
		 );
		 */

        /////////////////////////////////////////////////////////////////////

		/*　9つの乱心　表示

		 svg.selectAll("g")
		 .data(mazekozeRanshin)
		 .enter()
		 .append("g")
		 .selectAll('text')
		 .data(mazekozeRanshin)
		 .enter()
		 .append('text')
		 .text((d)=>{
		 return d;
		 })
		 .style("font-size",15)

		 .attr("x",function(d,i){
		 var arr = nagasa2;
		 //var sum = d3.sum(arr);
		 var subSum = d3.sum(i==0 ? []:arr.slice(0,i));
		 return xScale(subSum)/11 + graphShiftX;
		 })
		 .attr("y",100);

		 */

        //x軸

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        svg.append("g")
            .attr({
                class: "axis",
                transform: "translate(0, 180)"
            })
            .call(xAxis);

        d3.select("svg")
            .append("text")
            .attr({
                x:0,
                y:20
            })
            .text(upperName);

        d3.select("svg")
            .append("text")
            .attr({
                x:0,
                y:70
            })
            .text(lowerName);

        addTextToSVG(0,axisDescriptionY,axisDescription);

        console.info("rectDataObjectArray");
        console.info(rectDataObjectArray);

    }else{

        //積み重ね折れ線

        const axisDescription = "縦軸の単位：文の数、 横軸の単位：患者の全ての発言の全ての文字数";

        //stack
        var context = svg.append("g") //全体グラフグループ作成
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        var scaleY = d3.scale.linear().domain([0,6]).range([0,height0]);
        var colors = [workColor,friendColor,loveColor];

        var stack = d3.layout.stack()
            .x(function(){return 1;})
            .y(function(d){return d.y;})
            .values(function(d){return d;});
        var stackdata = stack(stackdataArr);

        var area0 = d3.svg.area()
            .x(function(d,i){
                if(i%3==0){return nagasa[i/3];}
                else if(i%3==1){return nagasa[(i-1)/3+1]-3;}
                else{return nagasa[(i-2)/3+1]-2;}

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
            .attr("stroke", function(d,i){
                return color2[i];
            })
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
                        e.innerHTML += "<b><u><font size=" + fontSizeInTextView + ">"+(1+2*i)+""+counselorInTextView+" <font color="+color2[i]+">【</font>"+hatsugen[2*i]+"<font color="+color2[i]+">】</font></font></u></b><font size=" + fontSizeInTextView + "><br><br>";
                    }else if(k%2==0){
                        e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+2*i)+""+counselorInTextView+" <font color="+color2[k/2+i]+"><b>【</b></font>"+hatsugen[k+2*i]+"<font color="+color2[k/2+i]+"><b>】</b></font><br><br>";
                    }else{//forループを回さないと各文ごとの表示ができない
                        e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+2*i)+""+clientInTextView+" ";
                        for(l=0;l<bun[k+2*i].length;l++){
                            if(bun[k+2*i][l]==""){continue;}
                            e.innerHTML += "<font size=" + fontSizeInTextView + "><font color="+colorBun[checkedBun[k+2*i][l]]+"><b>【</b></font>"+bun[k+2*i][l]+"<font color="+colorBun[checkedBun[k+2*i][l]]+"><b>】</b></font></font>";
                        }
                        e.innerHTML += "<font size=" + fontSizeInTextView + "><br><br></font>";
                    }
                }
            });
        /////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////変更部分小林下

        var datae3 = [];
        var jj3;
        var mojia1 = [];

        for (jj3=0; jj3<nagasa.length; jj3++){
            if(color2[jj3] == open3){
                mojia1[jj3]='開 質問';
            }else if(color2[jj3] == aiduchi5){
                mojia1[jj3]="相槌";
            }else if(color2[jj3] == close4){
                mojia1[jj3]="閉 質問";
            }else if(color2[jj3] ==kaishaku6){
                mojia1[jj3]='解釈';
            }else{
                mojia1[jj3]='世間話';
            }
        }

        for (jj3=0; jj3<nagasa.length; jj3++){
            datae3[jj3] = {x: nagasa[jj3], y:10, color: color2[jj3],text:mojia1[jj3]};//moji[jj3]}//F_color2moji(color2[jj3])}//, text:a}
        }
        context.selectAll('circle')
            .data(datae3)
            .enter()
            .append('circle')
            .attr({
                cx: (d) => d.x,
                cy: (d) => d.y,
                r: 13
            })
            .style('fill', (d) => d.color)
            .on('mouseover', function(d,i){
                var e = document.getElementById('msg');
                var k,l;
                e.innerHTML = "";
                for(k=-3;k<=3;k++){
                    if(2*(i)+k<0||2*(i)+k>=hatsugen.length){
                        continue;
                    }
                    if(k==0){
                        e.innerHTML += "<b><u><font size=" + fontSizeInTextView + ">"+(1+2*i)+""+counselorInTextView+" <font color="+color2[i]+">【</font>"+hatsugen[2*i]+"<font color="+color2[i]+">】</font></font></u></b><font size=" + fontSizeInTextView + "><br><br>";
                    }else if(k%2==0){
                        e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+2*i)+""+counselorInTextView+" <font color="+color2[k/2+i]+"><b>【</b></font>"+hatsugen[k+2*i]+"<font color="+color2[k/2+i]+"><b>】</b></font><br><br>";
                    }else{//forループを回さないと各文ごとの表示ができない
                        e.innerHTML += "<font size=" + fontSizeInTextView + ">"+(1+k+2*i)+""+clientInTextView+" ";
                        for(l=0;l<bun[k+2*i].length;l++){
                            if(bun[k+2*i][l]==""){continue;}
                            e.innerHTML += "<font size=" + fontSizeInTextView + "><font color="+colorBun[checkedBun[k+2*i][l]]+"><b>【</b></font>"+bun[k+2*i][l]+"<font color="+colorBun[checkedBun[k+2*i][l]]+"><b>】</b></font></font><br>   ";
                        }
                        e.innerHTML += "<font size=" + fontSizeInTextView + "><br><br></font>";
                    }
                }
            });

		/*
		 context.selectAll('text')
		 .data(datae3)
		 .enter()
		 .append('text')
		 .text((d)=> d.text)
		 .style("font-size",12)
		 .attr({
		 x: (d) => d.x+3,
		 y: (d) => d.y+25,
		 fill: (d) => d.color
		 });
		 */

        ////////*////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////
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

        addTextToSVG(0,axisDescriptionY,axisDescription);
    }
};

var funcChecked = (jsonFileName,storage,chboxlist,checked,taiou,chboxlength,isUsingDictionaryWithWord2Vec) => {

    let graphNumber =2;

    var c;
    for(c=1;c<=chboxlength;c++){
        let changedAnswerClassificationSaveTarget;

        if(isUsingDictionaryWithWord2Vec==1){
            changedAnswerClassificationSaveTarget = jsonFileName+"AnswerWithNewDictionary"+c;
            //今後辞書名に対応
        }else{
            changedAnswerClassificationSaveTarget = jsonFileName+"RGB"+c;
        }

        const radio = document.getElementById("r"+c).children;
        for(let i = radio.length-3, l = radio.length; i < l; i++){
            //console.log("i=%d",i);
            //console.log(radio[i]);
            if(radio[i].control.checked==true){
                if(radio[i].control.value=="1"){
                    checked[taiou[c-1]] =1;
                    storage.setItem(changedAnswerClassificationSaveTarget, 0);
                    break;
                }else if(radio[i].control.value=="2"){
                    checked[taiou[c-1]] =2;
                    storage.setItem(changedAnswerClassificationSaveTarget, 1);
                    break;
                }else if(radio[i].control.value=="3"){
                    checked[taiou[c-1]] =3;
                    storage.setItem(changedAnswerClassificationSaveTarget, 2);
                    break;
                }
            }else{
                checked[taiou[c-1]] =0;
                storage.setItem(changedAnswerClassificationSaveTarget, 9);//未分類
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
                    break;
                }
                if(radio[i].control.value=="4"){
                    checked2[c-1] =4;
                    storage.setItem(name+"RGBlist"+c, 4);
                    break;
                }
                if(radio[i].control.value=="5"){
                    checked2[c-1] =5;
                    storage.setItem(name+"RGBlist"+c, 5);
                    break;
                }
                if(radio[i].control.value=="6"){
                    checked2[c-1] =6;
                    storage.setItem(name+"RGBlist"+c, 6);
                    break;
                }
            }else{
                checked2[c-1] =7;
                storage.setItem(name+"RGBlist"+c, 7);
            }
        }
        if(checked2[c-1]==7){
            black++;
        }
    }
};

var setForViz = (name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value) => {

    let isUsingDictionaryWithWord2Vec = 0;

    var bunsuu=2;//前後の余白
    for(m=1;m<hatsugen.length;m=m+2){//患者の発言で間隔を作る
        bunsuu = bunsuu + hatsugen[m].length;
    }
    console.info(zoom_value);
    var width=zoom_value*bunsuu;

    console.log("%centerred setForViz",'color:red');

    let graphNumber=2;

    d3.select("#svgdiv").select("svg").remove();
    var svg = d3.select("#svgdiv").append("svg")
        .attr("height",270)

        .attr("width",width);
    var color2=[];
    var stackdataArr = [];
    if(chboxlength>=1){
        funcChecked(name,storage,chboxlist,checked,taiou,chboxlength,isUsingDictionaryWithWord2Vec);
    }
    if(chboxlength2>=1){
        funcChecked2(name,storage,chboxlist,chboxlist2,checked2,taiou,taiou2,chboxlength,chboxlength2);
    }

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
            color2[c]=open3;
        }else if(checked2[c]==5){
            color2[c]=aiduchi5;
        }else if(checked2[c]==4){
            color2[c]=close4;
        }else if(checked2[c]==6){
            color2[c]=kaishaku6;
        }else{
            color2[c]=seken7;
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
    console.log("radio");
    console.log(radio);
    for(let i=0;i<=graphNumber-1;i++){
        console.log("i=%d",i);
        console.log(radio[i]);
        if(radio[i].control.checked==true){
            //storage.getItem(name+"RGBlist"+m)=
			/*if(radio[i].control.value=="12"){
			 graph=2;
			 }else */if(radio[i].control.value=="13"){
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
    viz(stackdataArr,color2,bun,hatsugen,svg,checkedBun,keitaisokaiseki,RGBmaxmax,startTime,graph,checked,ranshin,width,bunsuu);
    //console.log("chboxlength2 in svg.js=%d",chboxlength2);
    return{
        chboxlist:chboxlist,
        chboxlist2:chboxlist2,
        RGBlist:RGBlist,
        checked:checked,
        checked2:checked2,
        chboxlength:chboxlength,
        chboxlength2:chboxlength2,
        ranshin:ranshin
    };
};

const createCircleWithTexture = () => {//example
    var svg = d3.select("#example")
        .append("svg");

    var t = textures.lines()
        .thicker();

    svg.call(t);

    svg.append("circle")
        .style("fill", t.url());
}

export {setForViz};

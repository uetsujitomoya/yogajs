import "kuromoji";
import $ from 'jquery';
import {select} from "../select.js";
import {setForViz} from "../svg.js";
import slider from "bootstrap-slider";

let zoom_value = 3;

let insertStr=(str, index, insert)=>{
    return str.slice(0, index) + insert + str.slice(index, str.length);
}

let readJson = (originalText,event,jsonName) => {
    let signal = "blue";

    switch (signal) {
        case "red":
            readJsonAutomatically(jsonName,originalText);
            break;
		/*
		 case "green":
		 case "blue":
		 console.log("go!");
		 break;
		 case "yellow":
		 console.log("slow down!");
		 break;*/
        default:
            readJsonManually(originalText,event);
            break;
    }
};

let readJsonAutomatically=(jsonName,originalText)=>{
    $.getJSON("./json/"+jsonName+".json" , function(data) {
        originalText=data[0].a;
    });
};

let readJsonManually=(originalText,event)=>{
	console.log(event);
    originalText = JSON.parse(event.target.result);
};


var makeOnClick = (c) =>{
	document.getElementById("b"+c).onclick = () => {
		const id = "r"+c;
		document.getElementById(id).classList.toggle("hide");
	};
};
var makeOnClickS = (c) =>{
	document.getElementById("bs"+c).onclick = () => {
		const id = "rs"+c;
		document.getElementById(id).classList.toggle("hide");
	};
};

let selectGraphShape = function(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,vResult,object_imported_into_setForViz) {
    console.log("%centerred selectGraphShape",'color:red');

    document.getElementById('GraphSelectButton').onclick = () => {
		 console.log("GraphSelectButton_onchange");
        setForViz(name,storage,object_imported_into_setForViz.wordArrayInASentence,chboxlist,chboxlist2,RGBlist,object_imported_into_setForViz.hatsugenArray,object_imported_into_setForViz.contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,object_imported_into_setForViz.zoom_value);

    };//graphの形状を切り替えた際もここで再描画される
};

var ClassifyWithFirstWordDictionary = (name,wordArrayInASentence,checkboxlist,chboxlist,chboxlist2,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,originalText) => {

	let jsonName = "160803dummy";
	var startTime = new Date();
	console.log(startTime);


	var h,sentenceCntInHatsugen,wordCntInASentence,k,hatsugenCnt,wordsCntAfterMorphologicalAnalysis,c,x,y,z;
	var hinshi = [];
	var answerSentenceCategory = [];
	let ranshin = [];
	var tangoset = new Set();
	var tangosett = [];
	var miserables={"nodes":[],"links":[]};

	checkboxlist=[];
	contentArrayOfASentence=[];

	//var data = JSON.parse(event.target.result);
	/*
	$.getJSON("./json/"+jsonName+".json" , function(data) {
    	orijinalText=data[0].a;
	});
	*/

	//readJson(originalText,event,jsonName);

    console.log("%c enter kuromoji 91",'color:red');
	return kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {

		let zoom_value=3

        let visResult;
        console.log("%c entered kuromoji 95",'color:red');
        console.log(originalText);
        const wordsArrayAfterMorphologicalAnalysis = tokenizer.tokenize(originalText);

       wordsCntAfterMorphologicalAnalysis=0;

		var wordsQtyInASentence=0;
		hatsugenCnt=0;
		var kanjamoji=0;
		var kanjatango=0;
		var kanjabun=0;
		var serapimoji=0;
		var serapitango=0;
		var serapibun=0;
		var soudesuka=0;
		while(wordsCntAfterMorphologicalAnalysis<wordsArrayAfterMorphologicalAnalysis.length){
			wordArrayInASentence[hatsugenCnt] = [];
			contentArrayOfASentence[hatsugenCnt] = [];
			hatsugenArray[hatsugenCnt] = "";
			hinshi[hatsugenCnt] = [];
			answerSentenceCategory[hatsugenCnt] = [];
			ranshin[hatsugenCnt] = [];
			if(hatsugenCnt%2==0){
				RGBlist[hatsugenCnt/2] = [0,0,0,0,0,0,0,0];
			}
			sentenceCntInHatsugen=0;
			wordsQtyInASentence=0;
			while(wordsCntAfterMorphologicalAnalysis<wordsArrayAfterMorphologicalAnalysis.length){
				wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen] = [];
				contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]="";
				hinshi[hatsugenCnt][sentenceCntInHatsugen]=[];
				wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen].length = 0;
				answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen] = [0,0,0];
				ranshin[hatsugenCnt][sentenceCntInHatsugen]=[0,0,0,0,0,0,0,0,0];
				wordCntInASentence=0;
				while(wordsCntAfterMorphologicalAnalysis<wordsArrayAfterMorphologicalAnalysis.length){
					wordsQtyInASentence++;

					if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="。"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="？"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="?"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="："||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form==":"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].word_id=="2613630"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="･･･？："||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form==")："
					||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="…"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="……"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="・・・"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="･･･"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form.indexOf('〈') != -1||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form.indexOf('〉') != -1){
						break;
					}
					if(hatsugenCnt%2==1){
						kanjatango++;
						kanjamoji=kanjamoji+wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form.length;
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="母"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="主人"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="父さん"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="ご主人"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="お父さん"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="姉"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="姉さん"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="母親"
						||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="お姉さん"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="父"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="家族"){
							answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen][0]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="兄"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="子"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="子ども"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="妹"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="弟"){
							answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen][0]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="両親"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="お母様"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="お父様"){
							answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen][0]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="仕事"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="休み"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="アルバイト"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="働く"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="同僚"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="職場"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="上司"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="部下"){
							answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen][2]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="友人"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="親友"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="友達"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="友"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="交友"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="友好"){
							answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen][1]=1;
						}

						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="病"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="病気"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="ストレス"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="不調"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="過食"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="嘔吐"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="過食嘔吐"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][0]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="無気力"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="気力"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="やる気"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][1]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="疑い"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="疑う"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="疑心暗鬼"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="疑心"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][2]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="注意"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="不注意"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="注意散漫"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="無自覚"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="自覚"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][3]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="引き延ばし"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="引き延ばす"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="怠慢"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="怠惰"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][4]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="渇望"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="切望"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="欲しい"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][5]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="妄想"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="空想"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="想い"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="ふける"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][6]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="抜け出す"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="打破"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="勝つ"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="戦う"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][7]=1;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="不安定"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="安定"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="落ち着く"){
							ranshin[hatsugenCnt][sentenceCntInHatsugen][8]=1;
						}
					}else if(hatsugenCnt%2==0){
						serapitango++;
						serapimoji=serapimoji+wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form.length;
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="そう"&&wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis+1].surface_form=="です"&&wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis+2].surface_form=="か"){
							soudesuka++;
						}
						if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="何"&&wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis+1].surface_form=="か"){

						}else if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="いかが"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="なんで"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どうして"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どの"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どのように"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="いつ"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どういう"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どなた"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どう"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="何"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="誰"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どんな"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どのような"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="どこ"){
							RGBlist[hatsugenCnt/2][3]=1;
						}else if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="か"&&wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos=="助詞"){
							RGBlist[hatsugenCnt/2][4]=1;
						}else if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="ね"&&wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos=="助詞"){
							RGBlist[hatsugenCnt/2][6]=1;
						}
					}
					contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen] += wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form;
					if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos_detail_1=="接尾"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="*"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos=="助詞"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="、"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos=="記号"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos=="助動詞"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos=="感動詞"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos=="接頭詞"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos_detail_1=="非自立"
					||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="する"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="いる"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="こういう"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="そういう"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="こう"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="する"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="こうした"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="いう"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="する"
					||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="なる"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="その"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="あの"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].pos_detail_1=="数"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="そう"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="気持ち"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="思い"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="思う"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="ある"){
						wordsCntAfterMorphologicalAnalysis++;
						continue;
					}
					wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen][wordCntInASentence] = wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form;
					wordsCntAfterMorphologicalAnalysis++;
					wordCntInASentence++;
				}
				if(hatsugenCnt%2==1){
					kanjabun++;
				}else{
					serapibun++;
				}
				if(contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]=="Ａ"||contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]=="Ｂ"||contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]=="Ｔ"||contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]=="A"||contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]=="B"||contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]=="T"){
					contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]="";
					continue;
				}
				if(contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]!="Ａ"&&contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]!="Ｂ"&&contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]!="Ｔ"&&contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]!="A"&&contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]!="B"&&contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]!="T"&&contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen]!=""){
					hatsugenArray[hatsugenCnt] += contentArrayOfASentence[hatsugenCnt][sentenceCntInHatsugen];
					hatsugenArray[hatsugenCnt] += "。";
				}
				if(wordsCntAfterMorphologicalAnalysis==wordsArrayAfterMorphologicalAnalysis.length){
					if(hatsugenCnt%2==0 ){
						if( sentenceCntInHatsugen<=2 && wordsQtyInASentence<=7){
							RGBlist[hatsugenCnt/2][5]=1;
						}
					}
					break;
				}
				if(wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].word_id=="2613630"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form=="："||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].basic_form==":"||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form=="･･･？："||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form==")："||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form.indexOf('〈') != -1||wordsArrayAfterMorphologicalAnalysis[wordsCntAfterMorphologicalAnalysis].surface_form.indexOf('〉') != -1){
					if(hatsugenCnt%2==0 ){
						if( sentenceCntInHatsugen<=2 && wordsQtyInASentence<=7){
							RGBlist[hatsugenCnt/2][5]=1;
						}
					}
					wordsCntAfterMorphologicalAnalysis++;

					//n++;

					break;
				}
				wordsCntAfterMorphologicalAnalysis++;
				sentenceCntInHatsugen++;
			}
			hatsugenCnt++;
		}
		//console.log("%d 来談者文 %d 単語 %d 文字 %d 治療者文 %d 単語 %d 文字 %d",m,kanjabun,kanjatango,kanjamoji,serapibun,serapitango,serapimoji);
		//console.log("そうですか %d",soudesuka);
		//var uetsuji="うえつじともや";
		//console.log(uetsuji.length);

		var tango=[];
		x=0;
		for(hatsugenCnt=0;hatsugenCnt<wordArrayInASentence.length;++hatsugenCnt){
			for(sentenceCntInHatsugen=0;sentenceCntInHatsugen<wordArrayInASentence[hatsugenCnt].length;++sentenceCntInHatsugen){
				for(wordCntInASentence=0;wordCntInASentence<wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen].length;++wordCntInASentence){
					tango[x]=wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen][wordCntInASentence];
					x++;
				}
			}
		}
		x=0;
		for(hatsugenCnt=0;hatsugenCnt<wordArrayInASentence.length;++hatsugenCnt){
			for(sentenceCntInHatsugen=0;sentenceCntInHatsugen<wordArrayInASentence[hatsugenCnt].length;++sentenceCntInHatsugen){
				for(wordCntInASentence=0;wordCntInASentence<wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen].length;++wordCntInASentence){
					y=0;
					if(x>0){
						for(z=0;z<x;z++){
							if(tango[z]==wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen][wordCntInASentence]){
								y=1;
								break;
							}
						}
					}
					x++;
					if(y==1){
						continue;//次のjへ
					}
					tangoset.add(wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen][wordCntInASentence]);//tangoset終了
				}
			}
		}
		tangosett = Array.from(tangoset).map(function(t) {return {t};});

		for(sentenceCntInHatsugen=0;sentenceCntInHatsugen<tangosett.length;sentenceCntInHatsugen++){
			miserables.nodes[sentenceCntInHatsugen]=tangosett[sentenceCntInHatsugen].t;
		}
		var RGBk=[];
		for(h=0;h<=2;h++){
			RGBk[h]=[];
			for(k=0;k<miserables.nodes.length;k++){
				RGBk[h][k]=0;
				for(hatsugenCnt=1;hatsugenCnt<wordArrayInASentence.length;hatsugenCnt=hatsugenCnt+2){
					for(sentenceCntInHatsugen=0;sentenceCntInHatsugen<wordArrayInASentence[hatsugenCnt].length;sentenceCntInHatsugen++){
						if(answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen][h]==1){
							for(wordCntInASentence=0;wordCntInASentence<wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen].length;wordCntInASentence++){
								if(miserables.nodes[k]==wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen][wordCntInASentence]){
									RGBk[h][k]=1;
									break;
								}
							}
						}
						if(RGBk[h][k]==1){
							break;
						}
					}
					if(RGBk[h][k]==1){
						break;
					}
				}
			}
		}

		for(h=0;h<=2;h++){
			for(k=0;k<miserables.nodes.length;k++){
				if(RGBk[h][k]==1){
					for(hatsugenCnt=1;hatsugenCnt<wordArrayInASentence.length;hatsugenCnt=hatsugenCnt+2){
						for(sentenceCntInHatsugen=0;sentenceCntInHatsugen<wordArrayInASentence[hatsugenCnt].length;sentenceCntInHatsugen++){
							if(answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen][h]==0){
								for(wordCntInASentence=0;wordCntInASentence<wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen].length;wordCntInASentence++){
									if(miserables.nodes[k]==wordArrayInASentence[hatsugenCnt][sentenceCntInHatsugen][wordCntInASentence]){
										answerSentenceCategory[hatsugenCnt][sentenceCntInHatsugen][h]=1;
										break;
									}
								}
							}
						}
					}
				}
			}
		}

		var storage = localStorage;//初回読み込み

		var graph;

		var sResult = select(name,storage,checkboxlist,wordArrayInASentence,miserables,chboxlist,chboxlist2,answerSentenceCategory,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);

		checkboxlist = sResult.checkboxlist;
		chboxlist = sResult.chboxlist;
		chboxlist2 = sResult.chboxlist2;
		answerSentenceCategory = sResult.RGB;
		RGBlist = sResult.RGBlist;
		checked = sResult.checked;
		checked2 = sResult.checked2;
		taiou = sResult.taiou;
		taiou2 = sResult.taiou2;
		chboxlength = sResult.chboxlength;
		chboxlength2 = sResult.chboxlength2;
		var answerNumbermax = sResult.answerNumbermax;
		var questionNumbermax = sResult.questionNumbermax;

		//graph = sResult.graph;
		//console.log("chboxlength2=%d",chboxlength2)

		let object_imported_into_setForViz = {
            name:name,
			storage:storage,
			wordArrayInASentence:wordArrayInASentence,
			chboxlist:chboxlist,
			chboxlist2:chboxlist2,
			RGBlist:RGBlist,
			hatsugenArray:hatsugenArray,
			contentArrayOfASentence:contentArrayOfASentence,
			checked:checked,
			checked2:checked2,
			taiou:taiou,
			taiou2:taiou2,
			chboxlength:chboxlength,
			chboxlength2:chboxlength2,
			startTime:startTime,
			graph:graph,
			ranshin:ranshin,
			zoom_value:zoom_value
		}

        setForViz(name,storage,wordArrayInASentence,chboxlist,chboxlist2,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);

		//以下は後ろじゃなきゃアカン
		for(c=1;c<=chboxlength;c++){
			makeOnClick(c);
		}
		for(c=1;c<=chboxlength2;c++){
			makeOnClickS(c);
		}

        selectGraphShape(name,storage,wordArrayInASentence,chboxlist,chboxlist2,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,visResult,object_imported_into_setForViz);

		//graphの形状を切り替えた際もここで再描画される

		document.getElementById('radio_buttons').onchange = () => {
            setForViz(name,storage,wordArrayInASentence,chboxlist,chboxlist2,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);
		};

		//graphのラジオボタン変わったらまた描画
/*
		document.getElementById('zoom').addEventListener('click',function(){
            setForViz(name,storage,wordArrayInASentence,chboxlist,chboxlist2,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);
		});*/

	    //スライダー
		$("#slider1").slider();
		$("#slider1").on("slide", function(slideEvt) {
		    $("#SliderVal").text(slideEvt.value);
		    zoom_value = slideEvt.value;
		    setForViz(name,storage,wordArrayInASentence,chboxlist,chboxlist2,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);
		});

		/*

		//for talker change button

        for(let answerNumber = 1 ; answerNumber <= answerNumbermax ; answerNumber++){
            console.info(answerNumber);
            document.getElementById("change_answer" + answerNumber).addEventListener('click',function(){
                setForViz(name,storage,wordArrayInASentence,chboxlist,chboxlist2,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);
            });
        }

        for(let questionNumber = 1 ; questionNumber <= questionNumbermax ; questionNumber++){
            document.getElementById("change_question" + questionNumber).addEventListener('click',function(){
                setForViz(name,storage,wordArrayInASentence,chboxlist,chboxlist2,RGBlist,hatsugenArray,contentArrayOfASentence,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);
            });
        }
        */

		return{
			name:name,RGBlist:RGBlist,keitaisokaiseki:wordArrayInASentence,hatsugen:hatsugenArray,bun:contentArrayOfASentence,chboxlist:chboxlist,chboxlist2:chboxlist2,checked:checked,checked2:checked2,taiou:taiou,taiou2:taiou2,chboxlength:chboxlength,chboxlength2:chboxlength2
		};
	});
};

/*
let getVizResult=(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,visResult)=>{
   
    //let zoom_value = document.getElementById("zoom_value").value;
    console.log(zoom_value);

    visResult = setForViz(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin,zoom_value);//形態素解析後に1度目の描画
    chboxlist = visResult.chboxlist;
    chboxlist2 = visResult.chboxlist2;
    RGBlist = visResult.RGBlist;
    checked = visResult.checked;
    checked2 = visResult.checked2;
    chboxlength = visResult.chboxlength;
    chboxlength2 = visResult.chboxlength2;
    chboxlength2 = visResult.ranshin;
};*/


export {ClassifyWithFirstWordDictionary};

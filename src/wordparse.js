import "kuromoji";
import {select} from "./select.js";
import {setForViz} from "./svg.js";
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
var funcReaderOnload = (name,event,keitaisokaiseki,checkboxlist,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2) => {



	console.log(startTime);


	var taskGroupNumber,sentenceNumberInHatsugen,wordNumberInSentence,wordsNumberWithMorphologicalAnalysis,hatsugenNumber,n,c,x,y,z;
	var hinshi = [];
	var isInTheTaskGroup = [];

	let ranshin = [];
	var wordsSetWithoutOverlap = new Set();
	var wordsArrayWithoutOverlap = [];
	var miserables={"nodes":[],"links":[]};

	checkboxlist=[];
	bun=[];

	var data = JSON.parse(event.target.result);

//ここでKNP(XML)の処理を開始

//辞書の読込

//連結

	return kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
        console.log("wordparse");
		const path = tokenizer.tokenize(data[0].a);
		n=0;
		var tangosuu=0;
		hatsugenNumber=0;
		var kanjamoji=0;
		var kanjatango=0;
		var kanjabun=0;
		var serapimoji=0;
		var serapitango=0;
		var serapibun=0;
		var soudesuka=0;

		//下の段階すっとばして例の辞書使う

		while(n<path.length){
			keitaisokaiseki[hatsugenNumber] = [];
			bun[hatsugenNumber] = [];
			hatsugen[hatsugenNumber] = "";
			hinshi[hatsugenNumber] = [];
			isInTheTaskGroup[hatsugenNumber] = [];
			ranshin[hatsugenNumber] = [];
			if(hatsugenNumber%2==0){
				RGBlist[hatsugenNumber/2] = [0,0,0,0,0,0,0,0];
			}
			sentenceNumberInHatsugen=0;
			tangosuu=0;
			while(n<path.length){
				keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen] = [];
				bun[hatsugenNumber][sentenceNumberInHatsugen]="";
				hinshi[hatsugenNumber][sentenceNumberInHatsugen]=[];
				keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen].length = 0;
				isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen] = [0,0,0];
				ranshin[hatsugenNumber][sentenceNumberInHatsugen]=[0,0,0,0,0,0,0,0,0];
				wordNumberInSentence=0;
				while(n<path.length){
					tangosuu++;

					if(path[n].basic_form=="。"||path[n].basic_form=="？"||path[n].basic_form=="?"||path[n].basic_form=="："||path[n].basic_form==":"||path[n].word_id=="2613630"||path[n].surface_form=="･･･？："||path[n].surface_form==")："
					||path[n].surface_form=="…"||path[n].surface_form=="……"||path[n].surface_form=="・・・"||path[n].surface_form=="･･･"||path[n].surface_form.indexOf('〈') != -1||path[n].surface_form.indexOf('〉') != -1){
						break;
					}
					bun[hatsugenNumber][sentenceNumberInHatsugen] += path[n].surface_form;
					if(hatsugenNumber%2==1){
						kanjatango++;
						kanjamoji=kanjamoji+path[n].surface_form.length;
						if(path[n].basic_form=="母"||path[n].basic_form=="主人"||path[n].basic_form=="父さん"||path[n].basic_form=="ご主人"||path[n].basic_form=="お父さん"||path[n].basic_form=="姉"||path[n].basic_form=="姉さん"||path[n].basic_form=="母親"
						||path[n].basic_form=="お姉さん"||path[n].basic_form=="父"||path[n].basic_form=="家族"){
							isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen][0]=1;
						}
						if(path[n].basic_form=="兄"||path[n].basic_form=="子"||path[n].basic_form=="子ども"||path[n].basic_form=="妹"||path[n].basic_form=="弟"){
							isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen][0]=1;
						}
						if(path[n].basic_form=="両親"||path[n].basic_form=="お母様"||path[n].basic_form=="お父様"){
							isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen][0]=1;
						}
						if(path[n].basic_form=="仕事"||path[n].basic_form=="休み"||path[n].basic_form=="アルバイト"||path[n].basic_form=="働く"||path[n].basic_form=="同僚"||path[n].basic_form=="職場"||path[n].basic_form=="上司"||path[n].basic_form=="部下"){
							isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen][2]=1;
						}
						if(path[n].basic_form=="友人"||path[n].basic_form=="親友"||path[n].basic_form=="友達"||path[n].basic_form=="友"||path[n].basic_form=="交友"||path[n].basic_form=="友好"){
							isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen][1]=1;
						}

						if(path[n].basic_form=="病"||path[n].basic_form=="病気"||path[n].basic_form=="ストレス"||path[n].basic_form=="不調"||path[n].basic_form=="過食"||path[n].basic_form=="嘔吐"||path[n].basic_form=="過食嘔吐"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][0]=1;
							console.info("病気,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
						if(path[n].basic_form=="無気力"||path[n].basic_form=="気力"||path[n].basic_form=="やる気"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][1]=1;
							console.info("無気力,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
						if(path[n].basic_form=="疑い"||path[n].basic_form=="疑う"||path[n].basic_form=="疑心暗鬼"||path[n].basic_form=="疑心"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][2]=1;
							console.info("疑い,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
						if(path[n].basic_form=="注意"||path[n].basic_form=="不注意"||path[n].basic_form=="注意散漫"||path[n].basic_form=="無自覚"||path[n].basic_form=="自覚"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][3]=1;
							console.info("不注意,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
						if(path[n].basic_form=="引き延ばし"||path[n].basic_form=="引き延ばす"||path[n].basic_form=="怠慢"||path[n].basic_form=="怠惰"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][4]=1;
							console.info("怠慢,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
						if(path[n].basic_form=="渇望"||path[n].basic_form=="切望"||path[n].basic_form=="欲しい"||path[n].basic_form=="ほしい"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][5]=1;
							console.info("渇望,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
						if(path[n].basic_form=="妄想"||path[n].basic_form=="空想"||path[n].basic_form=="想い"||path[n].basic_form=="ふける"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][6]=1;
							console.info("妄想,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
						if(path[n].basic_form=="抜け出す"||path[n].basic_form=="打破"||path[n].basic_form=="勝つ"||path[n].basic_form=="戦う"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][7]=1;
							console.info("新しい境地を見いだせぬこと,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
						if(path[n].basic_form=="不安定"||path[n].basic_form=="安定"||path[n].basic_form=="落ち着く"){
							ranshin[hatsugenNumber][sentenceNumberInHatsugen][8]=1;
							console.info("心の不安定さ,%d,%d,%s",hatsugenNumber,sentenceNumberInHatsugen,bun[hatsugenNumber][sentenceNumberInHatsugen]);
						}
					}else if(hatsugenNumber%2==0){
						serapitango++;
						serapimoji=serapimoji+path[n].surface_form.length;
						if(path[n].surface_form=="そう"&&path[n+1].surface_form=="です"&&path[n+2].surface_form=="か"){
							soudesuka++;
						}
						if(path[n].surface_form=="何"&&path[n+1].surface_form=="か"){

						}else if(path[n].basic_form=="いかが"||path[n].basic_form=="なんで"||path[n].basic_form=="どうして"||path[n].basic_form=="どの"||path[n].basic_form=="どのように"||path[n].basic_form=="いつ"||path[n].basic_form=="どういう"||path[n].basic_form=="どなた"||path[n].basic_form=="どう"||path[n].surface_form=="何"||path[n].basic_form=="誰"||path[n].basic_form=="どんな"||path[n].basic_form=="どのような"||path[n].basic_form=="どこ"){
							RGBlist[hatsugenNumber/2][3]=1;
						}else if(path[n].surface_form=="か"&&path[n].pos=="助詞"){
							RGBlist[hatsugenNumber/2][4]=1;
						}else if(path[n].surface_form=="ね"&&path[n].pos=="助詞"){
							RGBlist[hatsugenNumber/2][6]=1;
						}
					}

					if(path[n].pos_detail_1=="接尾"||path[n].basic_form=="*"||path[n].pos=="助詞"||path[n].basic_form=="、"||path[n].pos=="記号"||path[n].pos=="助動詞"||path[n].pos=="感動詞"||path[n].pos=="接頭詞"||path[n].pos_detail_1=="非自立"
					||path[n].basic_form=="する"||path[n].basic_form=="いる"||path[n].basic_form=="こういう"||path[n].basic_form=="そういう"||path[n].basic_form=="こう"||path[n].basic_form=="する"||path[n].basic_form=="こうした"||path[n].basic_form=="いう"||path[n].basic_form=="する"
					||path[n].basic_form=="なる"||path[n].basic_form=="その"||path[n].basic_form=="あの"||path[n].pos_detail_1=="数"||path[n].basic_form=="そう"||path[n].basic_form=="気持ち"||path[n].basic_form=="思い"||path[n].basic_form=="思う"||path[n].basic_form=="ある"){
						n++;
						continue;
					}
					keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen][wordNumberInSentence] = path[n].basic_form;
					n++;
					wordNumberInSentence++;
				}
				if(hatsugenNumber%2==1){
					kanjabun++;
				}else{
					serapibun++;
				}
				if(bun[hatsugenNumber][sentenceNumberInHatsugen]=="Ａ"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="Ｂ"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="Ｔ"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="A"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="B"||bun[hatsugenNumber][sentenceNumberInHatsugen]=="T"){
					bun[hatsugenNumber][sentenceNumberInHatsugen]="";
					continue;
				}
				if(bun[hatsugenNumber][sentenceNumberInHatsugen]!="Ａ"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="Ｂ"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="Ｔ"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="A"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="B"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!="T"&&bun[hatsugenNumber][sentenceNumberInHatsugen]!=""){
					hatsugen[hatsugenNumber] += bun[hatsugenNumber][sentenceNumberInHatsugen];
					hatsugen[hatsugenNumber] += "。";
				}
				if(n==path.length){
					if(hatsugenNumber%2==0 ){
						if( sentenceNumberInHatsugen<=2 && tangosuu<=7){
							RGBlist[hatsugenNumber/2][5]=1;
						}
					}
					break;
				}
				if(path[n].word_id=="2613630"||path[n].basic_form=="："||path[n].basic_form==":"||path[n].surface_form=="･･･？："||path[n].surface_form==")："||path[n].surface_form.indexOf('〈') != -1||path[n].surface_form.indexOf('〉') != -1){
					if(hatsugenNumber%2==0 ){
						if( sentenceNumberInHatsugen<=2 && tangosuu<=7){
							RGBlist[hatsugenNumber/2][5]=1;
						}
					}
					n++;
					break;
				}
				n++;
				sentenceNumberInHatsugen++;
			}
			hatsugenNumber++;
		}
		//console.log("%d 来談者文 %d 単語 %d 文字 %d 治療者文 %d 単語 %d 文字 %d",m,kanjabun,kanjatango,kanjamoji,serapibun,serapitango,serapimoji);
		//console.log("そうですか %d",soudesuka);
		//var uetsuji="うえつじともや";
		//console.log(uetsuji.length);

		
		
		var arrayWithOnlyWords=[];

		x=0;
		for(hatsugenNumber=0;hatsugenNumber<keitaisokaiseki.length;++hatsugenNumber){
			for(sentenceNumberInHatsugen=0;sentenceNumberInHatsugen<keitaisokaiseki[hatsugenNumber].length;++sentenceNumberInHatsugen){
				for(wordNumberInSentence=0;wordNumberInSentence<keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen].length;++wordNumberInSentence){
					//単語だけの配列
					arrayWithOnlyWords[x]=keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen][wordNumberInSentence];
					x++;
				}
			}
		}
		x=0;
		for(hatsugenNumber=0;hatsugenNumber<keitaisokaiseki.length;++hatsugenNumber){
			for(sentenceNumberInHatsugen=0;sentenceNumberInHatsugen<keitaisokaiseki[hatsugenNumber].length;++sentenceNumberInHatsugen){
				for(wordNumberInSentence=0;wordNumberInSentence<keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen].length;++wordNumberInSentence){
					y=0;
					if(x>0){
						for(z=0;z<x;z++){
							if(arrayWithOnlyWords[z]==keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen][wordNumberInSentence]){
								y=1;
								break;
							}
						}
					}
					x++;
					if(y==1){
						continue;//次のjへ
					}
					wordsSetWithoutOverlap.add(keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen][wordNumberInSentence]);//tangoset終了
				}
				
				
				
				
			}
		}
        wordsArrayWithoutOverlap = Array.from(wordsSetWithoutOverlap).map(function(t) {return {t};});
		

		for(sentenceNumberInHatsugen=0;sentenceNumberInHatsugen<wordsArrayWithoutOverlap.length;sentenceNumberInHatsugen++){
			miserables.nodes[sentenceNumberInHatsugen]=wordsArrayWithoutOverlap[sentenceNumberInHatsugen].t;
		}
		var isInCoOccurrenceDictionary=[];

		for(taskGroupNumber=0;taskGroupNumber<=2;taskGroupNumber++){
			isInCoOccurrenceDictionary[taskGroupNumber]=[];
			for(wordsNumberWithMorphologicalAnalysis=0;wordsNumberWithMorphologicalAnalysis<miserables.nodes.length;wordsNumberWithMorphologicalAnalysis++){

				isInCoOccurrenceDictionary[taskGroupNumber][wordsNumberWithMorphologicalAnalysis]=0;
				for(hatsugenNumber=1;hatsugenNumber<keitaisokaiseki.length;hatsugenNumber=hatsugenNumber+2){
					for(sentenceNumberInHatsugen=0;sentenceNumberInHatsugen<keitaisokaiseki[hatsugenNumber].length;sentenceNumberInHatsugen++){
						if(isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen][taskGroupNumber]==1){
							for(wordNumberInSentence=0;wordNumberInSentence<keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen].length;wordNumberInSentence++){
								if(miserables.nodes[wordsNumberWithMorphologicalAnalysis]==keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen][wordNumberInSentence]){
									isInCoOccurrenceDictionary[taskGroupNumber][wordsNumberWithMorphologicalAnalysis]=1;
									break;
								}
							}
						}
						if(isInCoOccurrenceDictionary[taskGroupNumber][wordsNumberWithMorphologicalAnalysis]==1){
							break;
						}
					}
					if(isInCoOccurrenceDictionary[taskGroupNumber][wordsNumberWithMorphologicalAnalysis]==1){
						break;
					}
				}
			}
		}

		for(taskGroupNumber=0;taskGroupNumber<=2;taskGroupNumber++){
			for(wordsNumberWithMorphologicalAnalysis=0;wordsNumberWithMorphologicalAnalysis<miserables.nodes.length;wordsNumberWithMorphologicalAnalysis++){
				if(isInCoOccurrenceDictionary[taskGroupNumber][wordsNumberWithMorphologicalAnalysis]==1){
					for(hatsugenNumber=1;hatsugenNumber<keitaisokaiseki.length;hatsugenNumber=hatsugenNumber+2){
						for(sentenceNumberInHatsugen=0;sentenceNumberInHatsugen<keitaisokaiseki[hatsugenNumber].length;sentenceNumberInHatsugen++){
							if(isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen][taskGroupNumber]==0){
								for(wordNumberInSentence=0;wordNumberInSentence<keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen].length;wordNumberInSentence++){
									if(miserables.nodes[wordsNumberWithMorphologicalAnalysis]==keitaisokaiseki[hatsugenNumber][sentenceNumberInHatsugen][wordNumberInSentence]){
										isInTheTaskGroup[hatsugenNumber][sentenceNumberInHatsugen][taskGroupNumber]=1;
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

		var sResult = select(name,storage,checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,isInTheTaskGroup,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2);

		checkboxlist = sResult.checkboxlist;
		chboxlist = sResult.chboxlist;
		chboxlist2 = sResult.chboxlist2;
		isInTheTaskGroup = sResult.RGB;
		RGBlist = sResult.RGBlist;

		checked = sResult.checked;
		checked2 = sResult.checked2;
		taiou = sResult.taiou;
		taiou2 = sResult.taiou2;
		chboxlength = sResult.chboxlength;
		chboxlength2 = sResult.chboxlength2;
		//graph = sResult.graph;
		//console.log("chboxlength2=%d",chboxlength2)




		var vResult = setForViz(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin);//形態素解析後に1度目の描画
		chboxlist = vResult.chboxlist;
		chboxlist2 = vResult.chboxlist2;
		RGBlist = vResult.RGBlist;
		checked = vResult.checked;
		checked2 = vResult.checked2;
		chboxlength = vResult.chboxlength;
		chboxlength2 = vResult.chboxlength2;
		ranshin = vResult.ranshin;

		//これは後ろじゃないと、選択肢が反映されない？
		for(c=1;c<=chboxlength;c++){
			makeOnClick(c);
		}
		for(c=1;c<=chboxlength2;c++){
			makeOnClickS(c);
		}


		document.getElementById('radio_buttons').onchange = () => {
			setForViz(name,storage,keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,taiou2,chboxlength,chboxlength2,startTime,graph,ranshin);
		};//graphの形状を切り替えた際もここで再描画される

		//graphのラジオボタン変わったらまた描画

		return{
			name:name,RGBlist:RGBlist,keitaisokaiseki:keitaisokaiseki,hatsugen:hatsugen,bun:bun,chboxlist:chboxlist,chboxlist2:chboxlist2,checked:checked,checked2:checked2,taiou:taiou,taiou2:taiou2,chboxlength:chboxlength,chboxlength2:chboxlength2,ranshin:ranshin
		};



	});
};

export {funcReaderOnload,makeOnClick,makeOnClickS};

import "kuromoji";
import {select} from "./select.js"
import {setForViz} from "./svg.js"

var funcReaderOnload = (event,keitaisokaiseki,checkboxlist,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2) => {

	var h,i,j,k,l,m,n,c,r,g,b,x,y,z,bunsuu;  //mは段落
	var hinshi = [];
	var RGB = [];//どの発言にRGBが入っているか大まかに色分け
	var tangoset = new Set();
	var tangosett = [];
	var miserables={"nodes":[],"links":[]};
	var list = [];
	var target = document.getElementById("chbox");//checkboxを出す場所
	var checkboxlist=[];//checkboxに入る単語に1+RGBどれかの情報が3次元
	bun=[];
	var data = JSON.parse(event.target.result);
	return kuromoji.builder({dicPath: 'dict/'}).build((err, tokenizer) => {
		const path = tokenizer.tokenize(data[0].a);

		//1集計単位ごとにこの関数を用いよう
		console.log(path);
		n=0; //nは全データ内で何文字目か
		var tangosuu=0; //hatsugen内で何たんご目か
		m=0; //何個目の発言か。これの偶奇わけで判断。カウンセラーが奇数。患者が偶数。1文は1文で格納

		while(n<path.length){//発言ごとのループ
			keitaisokaiseki[m] = []; //一発言
			bun[m] = [];
			hatsugen[m] = "";
			hinshi[m] = [];
			RGB[m] = [];

			if(m%2==0){//カウンセラー
				//console.log(m/2);
				RGBlist[m/2] = [0,0,0,0,0,0,0];
				//console.log(m);
				//console.log(RGBlist[m/2]);
			}
			i=0; //段落内の何文目か。
			tangosuu=0; //hatsugen内で何たんご目か

			while(n<path.length){//文ごとのループ
				keitaisokaiseki[m][i] = []; //文
				bun[m][i]="";
				hinshi[m][i]=[];
				keitaisokaiseki[m][i].length = 0;
				RGB[m][i] = [0,0,0];

				j=0; //集計単位内で何単語目か
				while(n<path.length){//単語ごとのループ

					tangosuu++;
					//console.log("tangosuu=%d,%s",tangosuu,path[n].surface_form);
					bun[m][i] += path[n].surface_form;

					if(path[n].basic_form=="。"||path[n].basic_form=="？"||path[n].basic_form=="?"||path[n].basic_form=="："||path[n].basic_form==":"||path[n].word_id=="2613630"||path[n].surface_form=="･･･？："||path[n].surface_form==")："){
						break;//１文終了
					}

					if(m%2==1){

						if(path[n].basic_form=="母"||path[n].basic_form=="主人"||path[n].basic_form=="父さん"||path[n].basic_form=="ご主人"||path[n].basic_form=="お父さん"||path[n].basic_form=="姉"||path[n].basic_form=="姉さん"||path[n].basic_form=="母親"||path[n].basic_form=="お姉さん"||path[n].basic_form=="父"||path[n].basic_form=="家族"){

							RGB[m][i][0]=1;
						}
						if(path[n].basic_form=="兄"||path[n].basic_form=="子"||path[n].basic_form=="子ども"||path[n].basic_form=="妹"||path[n].basic_form=="弟"){

							RGB[m][i][0]=1;
						}
						if(path[n].basic_form=="両親"||path[n].basic_form=="お母様"||path[n].basic_form=="お父様"){

							RGB[m][i][0]=1;
						}
						if(path[n].basic_form=="仕事"||path[n].basic_form=="休み"||path[n].basic_form=="アルバイト"||path[n].basic_form=="働く"||path[n].basic_form=="同僚"||path[n].basic_form=="職場"||path[n].basic_form=="上司"||path[n].basic_form=="部下"){
							RGB[m][i][2]=1;
						}

						if(path[n].basic_form=="友人"||path[n].basic_form=="親友"||path[n].basic_form=="友達"||path[n].basic_form=="友"||path[n].basic_form=="交友"||path[n].basic_form=="友好"){
							RGB[m][i][1]=1;
						}

					}else if(m%2==0){

						if(path[n].basic_form=="いかが"||path[n].basic_form=="なんで"||path[n].basic_form=="どうして"||path[n].basic_form=="どの"||path[n].basic_form=="どのように"||path[n].basic_form=="いつ"||path[n].basic_form=="どういう"||path[n].basic_form=="どなた"||path[n].basic_form=="どう"||path[n].basic_form=="何"||path[n].basic_form=="何か"||path[n].basic_form=="どんな"||path[n].basic_form=="どのような"){
							RGBlist[m/2][3]=1;
						}else if(path[n].surface_form=="か"&&path[n].pos=="助詞"){
							RGBlist[m/2][4]=1;
						}else if(path[n].surface_form=="ね"&&path[n].pos=="助詞"){
							RGBlist[m/2][6]=1;
						}
					}


					if(path[n].pos_detail_1=="接尾"||path[n].basic_form=="*"||path[n].pos=="助詞"||path[n].basic_form=="、"||path[n].pos=="記号"||path[n].pos=="助動詞"||path[n].pos=="感動詞"||path[n].pos=="接頭詞"||path[n].pos_detail_1=="非自立"
					||path[n].basic_form=="する"||path[n].basic_form=="いる"||path[n].basic_form=="こういう"||path[n].basic_form=="そういう"||path[n].basic_form=="こう"||path[n].basic_form=="する"||path[n].basic_form=="こうした"||path[n].basic_form=="いう"||path[n].basic_form=="する"
					||path[n].basic_form=="なる"||path[n].basic_form=="その"||path[n].basic_form=="あの"||path[n].pos_detail_1=="数"||path[n].basic_form=="そう"||path[n].basic_form=="気持ち"||path[n].basic_form=="思い"||path[n].basic_form=="思う"||path[n].basic_form=="ある"){
						n++;//これないと延々ループする
						continue;
					}
					keitaisokaiseki[m][i][j] = path[n].basic_form;
					n++;
					j++;
				}//１文作成完了
				hatsugen[m] += bun[m][i];
				if(n==path.length){//確認
					if(m%2==0 ){
						console.log("m=%d i=%d tangosuu=%d %s",m,i,tangosuu,hatsugen[m]);
						if( i<=2 && tangosuu<=7){
							console.log("m=%dでtangosuu<=7",m);
							RGBlist[m/2][5]=1;
						}
					}
					break;
				}
				if(path[n].word_id=="2613630"||path[n].basic_form=="："||path[n].basic_form==":"||path[n].surface_form=="･･･？："||path[n].surface_form==")："){
					if(m%2==0 ){
						console.log("m=%d i=%d tangosuu=%d %s",m,i,tangosuu,hatsugen[m]);
						if( i<=2 && tangosuu<=7){
							console.log("m=%dでtangosuu<=7",m);
							RGBlist[m/2][5]=1;
						}
					}
					n++;
					break;
				}//1段落作成完了
				bunsuu=0;
				n++;
				i++;//段落内の何文目か
			}
			m++;
		}

		console.log("RGBlist");
		console.log(RGBlist);

		var tango=[];//全単語（重複あり）
		x=0;
		for(m=0;m<keitaisokaiseki.length;++m){
			for(i=0;i<keitaisokaiseki[m].length;++i){
				for(j=0;j<keitaisokaiseki[m][i].length;++j){
					tango[x]=keitaisokaiseki[m][i][j];
					x++;
				}
			}
		}


		x=0;//tangoについてまわす

		for(m=0;m<keitaisokaiseki.length;++m){
			for(i=0;i<keitaisokaiseki[m].length;++i){
				for(j=0;j<keitaisokaiseki[m][i].length;++j){
					y=0;//重複があれば1
					if(x>0){
						for(z=0;z<x;z++){
							if(tango[z]==keitaisokaiseki[m][i][j]){
								y=1;
								break;//y=1になったので用済み
							}
						}
					}
					x++;
					if(y==1){
						continue;//次のjへ
					}
					tangoset.add(keitaisokaiseki[m][i][j]);//tangoset終了
				}
			}
		}
		tangosett = Array.from(tangoset).map(function(t) {return {t};});

		for(i=0;i<tangosett.length;i++){
			miserables.nodes[i]=tangosett[i].t;
		}


		var RGBk=[];
		for(h=0;h<=2;h++){
			RGBk[h]=[];
			for(k=0;k<miserables.nodes.length;k++){
				RGBk[h][k]=0;
				for(m=1;m<keitaisokaiseki.length;m=m+2){
					for(i=0;i<keitaisokaiseki[m].length;i++){
						if(RGB[m][i][h]==1){
							for(j=0;j<keitaisokaiseki[m][i].length;j++){
								if(miserables.nodes[k]==keitaisokaiseki[m][i][j]){
									console.log("%s,%d",miserables.nodes[k],h);
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
					for(m=1;m<keitaisokaiseki.length;m=m+2){
						for(i=0;i<keitaisokaiseki[m].length;i++){
							if(RGB[m][i][h]==0){
								for(j=0;j<keitaisokaiseki[m][i].length;j++){
									if(miserables.nodes[k]==keitaisokaiseki[m][i][j]){
										console.log("%s,%d,m=%d,i=%d",bun[m][i],h,m,i);
										RGB[m][i][h]=1;
										break;
									}
								}
							}
						}
					}
				}
			}
		}


		var sResult = select(checkboxlist,keitaisokaiseki,miserables,chboxlist,chboxlist2,RGB,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2);

		checkboxlist = sResult.checkboxlist;
		chboxlist = sResult.chboxlist;
		chboxlist2 = sResult.chboxlist2;
		RGB = sResult.RGB;
		RGBlist = sResult.RGBlist;
		checked = sResult.checked;
		checked2 = sResult.checked2;
		taiou = sResult.taiou;
		chboxlength = sResult.chboxlength;
		chboxlength2 = sResult.chboxlength2;
		console.log("sResult");
		console.log(sResult);

		var vResult = setForViz(keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2);//形態素解析後に1度目の描画
		chboxlist = vResult.chboxlist;
		chboxlist2 = vResult.chboxlist2;
		RGBlist = vResult.RGBlist;
		checked = vResult.checked;
		checked2 = vResult.checked2;
		chboxlength = vResult.chboxlength;
		chboxlength2 = vResult.chboxlength2;
		console.log("vResult");
		console.log(vResult);

		document.getElementById('radio_buttons').onchange = () => {
			/*
			console.log("result");
    	console.log(result);
      keitaisokaiseki = result.keitaisokaiseki;
      chboxlist = result.chboxlist;
      chboxlist2 = result.chboxlist2;
      hatsugen =  result.hatsugen;
      bun = result.bun;
      RGBlist = result.RGBlist;
      checked = result.checked;
      checked2 = result.checked2;
      taiou = result.taiou;
      chboxlength = result.chboxlength;
      chboxlength2 = result.chboxlength2;
			*/
    	console.log("onchangeの中");
    	setForViz(keitaisokaiseki,chboxlist,chboxlist2,RGBlist,hatsugen,bun,checked,checked2,taiou,chboxlength,chboxlength2);
    	console.log("checkbox依存部分終わり");
    };

		return{
			RGBlist:RGBlist,keitaisokaiseki:keitaisokaiseki,hatsugen:hatsugen,bun:bun,chboxlist:chboxlist,chboxlist2:chboxlist2,checked:checked,checked2:checked2,taiou:taiou,chboxlength:chboxlength,chboxlength2:chboxlength2
		}
	})
};

export {funcReaderOnload};

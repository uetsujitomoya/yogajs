let RepeatClassifyWord=(hatsugenArray,dictionary)=>{
    //出てきたワードを調べ上げる
    ここに来る前に辞書をつくる
    let SearchCooccurence=()=>{
        //その文に入っている自立した単語のTASKを何かにする
        for(let hatsugenNumber=0; hatsugenNumber<.length; hatsugenNumber++){
            for(let sentenceNumber=0; sentenceNumber<.length; sentenceNumber++){
                if(hatsugenArray[hatsugenNumber].sentences[sentenceNumber].task!=null){
                    for(let wordNumber=0; wordNumber<wordArray.length; wordNumber++) {
                        //辞書にない単語をラベル付けして辞書に追加する
                        if(hatsugenArray[hatsugenNumber].sentences[sentenceNumber].words[wordNumber].task==null){
                            dictionary.push([hatsugenArray[hatsugenNumber].sentences[sentenceNumber].words[wordNumber].word,hatsugenArray[hatsugenNumber].sentences[sentenceNumber].task]);
                        }
                    }
                }
            }
        }
    };

    // 未分類のものについて再分類
        ClassifiWord(); //は、こいつの外側で呼び出したらよくね？？
};
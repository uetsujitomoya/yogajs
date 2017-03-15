let changeTalker=(hatsugen,TalkerTurningHatsugenNumber)=>{
    //指定するUI

    //指定されたところで入れ替える（発言のプロパティ）
    for(let hatsugenNumber=TalkerTurningHatsugenNumber,hatsugenNumber<hatsugen.length,hatsugenNumber++){
        if(hatsugen().talker=="c"){
            hatsugen().talker='t';
        }else{
            hatsugen().talker='c';
        }
    }

    //指定されて入れ替えたところをストレージに保存
    storage
};
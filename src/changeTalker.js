
//selectで「こっからTalker変えます」ってやった方がいいんじゃね

let switchToChangeTalker=()=>{
    this.changeTalker=(hatsugen,TalkerTurningHatsugenNumber)=>{
        //指定するUI

        //指定されたところで入れ替える（発言のプロパティ）
        for(let hatsugenNumber=TalkerTurningHatsugenNumber;hatsugenNumber<hatsugen.length;hatsugenNumber++){
            if(hatsugen().talker=="c"){
                hatsugen().talker='t';
            }else{
                hatsugen().talker='c';
            }
        }

        //指定されて入れ替えたところをストレージに保存
        storage
    };
    this.ui=()=>{
        this.appear=()=>{
            document.getElementById("switchToChangeTalker").innerHTML += '<input type="file" id="file-input"/><button id="load-button">まず最初に、左でjsonファイルを指定してから、ここをクリックして5～15秒ほど待つ</button>';
        };
    };
    this
};
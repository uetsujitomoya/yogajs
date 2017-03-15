let judge_I_or_They=(hatsugen,hatsugenNumber,sentenceNumber,wordNumber,knpCsv,KNP_csvRow)=>{
    //読み込んだKNPのCSVのｎ行目を参照する。人称、役職等
    if(knpCsv[KNP_csvRow][]==){
        hatsugen[].sentence[].word[].I_or_They="I";
    }else if(knpCsv[KNP_csvRow][]==){
        hatsugen[].sentence[].word[].I_or_They="They";
    }
};
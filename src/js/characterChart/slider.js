/**
 * Created by uetsujitomoya on 2017/09/11.
 */


import d3 from "d3";
import $ from "jquery"

import {createNodeAndArrowArray} from "../js/createNodeAndArrowArray.js";

let manageSlider = (sentenceArray) => {

    $("#ex2").slider({})
    $("#ex2").on("slide", function(slideEvt) {
        applySlider(slideEvt.value,sentenceArray)
    });
}

let applySlider = () => {
    //yaru
    //gyouretukosuuhaaku
    //「文」の個数把握

    //その指定した範囲だけの表示

    //どの動詞が何文目か情報
    //re-viz



    removeSVG()

    const selectedArea = {

    }
    redrawCharacterChart(sentenceArray,selectedArea)
}


let redrawCharacterChart = (sentenceArray,selectedArea) =>{
    var refinedSentenceArray = sentenceArray

    //sentenceArrayの最初と最後数個の要素を排除して、新sentenceArrayとして入力する


    createNodeAndArrowArray(refinedSentenceArray);
}





export{manageSlider}
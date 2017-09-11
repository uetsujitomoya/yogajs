/**
 * Created by uetsujitomoya on 2017/09/11.
 */



import {createNodeAndArrowArray} from "../js/createNodeAndArrowArray.js"

let applySlider = () => {
    //yaru
    //gyouretukosuuhaaku
    //「文」の個数把握

    //その指定した範囲だけの表示

    //どの動詞が何文目か情報
    //re-viz

    removeSVG()
    redrawCharacterChart(sentenceArray,selectedArea)
}


let redrawCharacterChart = (sentenceArray,selectedArea) =>{
    var refinedSentenceArray = sentenceArray

    //sentenceArrayの最初と最後数個の要素を排除して、新sentenceArrayとして入力する

    createNodeAndArrowArray(refinedSentenceArray)
}

let removeSVG = () => {
    d3.select("#svgdiv").select("svg").remove()
}
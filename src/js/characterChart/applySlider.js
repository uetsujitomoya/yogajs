/**
 * Created by uetsujitomoya on 2017/09/11.
 */

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


let redrawCharacterChart = (sentenceArray,selectedArea) => {

}

let removeSVG = () => {
    d3.select("#svgdiv").select("svg").remove();

}
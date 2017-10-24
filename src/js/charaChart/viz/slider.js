/**
 * Created by uetsujitomoya on 2017/09/11.
 */

import d3 from 'd3'
import $ from 'jquery'

import {createNodeAndArrowArr} from '../nodeAndArrow/createArrowArray.js'

import {removeSVG} from '../nodeAndArrow/vizNode.js'

let manageSlider = (sentenceArray,charaArray) => {
  let el = document.querySelector('#ex2')
  console.log(sentenceArray.length)
  el.dataset.sliderMax = sentenceArray.length + ''
  console.log(document.querySelector('#ex2').dataSliderMax)
  el.dataset.sliderValue = '[0,' + sentenceArray.length + ']'

  $('#ex2').slider({
    formatter: function (value) {
      return 'この範囲を見ています…… ' + value
    }
  })
    // console.log(document.getElementById("#ex2"))

  $('#ex2').on('slide', function (slideEvt) {
    console.log(slideEvt.value)
    applySlider(slideEvt.value, sentenceArray,charaArray)
  })
}

let applySlider = (selectedAreaArray, sentenceArray,charaArray) => {
    // yaru
    // gyouretukosuuhaaku
    // 「文」の個数把握

    // その指定した範囲だけの表示

    // どの動詞が何文目か情報
    // re-viz

  removeSVG()

  let selectedArea = {
    start: selectedAreaArray[0],
    end: selectedAreaArray[1]
  }
  redrawCharacterChart(sentenceArray, selectedArea,charaArray)
}

let redrawCharacterChart = (sentenceArray, selectedArea,charaArray) => {
  let refinedSentenceArray = sentenceArray.concat()

    // sentenceArrayの最初と最後数個の要素を排除して、新sentenceArrayとして入力する

    // まず末尾から
  refinedSentenceArray.splice(selectedArea.end, sentenceArray.length - selectedArea.end)
  refinedSentenceArray.splice(0, selectedArea.start)

  console.log('sentenceArray.length')
  console.log(sentenceArray.length)
  createNodeAndArrowArr(refinedSentenceArray,charaArray)
}

export {manageSlider}

/**
 * Created by uetsujitomoya on 2017/09/11.
 */

import d3 from 'd3'
import $ from 'jquery'
import {applySliderForNodeText} from './applySliderForNodeText'

import {createNodeAndArrowArr} from '../nodeAndArrow/createArrowArr.js'

import {removeSVG} from '../nodeAndArrow/vizNode.js'


let manageSlider = (bunArr, charaArr) => {
  let el = document.querySelector('#ex2')
  el.dataset.sliderMax = bunArr.length + ''
  el.dataset.sliderValue = '[0,' + bunArr.length + ']'

  el.innerHTML+=""+bunArr.length+"文目"

  $('#ex2').slider({
    formatter: function (value) {
      return 'この範囲を見ています…… ' + value
    }
  })

  $('#ex2').on('slide', function (slideEvt) {

    applySlider(slideEvt.value, bunArr,charaArr)

  })
}

const applySlider = (selectedAreaArray, bunArr,charaArr) => {
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
  redrawCharaChart(bunArr, selectedArea, charaArr)
}

const redrawCharaChart = (bunArr, selectedArea, charaArr) => {
  let selectedBunArr = bunArr.concat()
  // sentenceArrayの最初と最後数個の要素を排除して、新sentenceArrayとして入力する
  // まず末尾から
  selectedBunArr.splice(selectedArea.end, bunArr.length - selectedArea.end)
  selectedBunArr.splice(0, selectedArea.start)

  applySliderForNodeText(selectedBunArr, charaArr)

  createNodeAndArrowArr(selectedBunArr,charaArr)
}

export {manageSlider}

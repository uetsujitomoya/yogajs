/**
 * Created by uetsujitomoya on 2017/09/11.
 */

import d3 from 'd3'
import 'jquery'
import $ from 'jquery'
import 'bootstrap-slider'
import {applySliderForNodeText} from './viewText/applySliderForNodeText'

import {createArrowArr} from './nodeAndArrow/createArrowArr.js'

import {removeSVG} from './nodeAndArrow/vizNode.js'


let manageSlider = (allBunArr, charaArr) => {
  let el = document.querySelector('#ex2')
  el.dataset.sliderMax = allBunArr.length + ''
  el.dataset.sliderValue = '[0,' + allBunArr.length + ']'

  el.innerHTML+=""+allBunArr.length+"文目"

  $('#ex2').slider({
    formatter: function (value) {
      return 'この範囲を見ています…… ' + value
    }
  })

  console.log($('#bunqty'))
  $('#bunqty')[0].innerHTML += ""+allBunArr.length+""

  $('#ex2').on('slide', function (slideEvt) {

    const selectedArea = {
      start: slideEvt.value[0],
      end: slideEvt.value[1]
    }

    applySlider(selectedArea, allBunArr,charaArr)

  })
}

const applySlider = (selectedArea, allBunArr,nodeArr) => {
  // yaru
  // gyouretukosuuhaaku
  // 「文」の個数把握

  // その指定した範囲だけの表示

  // どの動詞が何文目か情報
  // re-viewText

  removeSVG()

/*  let selectedArea = {
    start: selectedAreaArray[0],
    end: selectedAreaArray[1]
  }*/
  redrawCharaChart(allBunArr, selectedArea, nodeArr)
}

const redrawCharaChart = (allBunArr, selectedArea, charaArr) => {
  let selectedBunArr = allBunArr.concat()
  // sentenceArrayの最初と最後数個の要素を排除して、新sentenceArrayとして入力する
  // まず末尾から
  selectedBunArr.splice(selectedArea.end, allBunArr.length - selectedArea.end)
  selectedBunArr.splice(0, selectedArea.start)

  applySliderForNodeText(selectedBunArr, charaArr)

  createArrowArr(selectedBunArr,charaArr,allBunArr)
}

export {manageSlider}

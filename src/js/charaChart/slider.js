/**
 * Created by uetsujitomoya on 2017/09/11.
 */

import d3 from 'd3'
import 'jquery'
import $ from 'jquery'
import 'bootstrap-slider'
import {applySliderForNodeText} from './viewText/applySliderForNodeTxt'

import {createArrowArr} from './nodeAndArrow/createArrowArr.js'

import {removeSVG} from './nodeAndArrow/vizNode.js'
import { nowWatchingArrowOrNode } from './nowWatchingArrowOrNode'
import { viewArrowTxt } from './viewText/viewArrowTxt'
import { viewNodeTxt } from './viewText/viewNodeTxt'


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
  removeSVG()
  redrawCharaChart(allBunArr, selectedArea, nodeArr)
}

const redrawCharaChart = (allBunArr, selectedArea, charaArr) => {
  let selectedBunArr = allBunArr.concat()
  selectedBunArr.splice(selectedArea.end, allBunArr.length - selectedArea.end)
  selectedBunArr.splice(0, selectedArea.start)
  applySliderForNodeText(selectedBunArr, charaArr)
  createArrowArr(selectedBunArr,charaArr,allBunArr)
  if(nowWatchingArrowOrNode.node!==null){
    viewNodeTxt(nowWatchingArrowOrNode.node,allBunArr)
  }
}

export {manageSlider}

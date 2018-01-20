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
import { rodata } from './rodata'


const applySingleSliderVal=(allBunArr,charaArr)=>{
  $('#ex18a').on('slide', function (slideEvt) {
    const selectedArea = {
      start: slideEvt.value,
      end: slideEvt.value+rodata.singleSliderSelectLen
    }
    applySlider(selectedArea, allBunArr,charaArr)
  })
}

const createSingleSlider=(allBunArr,charaArr)=>{

  $("#ex7-enabled").click(function() {
    if(this.checked) {
      // With JQuery
      $("#ex18a").slider("enable");
      applySingleSliderVal(allBunArr,charaArr)
    }
    else {
      // With JQuery
      $("#ex18a").slider("disable");
      const selectedArea = {
        start: 0,
        end: allBunArr.length
      }
      applySlider(selectedArea, allBunArr,charaArr)
    }
  });

  $("#ex18a").slider({
    min: 0,
    max: allBunArr.length-rodata.singleSliderSelectLen,
    value: 0,
    labelledby: 'ex18-label-1',
    formatter: function (value) {
      return '' + value + "文目から" + (value+rodata.singleSliderSelectLen)+"文目"
    }
  });

  applySingleSliderVal(allBunArr,charaArr)
}

const manageDoubleSlider=(allBunArr,charaArr)=>{
  let el = document.querySelector('#ex2')
  el.dataset.sliderMax = allBunArr.length + ''
  el.dataset.sliderValue = '[0,' + allBunArr.length + ']'
  el.innerHTML+=""+allBunArr.length+"文目"
  $('#ex2').slider({
    formatter: function (value) {
      return 'この範囲を見ています…… ' + value
    }
  })

  $('#ex2').on('slide', function (slideEvt) {
    const selectedArea = {
      start: slideEvt.value[0],
      end: slideEvt.value[1]
    }
    applySlider(selectedArea, allBunArr,charaArr)
  })
}

let manageSlider = (allBunArr, charaArr) => {

  console.log($('#bunqty'))
  $('#bunqty')[0].innerHTML += ""+allBunArr.length+""

  if(rodata.isSingleSlider){
    createSingleSlider(allBunArr,charaArr)
  }else{
    manageDoubleSlider(allBunArr,charaArr)
  }
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

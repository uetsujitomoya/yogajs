/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import d3 from 'd3'
import $ from 'jquery'
import {setting} from '../setting'
import {r} from './defineNode'
import {viewNodeTxt} from '../viewText/viewNodeTxt'

//import{setting} from '../../setting'
//const r = setting.nodeR

const clientColor = '#ff0000'
const aroundClientPeopleColor = '#000000'
const markerFillColor = '#ff0000'

const vizNodes = (svg,nodeArr,sliderBunArr,r,allBunArr) => {

  let nodes = svg.selectAll('g')
    .data(nodeArr).enter().append('g')
    .attr({
      transform: function (d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      }
    })

  nodes.append('circle').attr({
    /*      'r': function (d) { return r },
          'stroke': function (d) { if (d.isClient) { return setting.clientNodeColor } else { return setting.aroundClientPeopleNodeColor } },
          'fill': setting.circleFill,
          'stroke-width': (d) => { return　d.circleStrokeWidth }*/
    'fill':  function (d) { if (d.isClient) { return setting.clientNodeColor } else { return setting.aroundClientPeopleNodeColor } },
    'r':  (d) => {
      if(setting.isFixedArrowWidth){
        return setting.nodeR
      }else{
        return　d.circleStrokeWidth
      }

    }
  })
    .on('click', (d, i)=>{
      viewNodeTxt(d, allBunArr)
    })

  nodes.append('text')
    .attr({
      'text-anchor': 'middle',
      'dy': '.100em',
      'fill': setting.charaNameColor,
      "font-size":setting.circleFontSize
    })
    .text(function (d) {
      //if(d.nodeCharacter==="Aさん"){alert("Aさん")}
      return d.nodeCharacter +"\r\n　\r\n　"
    })
    .on('click', (d, i)=>{
      viewNodeTxt(d, allBunArr)
    })
}

let removeSVG = () => {
  d3.select(setting.charaChartAreaID).select('svg').remove()
}

export {vizNodes, removeSVG}

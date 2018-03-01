/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import d3 from 'd3'
import $ from 'jquery'
import {charaChartRodata} from '../rodata'
import {r} from './Node'
import {viewNodeTxt} from '../viewText/viewNodeTxt'

//import{charaChartRodata} from '../../charaChartRodata'
//const r = charaChartRodata.nodeR

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
          'stroke': function (d) { if (d.isClient) { return charaChartRodata.clientNodeColor } else { return charaChartRodata.aroundClientPeopleNodeColor } },
          'fill': charaChartRodata.circleFill,
          'stroke-width': (d) => { return　d.circleStrokeWidth }*/
    //'fill':  function (d) { if (d.isClient) { return charaChartRodata.clientNodeColor } else { return charaChartRodata.aroundClientPeopleNodeColor } },

    'fill':  function (node) {
      console.log(node)
      if (node.isBlue) {
        return charaChartRodata.aroundClientPeopleNodeColor
      } else { return charaChartRodata.clientNodeColor } },

    'r':  (d) => { return　d.circleStrokeWidth }
  })
    .on('click', (d, i)=>{
      viewNodeTxt(d, allBunArr)
    })

  nodes.append('text')
    .attr({
      'text-anchor': 'middle',
      'dy': '.100em',
      'fill': charaChartRodata.charaNameColor,
      "font-size":charaChartRodata.circleFontSize
    })
    .text(function (d) {
      //if(d.nodeCharacter==="Aさん"){alert("Aさん")}
      return "　　　　"+d.nodeCharacter
    })
    .on('click', (d, i)=>{
      viewNodeTxt(d, allBunArr)
    })
}

let removeSVG = () => {
  d3.select(charaChartRodata.charaChartAreaID).select('svg').remove()
}

export {vizNodes, removeSVG}

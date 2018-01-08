/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import d3 from 'd3'
import $ from 'jquery'
import {rodata} from '../rodata'
import {r} from './defineNode'
import {viewNodeText} from '../viewText/viewNodeText'

//import{rodata} from '../../rodata'
//const r = rodata.nodeR

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
      'r': function (d) { return r },
      'stroke': function (d) { if (d.isClient) { return rodata.clientNodeColor } else { return rodata.aroundClientPeopleNodeColor } },
      'fill': rodata.circleFill,
      'stroke-width': (d) => { return　d.circleStrokeWidth }
    })
    .on('click', (d, i)=>{
      viewNodeText(d, allBunArr)
    })

  nodes.append('text')
    .attr({
      'text-anchor': 'middle',
      'dy': '.100em',
      'fill': rodata.charaNameColor
    })
    .text(function (d) {
      //if(d.nodeCharacter==="Aさん"){alert("Aさん")}
      return d.nodeCharacter
    })
    .on('click', (d, i)=>{
      viewNodeText(d, allBunArr)
    })
}

let removeSVG = () => {
  d3.select(rodata.charaChartAreaID).select('svg').remove()
}

export {vizNodes, removeSVG}
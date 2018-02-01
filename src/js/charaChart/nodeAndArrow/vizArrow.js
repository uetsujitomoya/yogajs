/**
 * Created by uetsujitomoya on 2017/09/04.
 */

import {setting} from '../setting'
import {viewArrowTxt} from '../viewText/viewArrowTxt'
import * as d3 from 'd3'
const markerFillColor = setting.markerFillColor
const yajirushi_refX = setting.yajirushi_refX
const refY=setting.refY
const vizArrow = (svg, arrow, r, arrowId,　allBunArr) => {
  //let circle_data_array = [[nodeArray[0].x, nodeArray[0].y, r], [nodeArray[1].x, nodeArray[1].y, r]]
  //出発点の取得失敗？
  let color=null
  if (arrow.subject.isClient) {
    if(arrow.isBlue){
      color= setting.kawaisounaClientArrowColor
    }else{
      color= setting.clientArrowColor
    }
  } else {
    if(arrow.isBlue){
      color= setting.situationDependencyPeopleColor
    }else{
      color= setting.aroundClientPeopleArrowColor
    }

  }
  let marker = svg.append('defs').append('marker')
    .attr({
      'id': 'arrowhead'+arrowId,
      // 矢印の位置を一番後ろから手前に少しずらす
      //'refX': setting.yajirushi_refX,
      //'refX': 4.5*Math.sqrt(r),
      "refX":yajirushi_refX,
      'refY': refY,
      'markerWidth': setting.markerWitdh,
      'markerHeight': setting.markerHeight,
      'orient': 'auto',
      "markerUnits":"userSpaceOnUse"
    })
  marker.append('path')
    .attr({
      "d": setting.markerPath,
      "fill": color
    })
    .on('click', ()=>{
      viewArrowTxt(arrow, allBunArr)
    })
  let line = d3.svg.line()
    .interpolate('basis')
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })
  let path = svg.append('path')
    .attr({
      'd': line(arrow.pointArr),
      'stroke': color,
      'stroke-width': ()=>{
        if(setting.isFixedArrowWidth){
          return setting.fixedArrowWidth
        }else {
          return arrow.strokeWidth
        }
      },
      'fill': 'none',
      'marker-end': ()=>{
        if(setting.isViewedMarkEnd){
          return 'url(#arrowhead'+arrowId+')'
        }else{
          return null
        }
      }

    })
    .on('click', ()=>{
      viewArrowTxt(arrow, allBunArr)
    })
  // pathの長さを調べて、丸の半径２個分＋矢印を後ろに下げる分の長さを引きます。
  const totalLen = path.node().getTotalLength()
  const t = totalLen - (r + r /*+ yajirushi_refX*/ + arrow.strokeWidth)
  path.attr({
    // 破線の指定を行います。
    'stroke-dasharray': '0 ' + r + ' ' + t + ' ' + r,
    // 破線の開始相対位置を指定します
    'stroke-dashoffset': 0
  })
}

export{vizArrow}
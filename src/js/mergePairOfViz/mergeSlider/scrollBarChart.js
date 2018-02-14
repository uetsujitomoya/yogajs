import $ from 'jquery'

const scrollBarChart=(chartAreaId,pixel)=>{

  $("#"+chartAreaId).scrollLeft(pixel);//scrollTopじゃなくて横向きだわ
}

export {scrollBarChart}
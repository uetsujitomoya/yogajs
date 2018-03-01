import { getPixel } from './getPixel'
import { scrollBarChart } from './scrollBarChart'

const mainMergingSlider = (barLenArr) =>{
  //人間関係図スライダーに併せて，会話の流れチャートもスクロール
  //vizのどこにpixel蓄積されてるか調べないとアカン

  

  const pixel=getPixel()
  scrollBarChart(pixel)

}

export {mainMergingSlider}
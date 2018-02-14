import { getPixel } from './getPixel'
import { scrollBarChart } from './scrollBarChart'

const mainMergingSlider = () =>{
  //vizのどこにpixel蓄積されてるか調べないとアカン

  const pixel=getPixel()
  scrollBarChart(pixel)

}

export {mainMergingSlider}
import { isVerb } from './isVerb'
import { rodata } from '../rodata'

const isKihonkuIncludingTheVerb = (kihonku,verb) => {

  //基本句のknpArrからsearch
  //やっぱり基本句から取っていく

 // if(kihonku.)
  if(kihonku.knpArr[rodata.kihonku1stJpRowNo][rodata.knpSurfaceFormColNo]===verb.surface_form){
    return true
  }else{
    return false
  }

}

export {isKihonkuIncludingTheVerb}
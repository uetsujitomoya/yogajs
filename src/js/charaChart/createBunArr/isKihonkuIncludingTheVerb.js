import { isVerb } from './isVerb'
import { rodata } from '../rodata'

const isKihonkuIncludingTheVerb = (kihonku,verb) => {

  //基本句のknpArrからsearch
  //やっぱり基本句から取っていく

 // if(kihonku.)

 //console.log(kihonku.knpArr[rodata.kihonku1stJpRowNo][rodata.knpSurfaceFormColNo])
/*  if(kihonku.knpArr[rodata.kihonku1stJpRowNo][rodata.knpSurfaceFormColNo]==="+"){
    console.log(kihonku.knpArr)
  }*/
  //console.log(verb.surfaceForm)

  for(const row of kihonku.knpArr){
    if(row[0]!=="*"&&row[0]!=="+"){
      if(row[0]===verb.surfaceForm){
        //console.log(verb.surfaceForm)
        return true
        break
      }else{
        return false
        break
      }
    }
  }



}

export {isKihonkuIncludingTheVerb}
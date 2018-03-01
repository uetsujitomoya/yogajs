import { isVerb } from './isVerb'
import { charaChartRodata } from '../rodata'

const isKihonkuIncludingTheVerb = (kihonku,verb) => {

  //基本句のknpArrからsearch
  //やっぱり基本句から取っていく

 // if(kihonku.)

 //console.log(kihonku.knpArr[charaChartRodata.kihonku1stJpRowNo][charaChartRodata.knpSurfaceFormColNo])
/*  if(kihonku.knpArr[charaChartRodata.kihonku1stJpRowNo][charaChartRodata.knpSurfaceFormColNo]==="+"){
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
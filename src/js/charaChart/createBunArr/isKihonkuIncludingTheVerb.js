import { isVerb } from './isVerb'
import { charaChartSetting } from '../setting'

const isKihonkuIncludingTheVerb = (kihonku,verb) => {

  //基本句のknpArrからsearch
  //やっぱり基本句から取っていく

 // if(kihonku.)

 //console.log(kihonku.knpArr[charaChartSetting.kihonku1stJpRowNo][charaChartSetting.knpSurfaceFormColNo])
/*  if(kihonku.knpArr[charaChartSetting.kihonku1stJpRowNo][charaChartSetting.knpSurfaceFormColNo]==="+"){
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
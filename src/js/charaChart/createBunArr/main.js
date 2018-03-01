/**
 * Created by uetsujitomoya on 2017/08/17.
 */


import {isCharacter} from '../chara/isChara'
import {createsvg} from '../nodeAndArrow/arrowNode.js'
import Bun from './Bun'
import { borderBunNoArr } from '../sliderBarChart/borderBunNoArr'

//const firstJapaneseRowIdxInBunsetsu = 2

const createBunArr = (raw2dArr, nodeArr) =>
{//係り受けを調べる
  let bunNo = 0
  let bunArr = []
  let tmpBun2dArr = []
  let tmpRowNo = 0
  for(const row of raw2dArr){
    if (row[0] !== 'EOS') {
      if(row[0]==="///"){
        borderBunNoArr.push(bunNo)
      }else{
        tmpBun2dArr.push(row)
      }
    } else {
      //console.log(bunNo)
     bunArr.push(
       new Bun(tmpRowNo, tmpBun2dArr, nodeArr, bunNo, bunArr)
     )
      bunNo++
      tmpBun2dArr = []
    }
    tmpRowNo++
  }
  return bunArr
}

const existsSubject = (bunsetsu, nodeArr) => {
  const bunsetsuInfoRow = bunsetsu.csv_raw_array[0]
  const tmpCharaName = bunsetsu.csv_raw_array[1][0]
  for (var colCnt = 0; colCnt < bunsetsuInfoRow.length; colCnt++) {
    if (bunsetsuInfoRow[colCnt].match('ガ格') && isCharacter(nodeArr, tmpCharaName)) {
      bunsetsu.isSubject = true
      bunsetsu.subject = tmpCharaName
      break
    }
  }
}

const existsObject = (bunsetsu, nodeArr) => {
  const bunsetsuInfoRow = bunsetsu.csv_raw_array[0]
  const tmpCharaName = bunsetsu.csv_raw_array[1][0]
  for (let colCnt = 0; colCnt < bunsetsuInfoRow.length; colCnt++) {
    if ((bunsetsuInfoRow[colCnt].match('ヲ格') || bunsetsuInfoRow[colCnt].match('ニ格')) && isCharacter(nodeArr, tmpCharaName)) {
      bunsetsu.isObject = true
      bunsetsu.object = tmpCharaName
      break
    }
  }
}

export {createBunArr}
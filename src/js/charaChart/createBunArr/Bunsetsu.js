import {charaChartSetting} from '../setting'
import Word from './Word'
import {isCharacter,searchNodeArrayForCharacterAndPoint} from '../chara/isChara'
import {isVerb} from './isVerb'
import {addSVO2Bunsetsu


} from './SO/addSVO2bunsetsu'
import { unifyNotaion } from '../chara/unifyNotation'

const bunsetsu1stJpRIdx=charaChartSetting.bunsetsu1stJpRowNo

export default class Bunsetsu {
  constructor (no, input2dArr, charaArr, bun) {
    this.csv_raw_array = input2dArr
    this.id = no + 'D'

    this.kihonkuArr = []
   // this.kihonkuArr.length = count_kihonku(input2dArr)

    this.word_array = []

    this.kakaru_bunsetsu_id = input2dArr[0][1]
    this.kakarareru_bunsetsu_id_array = []
    //this.surfaceForm = ''
    input2dArr.forEach((r) => {
      //this.surfaceForm += r[0]
      this.word_array.push(new Word(r))//forHinshi
    })
    this.isVerb = false

    //this.createKihonkuArrayInBunsetsu(input2dArr)


    const tmpCharaName = unifyNotaion( this.csv_raw_array[ bunsetsu1stJpRIdx ][ 0 ] )

    addSVO2Bunsetsu(charaArr,tmpCharaName,this,bun)
    delete　this.csv_raw_array
  }

  createKihonkuArrayInBunsetsu (bunsetsuRaw2dArray) {
    let kihonkuIdxInBunsetsu = 0
    let tmp2dArrForKihonku = []
    if (bunsetsuRaw2dArray.length >= 1) {
      const jp1stNo = 2
      for (let rowCnt = jp1stNo; rowCnt < bunsetsuRaw2dArray.length; rowCnt++) {
        let tmpRow = bunsetsuRaw2dArray[rowCnt]
        if (tmpRow[0] === charaChartSetting.kihonkuSymbol) { // 文節内 2こ目以降の基本句
          this.kihonkuArr[kihonkuIdxInBunsetsu] = new KihonkuInBunsetsu(tmp2dArrForKihonku)// 文の中の通し番号での基本句array
          tmp2dArrForKihonku = []
          kihonkuIdxInBunsetsu++
        }
        tmp2dArrForKihonku.push(tmpRow)
      }
      this.kihonkuArr[kihonkuIdxInBunsetsu] = new KihonkuInBunsetsu(tmp2dArrForKihonku)// 文の中の通し番号での基本句array
    }
  }

  findVerbInBunsetsu () {
    for(let i=bunsetsu1stJpRIdx;i<this.word_array.length;i++){
      if (isVerb(this.word_array[i].hinshi)) {
        this.isVerb = true
        this.verb = this.word_array[i].basic_form
        break
      }
    }
  }

}

class KihonkuInBunsetsu {
  constructor (r) {
    this.csv_raw_array = []
    this.word_array = []
    for (let rCnt = 1; rCnt < r.length; rCnt++) {
    }
    this.subject = 'null'
    this.object = 'null'
    this.kakaruNo = 'null'
    this.surfaceForm = r[0]
  }
}
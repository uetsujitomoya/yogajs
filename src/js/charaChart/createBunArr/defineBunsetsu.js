import {rodata} from '../rodata'
import Word from './defineWord'
import {isCharacter,searchNodeArrayForCharacterAndPoint} from './isChara'
import {hasVerb} from './defineVerb'
import {addSVO2Bunsetsu} from './SO/addSVO2bunsetsu'

const bunsetsu1stJpRIdx=rodata.firstJapaneseRowIdxInBunsetsu

export default class Bunsetsu {
  constructor (no, input2dArray, charaArray,bun) {
    this.csv_raw_array = input2dArray
    this.id = no + 'D'

    this.kihonkuArray = []
   // this.kihonkuArray.length = count_kihonku(input2dArray)

    this.word_array = []

    this.kakaru_bunsetsu_id = input2dArray[0][1]
    this.kakarareru_bunsetsu_id_array = []
    this.surfaceForm = ''
    input2dArray.forEach((r) => {
      this.surfaceForm += r[0]
      this.word_array.push(new Word(r))
    })
    this.isVerb = false

    this.createKihonkuArrayInBunsetsu(input2dArray)


    const tmpCharaName = this.csv_raw_array[bunsetsu1stJpRIdx][0]

    addSVO2Bunsetsu(charaArray,tmpCharaName,this,bun)
  }

  createKihonkuArrayInBunsetsu (bunsetsuRaw2dArray) {
    let kihonkuIdxInBunsetsu = 0
    let tmp2dArrForKihonku = []
    if (bunsetsuRaw2dArray.length >= 1) {
      let japaneseStartingNum = 2
      for (let rowCnt = japaneseStartingNum; rowCnt < bunsetsuRaw2dArray.length; rowCnt++) {
        let tmpRow = bunsetsuRaw2dArray[rowCnt]
        if (tmpRow[0] === rodata.kihonkuSymbol) { // 文節内 2こ目以降の基本句
          this.kihonkuArray[kihonkuIdxInBunsetsu] = new KihonkuInBunsetsu(tmp2dArrForKihonku)// 文の中の通し番号での基本句array
          tmp2dArrForKihonku = []
          kihonkuIdxInBunsetsu++
        }
        tmp2dArrForKihonku.push(tmpRow)
      }
      this.kihonkuArray[kihonkuIdxInBunsetsu] = new KihonkuInBunsetsu(tmp2dArrForKihonku)// 文の中の通し番号での基本句array
    }
  }

  findVerbInBunsetsu () {
    if (hasVerb(this.word_array[bunsetsu1stJpRIdx].raw_array)) {
      this.isVerb = true
      this.verb = this.word_array[bunsetsu1stJpRIdx].basic_form
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
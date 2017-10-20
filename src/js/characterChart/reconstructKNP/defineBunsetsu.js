import {rodata} from '../../rodata'
import KNP_word from './defineWord'
import {isCharacter,searchNodeArrayForCharacterAndPoint} from './isCharacter'
import {includesVerb} from './defineVerb'
import {judgeSO} from './SubjectOrObject/judgeSO'

const firstJapaneseRowIdxInBunsetsu=rodata.firstJapaneseRowIdxInBunsetsu

export default class Bunsetsu {
  constructor (num, input_2d_array, charaArray) {
    this.csv_raw_array = input_2d_array
    this.id = num + 'D'

    this.kihonkuArray = []
   // this.kihonkuArray.length = count_kihonku(input_2d_array)

    this.word_array = []

    this.kakaru_bunsetsu_id = input_2d_array[0][1]
    this.kakarareru_bunsetsu_id_array = []
    this.surfaceForm = ''
    input_2d_array.forEach((row_array) => {
      this.surfaceForm += row_array[0]
      this.word_array.push(new KNP_word(row_array))
    })
    this.isVerb = false

    this.createKihonkuArrayInBunsetsu(input_2d_array)


    const tmpCharaName = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]

    judgeSO(charaArray,tmpCharaName,this)
  }

  createKihonkuArrayInBunsetsu (bunsetsuRaw2dArray) {
    let kihonkuIdxInBunsetsu = 0
    let temp2dArrayForKihonku = []
    if (bunsetsuRaw2dArray.length >= 1) {
      let japaneseStartingNum = 2
      for (let rowCnt = japaneseStartingNum; rowCnt < bunsetsuRaw2dArray.length; rowCnt++) {
        let tempRow = bunsetsuRaw2dArray[rowCnt]
        if (tempRow[0] === rodata.kihonkuSymbol) { // 文節内 2こ目以降の基本句
          this.kihonkuArray[kihonkuIdxInBunsetsu] = new KihonkuInBunsetsu(temp2dArrayForKihonku)// 文の中の通し番号での基本句array
          temp2dArrayForKihonku = []
          kihonkuIdxInBunsetsu++
        }
        temp2dArrayForKihonku.push(tempRow)
      }
      this.kihonkuArray[kihonkuIdxInBunsetsu] = new KihonkuInBunsetsu(temp2dArrayForKihonku)// 文の中の通し番号での基本句array
    }
  }

  findVerbInBunsetsu () {
    if (includesVerb(this.word_array[firstJapaneseRowIdxInBunsetsu].raw_array)) {
      this.isVerb = true
      this.verb = this.word_array[firstJapaneseRowIdxInBunsetsu].basic_form
    }
  }

}

class KihonkuInBunsetsu {
  constructor (row_array) {
    this.csv_raw_array = []
    this.word_array = []
    for (let rowNo = 1; rowNo < row_array.length; rowNo++) {
    }
    this.subject = 'null'
    this.object = 'null'
    this.kakaruNo = 'null'
    this.surfaceForm = row_array[0]
  }
}
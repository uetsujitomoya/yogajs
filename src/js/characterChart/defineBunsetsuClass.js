import {rodata} from '../rodata'
import KNP_word from './defineWordClass'
import {isCharacter} from './isCharacter'
import {includesVerb} from '../find_verb'
//import KNP_kihonku_in_bunsetsu from './defineKihonkuClass'

const firstJapaneseRowIdxInBunsetsu=rodata.firstJapaneseRowIdxInBunsetsu

export default class KNP_Bunsetsu {
  constructor (num, input_2d_array, KNP_character_array) {
    this.csv_raw_array = input_2d_array
    this.id = num + 'D'

    this.kihonku_array = []
   // this.kihonku_array.length = count_kihonku(input_2d_array)

    this.word_array = []

    this.kakaru_bunsetsu_id = input_2d_array[0][1]
    this.kakarareru_bunsetsu_id_array = []
    this.surface_form = ''
    input_2d_array.forEach((row_array) => {
      this.surface_form += row_array[0]
      this.word_array.push(new KNP_word(row_array))
    })
    this.isVerb = false

    this.makeKihonkuArrayInBunsetsu(input_2d_array)


    const temp_character_name = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]

    if (isCharacter(KNP_character_array, temp_character_name)) {

      this.addAboutSubjectOrObject(this.csv_raw_array[0],temp_character_name)

    } else if(this.csv_raw_array.length　>　firstJapaneseRowIdxInBunsetsu+1){/*AさんBさんにも対応*/
      const tempCharacterNameWithHonorific = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]+this.csv_raw_array[firstJapaneseRowIdxInBunsetsu+1][0]
      if (isCharacter(KNP_character_array, tempCharacterNameWithHonorific)) {
        console.log(tempCharacterNameWithHonorific)
        this.addAboutSubjectOrObject(this.csv_raw_array[0],tempCharacterNameWithHonorific)
      }else{
        this.findVerbInBunsetsu()
      }
    }else{
      this.findVerbInBunsetsu()
    }
  }

  addAboutSubjectOrObject(bunsetsuInfoRow,characterName){
    for (let colIdx = 0; colIdx < bunsetsuInfoRow.length; colIdx++) {
      if ((bunsetsuInfoRow[colIdx].match('ヲ格') || bunsetsuInfoRow[colIdx].match('ニ格'))) {
        this.addAboutObject(characterName)
        break
      } else if (bunsetsuInfoRow[colIdx].match('ガ格')) {
        this.addAboutSubject(characterName)
        break
      }
    }
  }

  makeKihonkuArrayInBunsetsu (bunsetsuRaw2dArray) {
    let kihonkuIdxInBunsetsu = 0
    let temp2dArrayForKihonku = []
    if (bunsetsuRaw2dArray.length >= 1) {
      let japaneseStartingNum = 2
      for (let rowCnt = japaneseStartingNum; rowCnt < bunsetsuRaw2dArray.length; rowCnt++) {
        let tempRow = bunsetsuRaw2dArray[rowCnt]
        if (tempRow[0] === rodata.kihonkuSymbol) { // 文節内 2こ目以降の基本句
          this.kihonku_array[kihonkuIdxInBunsetsu] = new KNP_kihonku_in_bunsetsu(temp2dArrayForKihonku)// 文の中の通し番号での基本句array
          temp2dArrayForKihonku = []
          kihonkuIdxInBunsetsu++
        }
        temp2dArrayForKihonku.push(tempRow)
      }
      this.kihonku_array[kihonkuIdxInBunsetsu] = new KNP_kihonku_in_bunsetsu(temp2dArrayForKihonku)// 文の中の通し番号での基本句array
    }
  }

  addAboutObject (characterName) {
    this.isObject = true
    this.object = characterName
  }

  addAboutSubject (characterName) {
    this.isSubject = true
    this.subject = characterName
  }

  findVerbInBunsetsu () {
    if (includesVerb(this.word_array[firstJapaneseRowIdxInBunsetsu].raw_array)) {
      this.isVerb = true
      this.verb = this.word_array[firstJapaneseRowIdxInBunsetsu].basic_form
    }
  }
}

class KNP_kihonku_in_bunsetsu {
  constructor (row_array) {
    this.csv_raw_array = []
    this.word_array = []
    for (let rowNo = 1; rowNo < row_array.length; rowNo++) {
    }
    this.subject = 'null'
    this.object = 'null'
    this.kakaruNo = 'null'
    this.surface_form = row_array[0]
  }
}
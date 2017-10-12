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

    this.make_kihonku_array_in_bunsetsu(input_2d_array)


    const temp_character_name = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]

    if (isCharacter(KNP_character_array, temp_character_name)) {

      this.addAboutSubjectOrObject(this.csv_raw_array[0],temp_character_name)

    } else if(this.csv_raw_array.length>firstJapaneseRowIdxInBunsetsu+1){/*AさんBさんにも対応*/
      const tempCharacterNameWithHonorific = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]+this.csv_raw_array[firstJapaneseRowIdxInBunsetsu+1][0]
      if (isCharacter(KNP_character_array, tempCharacterNameWithHonorific)) {
        console.log(tempCharacterNameWithHonorific)
        this.addAboutSubjectOrObject(this.csv_raw_array[0],tempCharacterNameWithHonorific)
      }else{
        this.find_verb_in_bunsetsu()
      }
    }else{
      this.find_verb_in_bunsetsu()
    }
  }

  addAboutSubjectOrObject(bunsetsu_info_row,characterName){
    for (let colIdx = 0; colIdx < bunsetsu_info_row.length; colIdx++) {
      if ((bunsetsu_info_row[colIdx].match('ヲ格') || bunsetsu_info_row[colIdx].match('ニ格'))) {
        this.add_about_object(characterName)
        break
      } else if (bunsetsu_info_row[colIdx].match('ガ格')) {
        this.add_about_subject(characterName)
        break
      }
    }
  }

  make_kihonku_array_in_bunsetsu (bunsetsu_raw_2d_array) {
    let kihonkuIdxInBunsetsu = 0
    let temp2dArrayForKihonku = []
    if (bunsetsu_raw_2d_array.length >= 1) {
      let japanese_starting_num = 2
      for (let temp_rowNo = japanese_starting_num; temp_rowNo < bunsetsu_raw_2d_array.length; temp_rowNo++) {
        let temp_row = bunsetsu_raw_2d_array[temp_rowNo]
        if (temp_row[0] === rodata.kihonkuSymbol) { // 文節内 2こ目以降の基本句
          this.kihonku_array[kihonkuIdxInBunsetsu] = new KNP_kihonku_in_bunsetsu(temp2dArrayForKihonku)// 文の中の通し番号での基本句array
          temp2dArrayForKihonku = []
          kihonkuIdxInBunsetsu++
        }
        temp2dArrayForKihonku.push(temp_row)
      }
      this.kihonku_array[kihonkuIdxInBunsetsu] = new KNP_kihonku_in_bunsetsu(temp2dArrayForKihonku)// 文の中の通し番号での基本句array
    }
  }

  add_about_object (characterName) {
    this.isObject = true
    this.object = characterName
  }

  add_about_subject (characterName) {
    this.isSubject = true
    this.subject = characterName
  }

  find_verb_in_bunsetsu () {
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
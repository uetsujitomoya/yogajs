import {rodata} from '../../rodata'
import KNP_word from './defineWord'
import {isCharacter,searchNodeArrayForCharacterAndPoint} from './isCharacter'
import {includesVerb} from './defineVerb'
import {judgeAboutAddingSubjectCharaOrObjectChara} from './judgeAboutAddingSubjectCharaOrObjectChara'

const firstJapaneseRowIdxInBunsetsu=rodata.firstJapaneseRowIdxInBunsetsu

export default class Bunsetsu {
  constructor (num, input_2d_array, characterArray) {
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

    this.createKihonkuArrayInBunsetsu(input_2d_array)


    const tmpCharaName = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]

    judgeAboutAddingSubjectCharaOrObjectChara(characterArray,tmpCharaName,this)
  }

  addAboutSubjectOrObject(bunsetsuInfoRow,charaName,node){
    //文節に主語目的語情報を増やす
    for (let colIdx = 0; colIdx < bunsetsuInfoRow.length; colIdx++) {
      if ((bunsetsuInfoRow[colIdx].match('ヲ格') || bunsetsuInfoRow[colIdx].match('ニ格'))) {
        this.addAboutObject(charaName,node)
        break
      } else if (bunsetsuInfoRow[colIdx].match('ガ格')) {
        this.addAboutSubject(charaName,node)
        break
      }
    }
  }

  createKihonkuArrayInBunsetsu (bunsetsuRaw2dArray) {
    let kihonkuIdxInBunsetsu = 0
    let temp2dArrayForKihonku = []
    if (bunsetsuRaw2dArray.length >= 1) {
      let japaneseStartingNum = 2
      for (let rowCnt = japaneseStartingNum; rowCnt < bunsetsuRaw2dArray.length; rowCnt++) {
        let tempRow = bunsetsuRaw2dArray[rowCnt]
        if (tempRow[0] === rodata.kihonkuSymbol) { // 文節内 2こ目以降の基本句
          this.kihonku_array[kihonkuIdxInBunsetsu] = new KihonkuInBunsetsu(temp2dArrayForKihonku)// 文の中の通し番号での基本句array
          temp2dArrayForKihonku = []
          kihonkuIdxInBunsetsu++
        }
        temp2dArrayForKihonku.push(tempRow)
      }
      this.kihonku_array[kihonkuIdxInBunsetsu] = new KihonkuInBunsetsu(temp2dArrayForKihonku)// 文の中の通し番号での基本句array
    }
  }

  addAboutObject (charaName,node) {
    this.isObject = true
    this.object = node
  }

  addAboutSubject (charaName,node) {
    this.isSubject = true
    this.subject = node
  }

  findVerbInBunsetsu () {
    if (includesVerb(this.word_array[firstJapaneseRowIdxInBunsetsu].raw_array)) {
      this.isVerb = true
      this.verb = this.word_array[firstJapaneseRowIdxInBunsetsu].basic_form
    }
  }

/*  judgeAboutAddingSubjectCharaOrObjectChara(charaArray, tmpName){
    let result=searchNodeArrayForCharacterAndPoint(charaArray,tmpName)
    if (result.isCharacter) {
      this.addAboutSubjectOrObject(this.csv_raw_array[0],tmpName)
    } else if(this.csv_raw_array.length　>　firstJapaneseRowIdxInBunsetsu+1){/!*AさんBさんにも対応*!/
      const tempCharaNameWithHonorific = this.csv_raw_array[firstJapaneseRowIdxInBunsetsu][0]+this.csv_raw_array[firstJapaneseRowIdxInBunsetsu+1][0]
      result=searchNodeArrayForCharacterAndPoint(charaArray,tempCharaNameWithHonorific)
      if (result.isCharacter) {
        //console.log(tempCharaNameWithHonorific)
        this.addAboutSubjectOrObject(this.csv_raw_array[0],tempCharaNameWithHonorific)
      }else{
        this.findVerbInBunsetsu()
      }
    }else{
      this.findVerbInBunsetsu()
    }
  }*/

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
    this.surface_form = row_array[0]
  }
}
import Word from './defineWord'

export default class KihonkuInSentence {
  constructor (no, knpArr) {
    //this.csv_raw_array = knpArr
    this.id = no + 'D'
    this.knpArr = knpArr

    this.word_array = []
    for (let rowNo = 1; rowNo < knpArr.length; rowNo++) {
      this.word_array.push(new Word(knpArr[rowNo]))
    }

    this.kakaru_kihonku_id = knpArr[0][1]
    this.kakarareru_kihonku_id_array = []
    this.surfaceForm = ''
    knpArr.forEach((row) => {
      if(row[0]!=="*"&&row[0]!=="+"){
        this.surfaceForm += row[0]
      }
    })
  }
}
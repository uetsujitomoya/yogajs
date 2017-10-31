import Word from './defineWord'

export default class KihonkuInSentence {
  constructor (no, input2dArray) {
    //this.csv_raw_array = input2dArray
    this.id = no + 'D'

    this.word_array = []
    for (let rowNo = 1; rowNo < input2dArray.length; rowNo++) {
      this.word_array.push(new Word(input2dArray[rowNo]))
    }

    this.kakaru_kihonku_id = input2dArray[0][1]
    this.kakarareru_kihonku_id_array = []
/*    this.surfaceForm = ''
    input2dArray.forEach((row) => {
      if(row[0]!=="*"&&row[0]!=="+"){
        this.surfaceForm += row[0]
      }
    })*/
  }
}
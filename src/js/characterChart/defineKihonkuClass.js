import KNP_word from './defineWordClass'

export default class KNP_kihonku_in_sentence {
  constructor (num, input_2d_array) {
    this.csv_raw_array = input_2d_array
    this.id = num + 'D'

    this.word_array = []
    for (let rowNo = 1; rowNo < input_2d_array.length; rowNo++) {
      this.word_array.push(new KNP_word(input_2d_array[rowNo]))
    }

    this.kakaru_kihonku_id = input_2d_array[0][1]
    this.kakarareru_kihonku_id_array = []
    this.surface_form = ''
    input_2d_array.forEach((row_array) => {
      this.surface_form += row_array[0]
    })
  }
}
/*
export default class KNP_kihonku_in_bunsetsu {
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
}*/
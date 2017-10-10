/**
 * Created by uetsujitomoya on 2017/08/21.
 */

export const initialValueOfSubjectAndObjectInVerb ='null'

let find_verbs = (knparray) => {
    // if 動詞 exist -> find_dependency

  for (let rowNo = 0; rowNo < knparray.length; rowNo++) {
    let surface
    find_verb_from_csv(rowNo, knparray)
  }
}

class KNP_verb {
  constructor (rowNo, row_array, upper_row_array) {
    this.rowNo = rowNo
    this.subject = initialValueOfSubjectAndObjectInVerb
    this.object = initialValueOfSubjectAndObjectInVerb
    this.kakarareruNo = upper_row_array[1]
    this.surface_form = row_array[0]
    this.basic_form = row_array[2]
  }
}

let find_verb_from_csv = (rowNo, knparray) => {
  if (contains_japanese(knparray[rowNo])) {
    let temp_japanese = knparray[rowNo][0]
        // console.log(knparray[rowNo][3])
    if (includesVerb(knparray[rowNo])) {
      let temp_character_name = knparray[rowNo][0]
            // 上の行も引数にしないといけない
      KNP_verb_array.push(new KNP_verb(rowNo, knparray[rowNo], knparray[rowNo - 1]))
    }
  }
}

let includesVerb = (word_row) => {
    // console.log(word_row)
  if (word_row[3] === '動詞') {
    return true
  }
  return false
}

export {find_verb_from_csv, find_verbs, includesVerb}

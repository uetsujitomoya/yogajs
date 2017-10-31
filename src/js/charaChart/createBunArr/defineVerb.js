/**
 * Created by uetsujitomoya on 2017/08/21.
 */

export const initialValueOfSubjectAndObjectInVerb =null

const findVerbs = (knparray) => {
    // if 動詞 exist -> find_dependency

  for (let rowNo = 0; rowNo < knparray.length; rowNo++) {
    let surface
    findVerbFromCSV(rowNo, knparray)
  }
}

class Verb {
  constructor (rowNo, rowArray, upperRowArray) {
    this.rowNo = rowNo
    this.subject = initialValueOfSubjectAndObjectInVerb
    this.object = initialValueOfSubjectAndObjectInVerb
    this.kakarareruNo = upperRowArray[1]
    this.surfaceForm = rowArray[0]
    this.basic_form = rowArray[2]
  }
}

const findVerbFromCSV = (rowNo, knpArray,verbArray) => {
  if (hasJp(knpArray[rowNo])) {
    let tmpJapanese = knpArray[rowNo][0]
        // console.log(knpArray[rowNo][3])
    if (hasVerb(knpArray[rowNo][3])) {
      let tmpCharaName = knpArray[rowNo][0]
            // 上の行も引数にしないといけない
      verbArray.push(new Verb(rowNo, knpArray[rowNo], knpArray[rowNo - 1]))
    }
  }
}

const hasVerb = (hinshi) => {
    // console.log(wordRow)
  if (hinshi === '動詞') {
    return true
  }
  return false
}

export {findVerbFromCSV, findVerbs, hasVerb}

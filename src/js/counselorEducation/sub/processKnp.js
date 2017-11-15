// 切り替える際に発言を切り替える

// （０から数えて）３列目に人称
import $ from 'jquery'
// import {downloadAsCSV} from "./index.js";
import {select} from '../select.js'
import {setForViz} from '../svg.js'

let ClassifyWithKNP = (startTime, jsonFileName, event, keitaisokaiseki, chboxlist, chboxlist2, questionClassification, hatsugen, bun, checked, checked2, taiou, taiou2, newLoveDictionary, newWorkDictionary, newFriendDictionary, RGB) => {
  let isUsingKNP = 1
  let isUsingDictionaryWithWord2Vec = 0

  let readingCSVname = 'Book2.csv'

  let knpArray = csv2Array(readingCSVname)

  let storage = localStorage// 初回読み込み

  let resultArray = []
  OrganizeKNP(knpArray, hatsugen, newLoveDictionary, newWorkDictionary, newFriendDictionary, RGB, resultArray)

  console.log(hatsugen)

  console.log(resultArray)

    // object2CSVほしい
  downloadAsCSV(readingCSVname + 'Result', resultArray)
  putToScreen(startTime, jsonFileName, keitaisokaiseki, chboxlist, chboxlist2, RGB, hatsugen, bun, checked, checked2, taiou, taiou2, isUsingDictionaryWithWord2Vec, isUsingKNP)
}

let putToScreen = (startTime, jsonFileName, keitaisokaiseki, chboxlist, chboxlist2, RGB, hatsugen, bun, checked, checked2, taiou, taiou2, isUsingDictionaryWithWord2Vec, isUsingKNP) => {
  let storage = localStorage// 初回読み込み
  let checkboxlist = []
  let RGBlist = []
  let chboxlength = []
  let chboxlength2 = []
  let ranshin = []

  var sResult = select(jsonFileName, storage, checkboxlist, keitaisokaiseki, chboxlist, chboxlist2, RGBlist, hatsugen, bun, checked, checked2, taiou, taiou2, chboxlength, chboxlength2, isUsingDictionaryWithWord2Vec, isUsingKNP)

  checkboxlist = sResult.checkboxlist
  chboxlist = sResult.chboxlist
  chboxlist2 = sResult.chboxlist2
  RGB = sResult.RGB
  RGBlist = sResult.RGBlist

  checked = sResult.checked
  checked2 = sResult.checked2
  taiou = sResult.taiou
  taiou2 = sResult.taiou2
  chboxlength = sResult.chboxlength
  chboxlength2 = sResult.chboxlength2

  var vResult = setForViz(jsonFileName, storage, keitaisokaiseki, chboxlist, chboxlist2, RGBlist, hatsugen, bun, checked, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin, isUsingDictionaryWithWord2Vec)// 形態素解析後に1度目の描画
  chboxlist = vResult.chboxlist
  chboxlist2 = vResult.chboxlist2
  RGBlist = vResult.RGBlist
  checked = vResult.checked
  checked2 = vResult.checked2
  chboxlength = vResult.chboxlength
  chboxlength2 = vResult.chboxlength2
  ranshin = vResult.ranshin

    // これは後ろじゃないと、選択肢が反映されない？どーしよ
  for (c = 1; c <= chboxlength; c++) {
    makeOnClick(c)
  }
  for (c = 1; c <= chboxlength2; c++) {
    makeOnClickS(c)
  }

  document.getElementById('radio_buttons').onchange = () => {
    setForViz(jsonFileName, storage, keitaisokaiseki, chboxlist, chboxlist2, RGBlist, hatsugen, bun, checked, checked2, taiou, taiou2, chboxlength, chboxlength2, startTime, graph, ranshin)
  }// graphの形状を切り替えた際もここで再描画される
}

let AcceptKnp = (name, event, keitaisokaiseki, chboxlist, chboxlist2, questionClassification, hatsugen, bun, checked, checked2, taiou, taiou2, chboxlength, chboxlength2) => {
  let file = document.getElementById('file-input').files[0]
  name = file.name
  let reader = new FileReader()
  reader.onload = function (event) {
    let result = ReadKnp()
  }
  reader.readAsText(file)
}

let ReadKnp = (c) => {
    // dictionaryが入ったことを認識→ストレージも変える

    // csvを辞書に変換
  music = $.csv.toArrays(csv)

    // knp

    // 1.辞書の条件を配列かobjectとして定義しておく
    // 2.それをcsvの内容に入れ替える
    // 3.点数も表にする。

    // ヒットしたら点数加えてブレイク

    // 最後にその文がどの分類か判定

    // ストレージ名をわかりやすくし、分類ラベル名を文字列に変える

    // dictionaryが入ったことを認識→ストレージも変える

  let test4

  test4 = 1
}

let DefineHatsugen = (hatsugen, hatsugenNumber, RGB) => {
    // console.log(RGB);
  hatsugen[hatsugenNumber] = {
    sentences: [],
    group: null
  }
  if (!RGB[hatsugenNumber]) RGB[hatsugenNumber] = []
}
let DefineSentence = (hatsugen, hatsugenNumber, sentenceNumberInHatsugen, RGB, wholeSentenceNumber) => {
  hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen] = {
    kihonku: [],
    task: null,
    wholeSentenceNumber: wholeSentenceNumber,
    taskCountFromKihonku: {
      love: 0,
      work: 0,
      friend: 0
    },
    ClassifyTask: function (hatsugenNumber, sentenceNumberInHatsugen, loveDictionary, workDictionary, friendDictionary, RGB, resultArray) {
      resultArray[this.wholeSentenceNumber] = []

      console.log(this.kihonku)
      for (let kihonkuNumber = 0; kihonkuNumber < this.kihonku.length; kihonkuNumber++) {
        for (let wordsNumber = 0; wordsNumber < this.kihonku[kihonkuNumber].words.length; wordsNumber++) {
          resultArray[this.wholeSentenceNumber][0] += this.kihonku[kihonkuNumber].wordsGenbun[wordsNumber]
        }

        if (this.kihonku[kihonkuNumber].task != null && this.kihonku[kihonkuNumber].kakattekuruKuNumber != null && this.kihonku[kihonkuNumber].kakattekuruKuNumber != -1) {
          console.log('kihonkuNumber=%d,this.kihonku[kihonkuNumber].kakattekuruKuNumber=%d', kihonkuNumber, this.kihonku[kihonkuNumber].kakattekuruKuNumber)
          if (this.kihonku[this.kihonku[kihonkuNumber].kakattekuruKuNumber].task != null) {
            console.log('%s,%s,%s', resultArray[this.wholeSentenceNumber][0], this.kihonku[kihonkuNumber].task, this.kihonku[this.kihonku[kihonkuNumber].kakattekuruKuNumber].task)
            this.task = this.kihonku[this.kihonku[kihonkuNumber].kakattekuruKuNumber].task
            resultArray[this.wholeSentenceNumber][1] = this.task
            return 0
          }
        }
      }

      console.log('%s,love=%d,work=%d,friend=%d', resultArray[this.wholeSentenceNumber][0], this.taskCountFromKihonku.love, this.taskCountFromKihonku.work, this.taskCountFromKihonku.friend)

      if (this.taskCountFromKihonku.love > this.taskCountFromKihonku.work && this.taskCountFromKihonku.love > this.taskCountFromKihonku.friend) {
        this.task = 'love'
        RGB[hatsugenNumber][sentenceNumberInHatsugen][0] = 1
      } else if (this.taskCountFromKihonku.love < this.taskCountFromKihonku.friend && this.taskCountFromKihonku.work < this.taskCountFromKihonku.friend) {
        this.task = 'friend'
        RGB[hatsugenNumber][sentenceNumberInHatsugen][2] = 1
      } else if (this.taskCountFromKihonku.love < this.taskCountFromKihonku.work && this.taskCountFromKihonku.work > this.taskCountFromKihonku.friend) {
        this.task = 'work'
        RGB[hatsugenNumber][sentenceNumberInHatsugen][1] = 1
      } else {
        this.task = 'null'
      }

      resultArray[this.wholeSentenceNumber][1] = this.task
    }
  }
  console.log('wholeSentenceNumber=%d', wholeSentenceNumber)
  RGB[hatsugenNumber][sentenceNumberInHatsugen] = [3]
}
let DefineKihonku = (hatsugen, hatsugenNumber, sentenceNumberInHatsugen, kihonkuNumber) => {
    // console.log("hatsugenNumber=%d, sentenceNumber=%d",hatsugenNumber,sentenceNumberInHatsugen);
  hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber] = {
    words: [],
    wordsGenbun: [],
    kakattekuruKuNumber: null,
    kakariniikuKuNumber: null,
    task: null
  }
}

let ClassifyTaskOfWord = (hatsugen, hatsugenNumber, sentenceNumberInHatsugen, newLoveDictionary, newWorkDictionary, newFriendDictionary, kihonkuNumber, wordLookedNow) => {
  console.log(newLoveDictionary)
  if (newLoveDictionary[0].indexOf(wordLookedNow) != -1) {
    hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].taskCountFromKihonku.love++
    return 'love'
  } else if (newWorkDictionary[0].indexOf(wordLookedNow) != -1) {
    hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].taskCountFromKihonku.work++
    return 'work'
  } else if (newFriendDictionary[0].indexOf(wordLookedNow) != -1) {
    hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].taskCountFromKihonku.friend++
    return 'friend'
  }
}

let OrganizeKNP = (knpCsv, hatsugen, newLoveDictionary, newWorkDictionary, newFriendDictionary, RGB, resultArray) => {
  let kihonkuNumber = 0
  let sentenceNumberInHatsugen = 0
  let hatsugenNumber = 0
  let wholeSentenceNumber = 0

  DefineHatsugen(hatsugen, 0, RGB)
  DefineSentence(hatsugen, 0, 0, RGB, wholeSentenceNumber)
  wholeSentenceNumber++

  for (let KNP_csvRow = 0; KNP_csvRow < knpCsv.length; KNP_csvRow++) {
    if (knpCsv[KNP_csvRow][0] == '：') {
      console.log('TURNING')
      sentenceNumberInHatsugen = 0
      kihonkuNumber = 0
      hatsugenNumber++
      DefineHatsugen(hatsugen, hatsugenNumber, RGB)
      DefineSentence(hatsugen, hatsugenNumber, 0, RGB, wholeSentenceNumber)
      wholeSentenceNumber++
    } else if (knpCsv[KNP_csvRow][0] == 'EOS') {
      console.log('EOS')
            // ２周目解析を行う

      hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].ClassifyTask(hatsugenNumber, sentenceNumberInHatsugen, newLoveDictionary, newWorkDictionary, newFriendDictionary, RGB, resultArray)
      kihonkuNumber = 0
      sentenceNumberInHatsugen++
      DefineSentence(hatsugen, hatsugenNumber, sentenceNumberInHatsugen, RGB, wholeSentenceNumber)
      wholeSentenceNumber++
    } else if (judgeJapanese(knpCsv[KNP_csvRow][0]) == 1) {
      DefineKihonku(hatsugen, hatsugenNumber, sentenceNumberInHatsugen, kihonkuNumber)

      hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].kakattekuruKuNumber = ExtractNumber(knpCsv[KNP_csvRow - 1][1])

      hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].words[0] = knpCsv[KNP_csvRow][1]
      hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].wordsGenbun[0] = knpCsv[KNP_csvRow][0]

      hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].task = ClassifyTaskOfWord(hatsugen, hatsugenNumber, sentenceNumberInHatsugen, newLoveDictionary, newWorkDictionary, newFriendDictionary, kihonkuNumber, knpCsv[KNP_csvRow][1])

      KNP_csvRow++
      while (judgeJapanese(knpCsv[KNP_csvRow][0]) == 1) {
        hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].words += knpCsv[KNP_csvRow][1]
        hatsugen[hatsugenNumber].sentences[sentenceNumberInHatsugen].kihonku[kihonkuNumber].wordsGenbun += knpCsv[KNP_csvRow][0]
        KNP_csvRow++
      }
      KNP_csvRow--
      kihonkuNumber++
    }
  }
}
/*
let ClassifyTaskOfKihonku = (kihonku,kihonkuNumber) => {
    ClassifyTaskOfWord(kihonku[kihonkuNumber].words[0]);
};
*/

function judgeKakaruSide (kihonku, kakarareru) {
    // その丹後区にかかるものを判定
    // かかる側を優先する
    // if(係る側が愛か交友か仕事に分類されている){そっちを優先する}
  if (kihonku[kihonku[kakarareru].kakattekuruNumber].task != null) {
    kihonku[kakarareru].task = kihonku[kihonku[kakarareru].kakattekuruNumber].task
  }
}

// 日本語か否か判定　kimizuka.hatenablog.com/entry/2013/12/22/011458
function judgeJapanese (txt) {
  if (typeof txt !== 'string') {
    return false
  }

  var i = txt.length,
    escapeTxt

  while (i--) {
    escapeTxt = escape(txt.substring(i, i + 1))
    if (escapeTxt.length >= 6) {
      return true
    }
  }

  return false
}

function csv2Array (filePath) { // csvﾌｧｲﾙﾉ相対ﾊﾟｽor絶対ﾊﾟｽ
  var csvData = []
  var data = new XMLHttpRequest()
  data.open('GET', filePath, false) // true:非同期,false:同期
  data.send(null)
  var LF = String.fromCharCode(10) // 改行ｺｰﾄﾞ
  var lines = data.responseText.split(LF)
  for (var i = 0; i < lines.length; ++i) {
    var cells = lines[i].split(',')
    if (cells.length != 1) {
      csvData.push(cells)
    }
  }

    // csvData = TransposeMatrix(csvData);
  return csvData
}

function C (a, b, c) {
  a[c] = (a[c] || []).concat(b)
  return a
}

function B (a, b, c) {
  return b.reduce(C, a)
}

function TransposeMatrix (ary) {
  return ary.reduce(B, [])
}

let ExtractNumber = (originalText) => {
  let returnText
  returnText = parseInt(originalText, 10) // -123
    // qiita.com/simiraaaa/items/2fc2c10e041963fc34fc
  return returnText
}

let downloadResultAsCSV = (filename, hatsugen) => {
  let csv_array = []

  downloadAsCSV(filename, csv_array)
}

function downloadAsCSV (filename, csv_array) {
  let filenameWithExtension = filename + '.csv'

    // 配列をTAB区切り文字列に変換
  var csv_string = ''
  for (let i = 0; i < csv_array.length; i++) {
    console.log('i=%d', i)
    if (!csv_array[i] == 0) {
      for (let j = 0; j < csv_array[i].length; j++) {
        csv_string += csv_array[i][j]
        csv_string += ','
      }
    }

    csv_string += '\n'
  }

    // ファイル作成
  var blob = new Blob([csv_string], {
    type: 'text/csv'
  })

    // ダウンロード実行...(2)
  if (window.navigator.msSaveOrOpenBlob) {
        // IEの場合
    navigator.msSaveBlob(blob, filenameWithExtension)
  } else {
        // IE以外(Chrome, Firefox)
    var downloadLink = $('<a></a>')
    downloadLink.attr('href', window.URL.createObjectURL(blob))
    downloadLink.attr('download', filenameWithExtension)
    downloadLink.attr('target', '_blank')

    $('body').append(downloadLink)
    downloadLink[0].click()
    downloadLink.remove()
  }
}

export {ClassifyWithKNP}

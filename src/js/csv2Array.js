function csv2Array (filePath) { // csvﾌｧｲﾙﾉ相対ﾊﾟｽor絶対ﾊﾟｽ
  let csvData = []
  let data = new XMLHttpRequest()
  data.open('GET', filePath, false) // true:非同期,false:同期
  data.send(null)
  let LF = String.fromCharCode(10) // 改行ｺｰﾄﾞ
  let lines = data.responseText.split(LF)
  for (let i = 0; i < lines.length; ++i) {
    let cells = lines[i].split(',')
    if (cells.length !== 1) {
      csvData.push(cells)
    }
  }
  return csvData
}

export {csv2Array}

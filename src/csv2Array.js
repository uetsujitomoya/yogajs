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
  return csvData
}

export {csv2Array}

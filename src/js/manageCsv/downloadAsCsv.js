// この関数を実行するとCSVのDL画面に鳴る
import $ from 'jquery'

const downloadAsCSV = (filename, csv_array) => {
  let filenameWithExtension = filename + '.csv'

  // 配列をTAB区切り文字列に変換
  let csv_string = ''
  for (let i = 0; i < csv_array.length; i++) {
    csv_string += csv_array[i].join(',')
    csv_string += '\r\n'
  }

  // ファイル作成
  let blob = new Blob([csv_string], {
    type: 'text/csv'
  })

  // ダウンロード実行...(2)
  if (window.navigator.msSaveOrOpenBlob) {
    // IEの場合
    navigator.msSaveBlob(blob, filenameWithExtension)
  } else {
    // IE以外(Chrome, Firefox)
    let downloadLink = $('<a></a>')
    downloadLink.attr('href', window.URL.createObjectURL(blob))
    downloadLink.attr('download', filenameWithExtension)
    downloadLink.attr('target', '_blank')

    $('body').append(downloadLink)
    downloadLink[0].click()
    downloadLink.remove()
  }
}

export {downloadAsCSV}
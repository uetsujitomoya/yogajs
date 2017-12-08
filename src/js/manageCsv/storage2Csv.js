const storage2csv = () => {
  // var storage = localStorage; //http://hakuhin.jp/js/storage.html#STORAGE_00
  // ウェブストレージに対応している http://hakuhin.jp/js/storage.html#STORAGE_GET_KEYS
  // if(window.localStorage){
  // ------------------------------------------------------------
  // キーの総数を取得する
  // ------------------------------------------------------------
  var num = window.localStorage.length
  // ------------------------------------------------------------
  // ストレージからすべてのキーを取得する
  // ------------------------------------------------------------
  var i
  let csv_array = []
  for (i = 0; i < num; i++) {
    csv_array[i] = []
    // 位置を指定して、ストレージからキーを取得する
    csv_array[i][0] = window.localStorage.key(i)
    // ストレージからデータを取得する
    csv_array[i][1] = window.localStorage.getItem(csv_array[i][0])
    // 出力テスト
    console.log('name:' + csv_array[i][0] + ' value:' + csv_array[i][1])
  }
  console.log('csv_array')
  console.log(csv_array)
  // }
  // CSVに記載するデータ配列
  return csv_array
}

export{storage2csv}
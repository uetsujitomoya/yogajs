saveBunArrJson = (json) => {
  //手始めはファイルを作って、開いて、そこに文字を書き込むという一連の作業をしてみます。これが出来れば色々な中間データの生成に役立ちます。
  //JavaScript内でWSHを使ってファイルを扱うには「Scripting.FileSystemObject」というオブジェクトを作ります：

  let fs = WScript.CreateObject("Scripting.FileSystemObject");
  //この人がファイル操作を担当してくれます。

  //FileSystemObjectから新規のテキストファイルを作ってみます：

  let file = fs.CreateTextFile("bunArr.json");
  //FileSystemObject.CreateTextFileメソッドの第1引数にファイル名を与えると新しいテキストファイルがさくっとできます。ちなみに、戻り値の型はTextStreamクラスです。このファイルに文字を書き込むには、

  file.Write(json);
  //とWriteメソッドを呼び出します。非常に簡単です。開いたファイルは必ず閉じます：

  file.Close();
  //基本はこれだけ。異常に簡単です。
}
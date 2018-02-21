//http://www.hp-stylelink.com/news/2014/08/20140826.php

function getCSVFile() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    fromCsvTxt2Arr(xhr.responseText);
  };

  xhr.open("get", "csv_test_file.csv", true);
  xhr.send(null);
}

function createXMLHttpRequest() {
  var XMLhttpObject = null;
  XMLhttpObject = new XMLHttpRequest();
  return XMLhttpObject;
}

function fromCsvTxt2Arr(csvTxt) {
  var tempArray = csvTxt.split("\n");
  var csvArr = new Array();
  for(var i = 0; i<tempArray.length;i++){
    csvArr[i] = tempArray[i].split(",");
  }
  console.log(csvArr);
  return csvArr
}

export {getCSVFile,fromCsvTxt2Arr}
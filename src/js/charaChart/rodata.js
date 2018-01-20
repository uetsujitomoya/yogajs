const rodata={
  bunsetsuSymbol:'*',
  kihonkuSymbol:'+',
  bunsetsu1stJpRowNo:2,
  kihonku1stJpRowNo:1,

  knpSurfaceFormColNo:0,
  knpBasicFormColNo:2,
  knpPOSFormColNo:3,

  yajirushi_refX : 8,
  refY:2,
  markerFillColor : '#ff0000',

  clientNodeColor:"#ff7f7f",
  aroundClientPeopleNodeColor:"#696969",
  charaNameColor:"#0000cd",

  clientArrowColor:"#a9a9a9",
  aroundClientPeopleArrowColor:"#a9a9a9",
  kawaisounaClientArrowColor:"#a9a9a9",
  situationDependencyPeopleColor:"#a9a9a9",
  //clientArrowColor:"#ff4242",
  //aroundClientPeopleArrowColor:"#a9a9a9",
  //kawaisounaClientArrowColor:"#4242ff",
  //situationDependencyPeopleColor:"#42ff42",

  nodeR : 15,
  orbitR :250,
  orbitOY:400,
  orbitOX:300,
  svgWidth:600,
  svgHeight:700,

  textViewFontSize:2,

  knpCsvFolder:"./csv/knp/",
  knpCsvName:"171101allForCC",//bunArrをbunArrCsvに任せる場合でも、登場人物はknpCsvから取得
  //csvPath: this.knpCsvFolder+this.knpCsvName+".csv",

  bunArrCsvFolder:"./csv/bunArr/",
  bunArrCsvName:"2018116195_171101allForCC_withPeople_edited.csv",
  withPeople:true,

  charaChartAreaID : '#example',
  circleRadiusCoefficient: 1.5,

  boxBorderColor: "#696969",
  circleFill: "#e6e6e6",


  viewMarkEnd:false,

  isOnlyViz:false,
  isSingleSlider:true,
  singleSliderSelectLen:200,

  checkBoxCommentOut:true,
  arrow:{
    gap:10
  }
}

export {rodata}
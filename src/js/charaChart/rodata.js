const color={
  vivid:{
    green:"#019352",
    red:"#e8003e",
    blue:"#01509d",
    orange:"#fc9907",
    purple:"#473b85"
  },
  bright:{
    green:"#29a7a3"
  }
}

const rodata={
  bunsetsuSymbol:'*',
  kihonkuSymbol:'+',
  bunsetsu1stJpRowNo:2,
  kihonku1stJpRowNo:1,

  knpSurfaceFormColNo:0,
  knpBasicFormColNo:2,
  knpPOSFormColNo:3,

  yajirushi_refX : 55,
  refY:12,
  markerWitdh:48,
  markerHeight:48,
  markerPath:'M 0,0 V 24 L24,12 Z',

  markerFillColor : '#ff0000',

  clientNodeColor:"#ff7f7f",
  aroundClientPeopleNodeColor:"#696969",
  charaNameColor:color.bright.green,

  clientArrowColor:color.vivid.red,
  aroundClientPeopleArrowColor:"#000000",
  kawaisounaClientArrowColor:color.vivid.blue,
  situationDependencyPeopleColor:color.vivid.green,
  //clientArrowColor:"#ff4242",
  //aroundClientPeopleArrowColor:"#a9a9a9",
  //kawaisounaClientArrowColor:"#4242ff",
  //situationDependencyPeopleColor:"#42ff42",
  circleFontSize:"15px",

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


  viewMarkEnd:true,

  isOnlyViz:false,
  isSingleSlider:true,
  singleSliderSelectLen:200,

  checkBoxCommentOut:true
}

export {rodata}
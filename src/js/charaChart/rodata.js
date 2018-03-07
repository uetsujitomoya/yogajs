//【認知の修正】具体的数値・色などを決める

const color={
  vivid:{
    green:"#019352",
    red:"#e8003e",
    garnet:"#b40059",
    blue:"#01509d",
    orange:"#fc9907",
    purple:"#473b85"
  },
  bright:{
    green:"#29a7a3"
  },
  light:{
    pink:"#f7aaa0",
    emerald:"#82c4b8",
    blue:"#6bb7d1"
  }
}

const charaChartRodata={
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

  clientNodeColor:color.light.pink,
  aroundClientPeopleNodeColor:color.light.blue,
  charaNameColor:"#000000",

  clientArrowColor:color.vivid.garnet,
  aroundClientPeopleArrowColor:color.vivid.orange,
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

  txtViewFontSize:2,

  knpCsvFolder:"./csv/knp/",
  knpCsvName:"171211dummyForCC",//bunArrをbunArrCsvに任せる場合でも、登場人物はknpCsvから取得
  //csvPath: this.knpCsvFolder+this.knpCsvName+".csv",

  bunArrCsvFolder:"./csv/bunArr/consideringCircle/",
  bunArrCsvName:"2018220108_171211dummyForCC_withPeople_consideringCircle.csv",
  withPeople:true,

  charaChartAreaID : '#example',
  circleRadiusCoefficient: 1.5,

  boxBorderColor: "#696969",
  circleFill: "#e6e6e6",

  viewMarkEnd:true,

  isOnlyViz:false,
  isSingleSlider:true,
  singleSliderSelectLen:20,

  checkBoxCommentOut:true,

  isFizedArrowWigth:true,

  nodeCnt:0,

  sliderBarChart:{
    fullW:600,
    h:50,
    id:"#sliderbarchart",
    axisShiftX:58,
    chartShiftX:85
  }
}

export {charaChartRodata}
const roColorSet={
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
  },
  boxBorderColor:"#696969"
}

const setting={
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

  clientNodeColor:roColorSet.light.pink,
  aroundClientPeopleNodeColor:roColorSet.light.blue,
  charaNameColor:"#000000",

  clientArrowColor:roColorSet.vivid.garnet,
  aroundClientPeopleArrowColor:roColorSet.vivid.orange,
  kawaisounaClientArrowColor:roColorSet.vivid.blue,
  situationDependencyPeopleColor:roColorSet.vivid.green,
  //clientArrowColor:"#ff4242",
  //aroundClientPeopleArrowColor:"#a9a9a9",
  //kawaisounaClientArrowColor:"#4242ff",
  //situationDependencyPeopleColor:"#42ff42",
  circleFontSize:"15px",

  nodeR : 30,
  orbitR :250,
  orbitOY:400,
  orbitOX:300,
  svgWidth:600,
  svgHeight:700,
  isFixedCircleR:true,

  txtViewFontSize:2,

  knpCsvFolder:"./csv/knp/",
  knpCsvName:"171211dummyForCC",//bunArrをbunArrCsvに任せる場合でも、登場人物はknpCsvから取得
  //csvPath: this.knpCsvFolder+this.knpCsvName+".csv",

  bunArrCsvFolder:"./csv/bunArr/",
  bunArrCsvName:"201712211623_171114allKnp_withPeople_edited.csv",
  withPeople:true,

  charaChartAreaID : '#example',
  circleRadiusCoefficient: 1.5,

  boxBorderColor: "#696969",
  circleFill: "#e6e6e6",

  isViewedMarkEnd:true,

  isOnlyViz:false,
  isSingleSlider:true,
  singleSliderSelectLen:200,

  isCheckBoxCommentOut:true,

  isFixedArrowWidth:true,
  fixedArrowWidth:5,

  quiz:{
    path:"./csv/quiz/180203lavEvaTutorialOnlyNo.csv",
    quizNoCol:0,
    knpCsvCol:1,
    bunArrCsvCol:2,
    isFixedCol:3,
    isColoredCol:4,
    isArrowCol:5,
    queStartBunNoCol:6,
    choiceStartCol:7,
    csvTrue:"TRUE"
  },
  nodeCnt:0,

  boxInBoxWidth:"240px"

}

export {setting,roColorSet}
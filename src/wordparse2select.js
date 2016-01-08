
var wordparse2select = (keitaisokaiseki, miserables) => {

  var m,i,j;
  var tmp=[];
  var tangoset = new Set();
  var tangosett = [];

  for(m=0;m<keitaisokaiseki.length;++m){
    for(i=0;i<keitaisokaiseki[m].length;++i){
      tmp = keitaisokaiseki[m][i];
      if(keitaisokaiseki[m][i] ==false||keitaisokaiseki[m][i]==[]){
        keitaisokaiseki[m][i].length=0;
        continue;
      }
      for(j=0;j<tmp.length;++j){
        tangoset.add({name:keitaisokaiseki[m][i][j],
          group:0
        });//tangoset終了
      }
    }
  }
  tangosett = Array.from(tangoset).map(function(t) {
    return {t};
  });

  for(i=0;i<tangosett.length;i++){
    miserables.nodes[i]=tangosett[i].t;
  }
};

export {wordparse2select};

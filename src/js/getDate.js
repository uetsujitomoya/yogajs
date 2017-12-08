//今日の日付データを変数hidukeに格納
const hiduke=new Date();

//年・月・日・曜日を取得する
const year = hiduke.getFullYear();
const month = hiduke.getMonth()+1;
const week = hiduke.getDay();
const day = hiduke.getDate();
const yobi = new Array("日","月","火","水","木","金","土");
const hour = hiduke.getHours()+1;
const minite = hiduke.getMinutes()


//document.write("西暦"+year+"年"+month+"月"+day+"日 "+yobi[week]+"曜日");

const today = ""+year+month+day
const now = ""+today+hour+minite

export{year,month,week,day,yobi,today,now}
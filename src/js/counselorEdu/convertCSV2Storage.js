import {csv2Arr} from '../manageCsv/csv2Arr.js'
import {TransposeMatrix} from './transposeMatrix.js'

let convertCSV2Storage = (jsonName, storage) => {
  let storageArrayFromKamata = csv2Arr('csv/storage170421fromKamata.csv')
    // objectの書いてあるところを確認

    // let storageTransposeArrayFromKamata=TransposeMatrix(storageArrayFromKamata);

  let answerNumber
  let questionNumber

    // storage構造を把握

    // 1列目に一致したら2列目に変える

  let colNumber = 0

  storageArrayFromKamata.forEach((col) => {
    storage.setItem(col[0], col[1])
  })

    /*
    for(let i = radio.length-3, l = radio.length; i < l; i++){
        //console.log("i=%d",i);
        //console.log(radio[i]);
        if(radio[i].control.checked==true){
            if(radio[i].control.value=="1"){
                checked[taiou[c-1]] =1;
                storage.setItem(changedAnswerClassificationSaveTarget, 0);
                break;
            }else if(radio[i].control.value=="2"){
                checked[taiou[c-1]] =2;
                storage.setItem(changedAnswerClassificationSaveTarget, 1);
                break;
            }else if(radio[i].control.value=="3"){
                checked[taiou[c-1]] =3;
                storage.setItem(changedAnswerClassificationSaveTarget, 2);
                break;
            }
        }else{
            checked[taiou[c-1]] =0;
            storage.setItem(changedAnswerClassificationSaveTarget, 9);//未分類
        }
    }
    //storageにつっこむ

    for(c=1;c<=chboxlength2;c++){
        const radio = document.getElementById("rs"+c).children;
        for(let i = radio.length-5, l = radio.length; i < l; i++){

            if(radio[i].control.checked==true){
                //storage.getItem(name+"RGBlist"+m)=
                if(radio[i].control.value=="3"){
                    checked2[taiou[c-1]] =3;
                    storage.setItem(name+"RGBlist"+c, 3);
                    break;
                }
                if(radio[i].control.value=="4"){
                    checked2[c-1] =4;
                    storage.setItem(name+"RGBlist"+c, 4);
                    break;
                }
                if(radio[i].control.value=="5"){
                    checked2[c-1] =5;
                    storage.setItem(name+"RGBlist"+c, 5);
                    break;
                }
                if(radio[i].control.value=="6"){
                    checked2[c-1] =6;
                    storage.setItem(name+"RGBlist"+c, 6);
                    break;
                }
            }else{
                checked2[c-1] =7;
                storage.setItem(name+"RGBlist"+c, 7);
            }
        }
        if(checked2[c-1]==7){
            black++;
        }
    }
    */
}

let convertCSV2Object = () => {
// CSV読む

    // Objectに変える
}

let applyObjectForStorage = () => {

}

export {convertCSV2Storage}

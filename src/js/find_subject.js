/**
 * Created by uetsujitomoya on 2017/08/21.
 */

let find_subject = (verb_num,sentence_array) => {
    //ガ格、ハ格
    //bunsetsuに付加情報として追加

    for(let col_num=0;col_num<row.length;col_num++){
        if ( row[col_num].match("ガ格")) {
            bunsetsu.isSubject=true
            bunsetsu.subject=raw_2d_array[1][0]
            break;
        }
    }

}

export {find_subject}
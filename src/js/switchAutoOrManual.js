/**
 * Created by uetsujitomoya on 2017/06/03.
 */

let switchAutoOrManual = () => {
    let signal = "blue";

    switch (signal) {
        case "red":
            readJsonAutomatically();
            break;
            /*
        case "green":
        case "blue":
            console.log("go!");
            break;
        case "yellow":
            console.log("slow down!");
            break;*/
        default:
            readJsonManually();
            break;
    }

};

let readJsonAutomatically=()=>{

};

let readJsonManually=()=>{

};
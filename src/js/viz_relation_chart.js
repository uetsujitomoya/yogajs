/**
 * Created by uetsujitomoya on 2017/08/07.
 */

let viz_relation_chart = () => {
    //viz_circle();
    //viz_arrow();
}

let viz_circle = (times,isClient,text) => {
    fix_circle_width(times);
    fix_circle_radius();
    fix_circle_color(isClient);
    fix_circle_text(text);
    fix_circle_x();
    fix_circle_y();
}

let viz_arrow = (times,isClient) => {
    fix_arrow_width(times);
    fix_arrow_length();
    fix_arrow_color(isClient);
    fix_arrow_start();
    fix_arrow_end();
}

export{viz_relation_chart}
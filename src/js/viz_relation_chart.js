/**
 * Created by uetsujitomoya on 2017/08/07.
 */

let viz_relation_chart = () => {
    viz_circle();
    viz_arrow();
}

let viz_circle = () => {
    fix_circle_width();
    fix_circle_radius();
    fix_circle_color();
    fix_circle_text();
}

let viz_arrow = () => {
    fix_arrow_width();
    fix_arrow_length();
    fix_arrow_color();
}

export{viz_relation_chart}
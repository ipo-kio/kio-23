import {cssEngine} from "../cssEngine/cssEngine";
//props: link, context, css, shift
function circleRender(props){
    const style = cssEngine({
        css: props.css,
        classes: props.link.classList,
        type: props.link.type,
        ownStyle: props.link.style,
    });
    if(!(style.visibility === "hidden")){
        if(style.border){
            props.context.beginPath();
            props.context.fillStyle = style.border.color;
            props.context.arc(props.link.start.x + props.shift.x, props.link.start.y + props.shift.y, style.radius + style.border.width, style.startAngle, style.endAngle);
            props.context.fill();
        }
        props.context.beginPath();
        props.context.fillStyle = style.color;
        props.context.arc(props.link.start.x + props.shift.x, props.link.start.y + props.shift.y, style.radius, style.startAngle, style.endAngle);
        props.context.fill();
    }
}

export default circleRender;
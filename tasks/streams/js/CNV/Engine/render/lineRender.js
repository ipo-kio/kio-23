import {cssEngine} from "../cssEngine/cssEngine";
import {moveTo} from "../geometry/geometry";
import CNV from "../../library";

//props: link, css, context, shift
function lineRender(props){
    const style = cssEngine({
        css: props.css,
        classes: props.link.classList,
        type: props.link.type,
        ownStyle: props.link.style,
    });

    let x1 = (props.link.start.x + props.shift.x) / props.zoom;
    let x2 = (props.link.end.x + props.shift.x) / props.zoom;
    let xCheck = (props.link.check.x + props.shift.x) / props.zoom;

    let y1 = (props.link.start.y + props.shift.y) / props.zoom;
    let y2 = (props.link.end.y + props.shift.y) / props.zoom;
    let yCheck = (props.link.check.y + props.shift.y) / props.zoom;

    if(!(style.visibility === "hidden")){
        //console.log("style.dashOffset", style.dashOffset);
        if(style.dash){
            props.context.setLineDash([6, 10]);
        } else {
            props.context.setLineDash([]);
        }

        if(!props.link.pointer){
            if(style.border){
                props.context.beginPath();
                props.context.moveTo(x1, y1);
                props.context.quadraticCurveTo(
                    xCheck,
                    yCheck,
                    x2,
                    y2,
                );

                props.context.lineWidth = style.lineWidth + style.border.width;
                props.context.strokeStyle = style.border.color; //config.color;
                props.context.stroke();
            }

            props.context.beginPath();
            props.context.moveTo(x1, y1);
            props.context.quadraticCurveTo(
                xCheck,
                yCheck,
                x2,
                y2,
            );

            props.context.lineWidth = style.lineWidth;
            props.context.strokeStyle = style.color; //config.color;
            props.context.stroke();
        }else if(props.link.pointer && props.link.start.x === props.link.check.x && props.link.start.y === props.link.check.y){
            props.context.beginPath();
            props.context.moveTo(x1, y1);
            const shape = CNV.getElementByUniqueId(props.link.id);
            const equation = shape.system.equation;
            const endPosition = moveTo(equation, -5);
            props.context.lineTo(endPosition.x + props.shift.x, endPosition.y + props.shift.y);
            props.context.lineWidth = style.lineWidth;
            props.context.strokeStyle = style.color; //config.color;
            props.context.stroke();
        } else {
            props.context.beginPath();
            props.context.moveTo(x1, y1);
            // props.context.quadraticCurveTo(props.link.check.x, props.link.check.y, props.link.end.x, props.link.end.y);
            // props.context.lineWidth = style.lineWidth;
            // props.context.strokeStyle = style.color; //config.color;
            // props.context.stroke();

            props.context.quadraticCurveTo(
                props.link.check.x + props.shift.x,
                props.link.check.y + props.shift.y,
                props.link.end.x + props.shift.x,
                props.link.end.y + props.shift.y,
            );

            props.context.lineWidth = style.lineWidth;
            props.context.strokeStyle = style.color; //config.color;
            props.context.stroke();
        }

    }
}

export default lineRender;
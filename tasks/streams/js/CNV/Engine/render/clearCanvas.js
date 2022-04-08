//props: context, canvas, backgroundColor
function clearCanvas(props){
    props.context.clearRect(0, 0, props.canvas.width, props.canvas.height);
}

export default clearCanvas;

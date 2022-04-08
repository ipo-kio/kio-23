export default function mousePosition(evt) {
    let rect = canvas.getBoundingClientRect(); // abs. size of element
    let scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
    let scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    return [
        (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    ];
}

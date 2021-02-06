/**
 * Handle height for ellipse
 */
var ellipseHeight = (function () {
    let elemId = document.getElementById('ellipse-height');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * When mouse id pressed handle the action
     * 
     * @param {*} e is the mouse event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', ellipseHeight.elementDrag);
        body.addEventListener('mouseup', ellipseHeight.closeDrag);
    }

    /**
    * Handle the action, When mouse is dragged
    * 
    * @param {*} e is the event
    */
    function elementDrag(e) {
        mouseObject.elementDrag(e, 'ellipse', 'ellipse-height');// need to create for section also
        elemId.style.border = "1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * Close the mouse drag
     * @param {*} e 
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', ellipseHeight.elementDrag);
        body.removeEventListener('mouseup', ellipseHeight.closeDrag);
        elemId.style.border = "none";
        mouseObject.closeDrag();
    }

    /**
     * On click remove the event listener for mouse down
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', ellipseHeight.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', ellipseHeight.dragMouseDown);
        }
    }

    /**
     * Increase the value.
     */
    function increaseValue() {
        let value = parseInt(elemId.value) + 1;
        elemId.value = value > 1000 ? 1000 : value;
        ellipseInspector.setHeight();
    }

    /**
     * Decrease the value
     */
    function decreaseValue() {
        let value = parseInt(elemId.value) - 1;
        elemId.value = value < 0 ? 0 : value;
        ellipseInspector.setHeight();
    }

    return {
        dragMouseDown: dragMouseDown,
        elementDrag: elementDrag,
        closeDrag: closeDrag,
        onClick: onClick,
        increaseValue: increaseValue,
        decreaseValue: decreaseValue
    }

})();
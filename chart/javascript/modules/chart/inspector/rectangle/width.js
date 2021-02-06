/**
 * Handle rectangle width
 */
var rectangleWidth = (function () {
    let elemId = document.getElementById('rectangle-width');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * When mouse id pressed handle the action
     * 
     * @param {*} e is the mouse event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', rectangleWidth.elementDrag);
        body.addEventListener('mouseup', rectangleWidth.closeDrag);
    }

    /**
    * Handle the action, When mouse is dragged
    * 
    * @param {*} e is the event
    */
    function elementDrag(e) {
        mouseObject.elementDrag(e, 'rectangle', 'rectangle-width');// need to create for section also
        elemId.style.border = "1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * Close the mouse drag
     * @param {*} e 
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', rectangleWidth.elementDrag);
        body.removeEventListener('mouseup', rectangleWidth.closeDrag);
        elemId.style.border = "none";
        mouseObject.closeDrag();
    }

    /**
     * On click remove the event listener for mouse down
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', rectangleWidth.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', rectangleWidth.dragMouseDown);
        }
    }

    /**
     * Increase the value.
     */
    function increaseValue() {
        let value = parseInt(elemId.value) + 1;
        elemId.value = value > 1000 ? 1000 : value;
        rectangleInspector.setWidth();
    }

    /**
     * Decrease the value
     */
    function decreaseValue() {
        let value = parseInt(elemId.value) - 1;
        elemId.value = value < 0 ? 0 : value;
        rectangleInspector.setWidth();
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
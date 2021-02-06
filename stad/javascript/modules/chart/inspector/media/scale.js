/**
 * Handles scale properties for media component
 */
var mediaScale = (function () {
    let elemId = document.getElementById('image-scale');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * When mouse id pressed handle the action
     * 
     * @param {*} e is the mouse event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', mediaScale.elementDrag);
        body.addEventListener('mouseup', mediaScale.closeDrag);
    }

    /**
    * Handle the action, When mouse is dragged
    * 
    * @param {*} e is the event
    */
    function elementDrag(e) {
        mouseObject.elementDrag(e, 'media', 'media-scale');// need to create for section also
        elemId.style.border = "1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * Close the mouse drag
     * @param {*} e 
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', mediaScale.elementDrag);
        body.removeEventListener('mouseup', mediaScale.closeDrag);
        elemId.style.border = "none";
        mouseObject.closeDrag();
    }

    /**
     * On click remove the event listener for mouse down
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', mediaScale.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', mediaScale.dragMouseDown);
        }
    }

    /**
     * Increase the value.
     */
    function increaseValue() {
        let value = parseInt(elemId.value) + 1;
        elemId.value = value > 200 ? 200 : value;
        mediaInspector.setScale();
    }

    /**
     * Decrease the value
     */
    function decreaseValue() {
        let value = parseInt(elemId.value) - 1;
        elemId.value = value < 0 ? 0 : value;
        mediaInspector.setScale();
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
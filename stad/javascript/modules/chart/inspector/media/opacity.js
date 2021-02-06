/**
 * Handles opacity for media component
 */
var mediaOpacity = (function () {
    let elemId = document.getElementById('image-opacity');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * When mouse id pressed handle the action
     * 
     * @param {*} e is the mouse event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', mediaOpacity.elementDrag);
        body.addEventListener('mouseup', mediaOpacity.closeDrag);
    }

    /**
    * Handle the action, When mouse is dragged
    * 
    * @param {*} e is the event
    */
    function elementDrag(e) {
        mouseObject.elementDrag(e, 'media', 'media-opacity');// need to create for section also
        elemId.style.border = "1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * Close the mouse drag
     * @param {*} e 
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', mediaOpacity.elementDrag);
        body.removeEventListener('mouseup', mediaOpacity.closeDrag);
        elemId.style.border = "none";
        mouseObject.closeDrag();
    }

    /**
     * On click remove the event listener for mouse down
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', mediaOpacity.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', mediaOpacity.dragMouseDown);
        }
    }

    /**
     * Increase the value.
     */
    function increaseValue() {
        let value = parseInt(elemId.value) + 1;
        elemId.value = value > 100 ? 100 : value;
        mediaInspector.setOpacity();
    }

    /**
     * Decrease the value
     */
    function decreaseValue() {
        let value = parseInt(elemId.value) - 1;
        elemId.value = value < 0 ? 0 : value;
        mediaInspector.setOpacity();
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
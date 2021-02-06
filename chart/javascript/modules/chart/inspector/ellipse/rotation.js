/**
 * Handle ellipse rotation
 */
var ellipseRotation = (function () {

    let elemId = document.getElementById('ellipse-label-rotation');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * Drag the mouse down
     * 
     * @param {*} e is the event 
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', ellipseRotation.elementDrag);
        body.addEventListener('mouseup', ellipseRotation.closeDrag);
    }

    /**
     * Drag the element 
     * 
     * @param {*} e 
     */
    function elementDrag(e) {
        mouseObject.elementDrag(e,'ellipse','ellipse-rotation');
        elemId.style.border="1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * Close the drag 
     * 
     * @param {*} e is the mouse event
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', ellipseRotation.elementDrag);
        body.removeEventListener('mouseup', ellipseRotation.closeDrag);
        elemId.style.border="none";
        mouseObject.closeDrag();
    }
    
    /**
     * On Click of mouse change the input value.
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', ellipseRotation.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', ellipseRotation.dragMouseDown);
        }
    }

    /**
     * Increase the value.
     */
    function increaseValue(){
        elemId.value = (parseInt(elemId.value)+1)%(360);
        ellipseInspector.setRotation();
    }

    /**
     * Decrease the value
     */
    function decreaseValue(){
       
        let value = elemId.value;
        value = parseInt(value.replace(/\D/g, '')) - 1;
        elemId.value = value<0?(360+value):value;
        ellipseInspector.setRotation();
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
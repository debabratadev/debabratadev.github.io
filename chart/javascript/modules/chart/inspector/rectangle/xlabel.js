/**
 * Handles x position for rectangle label
 */
var rectangleXLabel= (function () {

    let elemId = document.getElementById('rectangle-label-x');
    let body = document.getElementById('body');
    let mouseObject;

    /**
     * Action to perform when mouse is pressed down
     * 
     * @param {*} e is the event
     */
    function dragMouseDown(e) {

        mouseObject = inspectorModule.initialiseClickObject(elemId, e);

        body.addEventListener('mousemove', rectangleXLabel.elementDrag);
        body.addEventListener('mouseup', rectangleXLabel.closeDrag);

    }

    /**
     * Action to perform when element is dragged
     * 
     * @param {*} e is the event
     */
    function elementDrag(e) {
        mouseObject.elementDrag(e,'rectangle','rectangle-label-x');
        elemId.style.border="1px solid #0000FF";
        elemId.style.borderRadius = '1%';
    }

    /**
     * close the drag 
     * @param {*} e is the mouse event
     */
    function closeDrag(e) {
        body.removeEventListener('mousemove', rectangleXLabel.elementDrag);
        body.removeEventListener('mouseup', rectangleXLabel.closeDrag);
        elemId.style.border="none";
        mouseObject.closeDrag();
    }

    /**
     * Handles on click event for the mouse
     */
    function onClick() {

        if (elemId.onmousedown) {
            elemId.removeEventListener('mousedown', rectangleXLabel.dragMouseDown);
        }
        else {
            elemId.addEventListener('mousedown', rectangleXLabel.dragMouseDown);
        }
    }

    /**
     * Increases the value
     */
    function increaseValue(){
        let value = elemId.value;
        value.trim(" ");
        value= value.split(" ");
        value = parseInt(value[0]);
        elemId.value = (value-1)>50?50:value+1;
        elemId.value+=' %';
        rectangleInspector.setPositionX();
    }

    /**
     * Decreases the value
     */
    function decreaseValue(){
        let value = elemId.value;
        value.trim(" ");
        value = value.split(" ");
        value = parseInt(value[0]);
        elemId.value =(value-1)<-50?-50:value-1;
        elemId.value+=' %';
        rectangleInspector.setPositionX();
    }
    return {
        dragMouseDown: dragMouseDown,
        elementDrag: elementDrag,
        closeDrag: closeDrag,
        onClick: onClick,
        increaseValue: increaseValue,
        decreaseValue:decreaseValue
    }

})();
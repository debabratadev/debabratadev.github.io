/**
 * Handles selector drag on mouse down
 */
var selectorDragOnMouseDown = (function () {

    /**
     * Handles section drag on mouse down
     * 
     * @param {*} currentObject 
     */
    function sectionDragOnMouseDown(currentObject, sectionComponent) {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(sectionComponent);
        if (currentObject) {
            updateObject(currentObject);
            selector = { type: 'selector', level: 'section', action: 'drag', drag: true, rotate: false };
            handleSelection(selector);
        }
    }

    /**
     * Handles the dragging of rows while mouse is down
     */
    function rowDragOnMouseDown(currentObject, seatRowComponent) {

        if (!isInsideRectangle()) {
            return;
        }

        sharedComponent.componentDragOnMouseDown(seatRowComponent);
        let object = currentObject;

        if (object) {
            selector = { type: 'selector', level: 'row', action: 'drag', drag: true, rotate: false };
            updateObject(object);

            handleSelection(selector);
        }
    }

    /**
     * Handle matrix drag on mouse down
     */
    function matrixDragOnMouseDown(currentObject, matrixRowComponent) {

        if (!isInsideRectangle()) {
            return;
        }
        sharedComponent.componentDragOnMouseDown(matrixRowComponent);
        if (currentObject) {
            updateObject(currentObject);
            selector = { type: 'selector', level: 'matrix', action: 'drag', drag: true, rotate: false };
            handleSelection(selector);
        }
    }

    /**
     * handles text drag on mouse down
     */
    function textDragOnMouseDown(currentObject,textComponent) {

        if (!isInsideRectangle()) {
            return;
        }
        sharedComponent.componentDragOnMouseDown(textComponent);
        if (currentObject) {
            updateObject(currentObject);
            selector = { type: 'selector', level: 'text', action: 'drag', drag: true, rotate: false };
            handleSelection(selector);

        }
    }

      /**
     * handles text drag on mouse down
     */
    function mediaDragOnMouseDown(currentObject,mediaComponent) {

        if (!isInsideRectangle()) {
            return;
        }
        sharedComponent.componentDragOnMouseDown(mediaComponent);
        if (currentObject) {
            updateObject(currentObject);
            selector = { type: 'selector', level: 'media', action: 'drag', drag: true, rotate: false };
            handleSelection(selector);
        }
    }

    /**
     * Handle poly shape drag on mouse down 
     */
    function rectShapeDragOnMouseDown(currentObject,rectShapeComponent) {

        if(!isInsideRectangle()){
            return;
        }
        sharedComponent.componentDragOnMouseDown(rectShapeComponent);
        if (currentObject) {
            updateObject(currentObject);
            selector = { type: 'selector', level: 'rectangle', action: 'drag', drag: true, rotate: false };
            handleSelection(selector);
        }
    }

    /**
     * Handle poly shape drag on mouse down here
     */
    function polyShapeDragOnMouseDown(currentObject,polyShapeComponent) {

        if(!isInsideRectangle()){
            return;
        }
        sharedComponent.componentDragOnMouseDown(polyShapeComponent);
        if (currentObject) {
            updateObject(currentObject);
            selector = { type: 'selector', level: 'polygon', action: 'drag', drag: true, rotate: false };
            handleSelection(selector);
        }
    }

    /**
     * Handle ellipse shape drag in  mouse down
     */
    function ellipseShapeDragOnMouseDown(currentObject,ellipseShapeComponent) {

        if(!isInsideRectangle()){
            return;
        }
        sharedComponent.componentDragOnMouseDown(ellipseShapeComponent);
        if (currentObject) {
            updateObject(currentObject);
            selector = { type: 'selector', level: 'ellipse', action: 'drag', drag: true, rotate: false };
            handleSelection(selector);
        }
    }

    /**
     * Check whether the point lies inside the rectangle or not
     * 
     * @param {*} rectangleArray hold the corrdinate of rectanle
     * @param {*} currX 
     * @param {*} currY 
     */
    function isInsideRectangle() {
        return mainModule.isInsideRectangle();
    }

    /**
     * Update the object property 
     * 
     * @param {*} object    holds the current object
     */
    function updateObject(object) {
        mainModule.updateSelectedObject(object);
    }

    /**
     * Handle selection
     * 
     * @param {*} selector 
     */
    function handleSelection(selector) {
        mainModule.setSelector(selector);
    }

    return {
        sectionDragOnMouseDown: sectionDragOnMouseDown,
        rowDragOnMouseDown: rowDragOnMouseDown,
        matrixDragOnMouseDown: matrixDragOnMouseDown,
        textDragOnMouseDown:textDragOnMouseDown,
        rectShapeDragOnMouseDown:rectShapeDragOnMouseDown,
        polyShapeDragOnMouseDown:polyShapeDragOnMouseDown,
        ellipseShapeDragOnMouseDown:ellipseShapeDragOnMouseDown,
        mediaDragOnMouseDown:mediaDragOnMouseDown,
        isInsideRectangle: isInsideRectangle
    }

})(); 
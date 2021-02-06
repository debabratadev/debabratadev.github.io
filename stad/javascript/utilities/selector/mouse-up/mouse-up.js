/**
 * Handle component selection on mouse up
 */
var componentSelectorOnMouseUp = (function () {

    let component;
    let selector;
    let currentObject;
    let mouse;

    /**
     * Update variable for selector on mouse up 
     * 
     * @param {*} selector      is the component selector
     * @param {*} currentObject is the current object
     * @param {*} mouse         is the mouse object 
     */
    function updateVariable(object, matrix, mouseCord, event) {
        currentMatrixrow = matrix;
        component = mainModule.getComponent();

        currentObject = object;
        mouse = mouseCord;
        mouseBtn = event.button;
    }

    /**
     * Branches according to type
     * 
     * @param {*} selector 
     */
    function select(componentSelector) {

        selector = componentSelector;

        switch (selector.type) {
            case 'creator':
                break;
            case 'selector': selectorOnMouseUp();
                break;
            case 'node': nodeOnMouseUp();
                break;
            case 'seat': seatOnMouseUp();
                break;
            case 'shape': shapeOnMouseUp();
                break;
        }
    }

    /**
     * Hadles selection for the selector
     */
    function selectorOnMouseUp() {
        selectionOnMouseUp();
        handleMatrixOnMouseUp();
        // mainModule.selectObject();
    }

    /**
    * Handle seat on mouse up
    */
    function seatOnMouseUp() {
        handleSeatOnMouseUp();
    }

    /**
     * Shape on mouse up
     */
    function shapeOnMouseUp() {
        switch (selector.level) {
            case 'rectangle': rectShapeOnMouseUp();
                break;
            case 'ellipse': ellipseShapeOnMouseUp();
                break;
            case 'polygon': polyShapeOnMouseUp();
                break;
        }
    }

    /**
    * Handle the selection on mouse up
    * Branches according to level
    */
    function selectionOnMouseUp() {
        switch (selector.level) {
            case 'section': sectionOnMouseUp();
                break;
            case 'row': rowOnMouseUp();
                break;
            case 'matrix': matrixOnMouseUp();
                break;
            case 'text': textOnMouseUp();
                break;
            case 'media': mediaOnMouseUp();
                break;
            case 'rectangle': rectSelectOnMouseUp();
                break;
            case 'polygon': polySelectOnMouseUp();
                break;
            case 'ellipse': ellipseSelectOnMouseUp();
                break;
        }
    }

    /**
     * handles section on mouse up
     */
    function sectionOnMouseUp() {
        selectorDragOnMouseUp.sectionDragOnMouseUp(selector, component['section'], mouse);
        selectorRotateOnMouseUp.sectionRotateOnMouseUp(selector, component['section'], mouse);
    }

    /**
     * Handle rows on mouse up
     */
    function rowOnMouseUp() {
        selectorDragOnMouseUp.rowDragOnMouseUp(selector, component['row'], mouse);
        modifyRowOnMouseUp();
        selectorRotateOnMouseUp.rowRotateOnMouseUp(selector, component['row'], mouse);
    }

    /**
      * Handle matrix on mouse up
      */
    function matrixOnMouseUp() {
        selectorDragOnMouseUp.matrixDragOnMouseUp(selector, component['matrix'], mouse);
        modifyMatrixOnMouseUp();
        selectorRotateOnMouseUp.matrixRotateOnMouseUp(selector, component['matrix'], mouse);
    }

    /**
     * It handles the node on mouse up
     */
    function nodeOnMouseUp() {
        //TODO - any mouse up should end

        switch (selector.level) {
            case 'polygon': polygonNodeOnMouseUp();
                break;
            case 'rectangle': rectangleNodeOnMouseUp();
                break;
            case 'ellipse': ellipseNodeOnMouseUp();
                break;
        }
    }

    /**
     * Handles polygon node on mouse up
     */
    function polygonNodeOnMouseUp(){
        if (currentObject) {
            currentObject.nodeObject.endNodeDrag(mouse);
        }
    }

    /**
     * Handles rectangle node on mouse up
     */
    function rectangleNodeOnMouseUp(){
        if (currentObject) {
            currentObject.endNodeDrag(mouse);
        }
    }

     /**
     * Handles rectangle node on mouse up
     */
    function ellipseNodeOnMouseUp(){
        if (currentObject) {
            currentObject.endNodeDrag(mouse);
        }
    }

    /**
     * Handle rectangle shape on mouse up
     */
    function rectShapeOnMouseUp() {
        mainModule.rectShapeOnMouseUp();
    }

    /**
     * Handle ellipse shape on mouse up
     */
    function ellipseShapeOnMouseUp() {
        mainModule.ellipseShapeOnMouseUp();
    }

    /**
     * Handle polygon shape on mouse up
     */
    function polyShapeOnMouseUp() {

    }

    /**
     * Handle the text on mouse up
     */
    function textOnMouseUp() {
        selectorDragOnMouseUp.textDragOnMouseUp(selector, component['text'], mouse);
        selectorRotateOnMouseUp.textRotateOnMouseUp(selector, component['text'], mouse);
    }

    /**
     * Handle the text on mouse up
     */
    function mediaOnMouseUp() {
        selectorDragOnMouseUp.mediaDragOnMouseUp(selector, component['media'], mouse);
        selectorRotateOnMouseUp.mediaRotateOnMouseUp(selector, component['media'], mouse);
    }

    /**
     * Handle rect selection 
     * on mouse up
     */
    function rectSelectOnMouseUp() {
        selectorDragOnMouseUp.rectShapeDragOnMouseUp(selector, component['rectangle'], mouse);
        selectorRotateOnMouseUp.rectShapeRotateOnMouseUp(selector, component['rectangle'], mouse);
    }

    /**
     * Handles polygon shape on mouse up
     */
    function polySelectOnMouseUp() {
        selectorDragOnMouseUp.polyShapeDragOnMouseUp(selector, component['polygon'], mouse);
        selectorRotateOnMouseUp.polyShapeRotateOnMouseUp(selector, component['polygon'], mouse);
    }

    /**
     * Handle ellipse shape on mouse up
     */
    function ellipseSelectOnMouseUp() {
        selectorDragOnMouseUp.ellipseShapeDragOnMouseUp(selector, component['ellipse'], mouse);
        selectorRotateOnMouseUp.ellipseShapeRotateOnMouseUp(selector, component['ellipse'], mouse);
    }

    //call the main module handle matrix on mouse up functions
    function handleMatrixOnMouseUp() {
        mainModule.handleMatrixOnMouseUp();
    }

    //call the main module handle seat on mouse uo
    function handleSeatOnMouseUp() {
        mainModule.handleSeatOnMouseUp();
    }

    /**
     * It modifies the row seat on  mouse up based on the selection
     */
    function modifyRowOnMouseUp() {
        mainModule.modifyRowOnMouseUp();
    }

    /**
     * Modifies the matrix on mouse up
     */
    function modifyMatrixOnMouseUp() {
        mainModule.modifyMatrixOnMouseUp();
    }

    return {
        updateVariable: updateVariable,
        select: select
    }
})();
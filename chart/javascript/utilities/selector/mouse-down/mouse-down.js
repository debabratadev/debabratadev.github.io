/**
 * Handles commponent selection on mouse down
 */
var componentSelectorOnMouseDown = (function () {

    let selector;
    let component;
    let mouse;
    let canvas;
    let ctx;
    let currentObject;
    let currentMatrixRow;
    let position;
    let mouseBtn;

    /**
     * Update Variable for mouse down here
     * 
     * @param {*} mousePoint is the current cord of mouse
     * @param {*} canvasRef  is the canvs referrence
     * @param {*} context   is the ctx
     */
    function updateVariable(mousePoint, canvasRef, context, object, matrixObject, pos, mouseEvent) {
        mouse = mousePoint;
        canvas = canvasRef;
        ctx = context;
        currentObject = object;
        currentMatrixRow = matrixObject;
        position = pos;
        mouseBtn = mouseEvent.button;

        component = mainModule.getComponent();
    }

    /**
     * Branch according to type
     * 
     * @param {*} componentSelector is the selector
     */
    function select(componentSelector) {
        selector = componentSelector;

        switch (selector.type) {
            case 'creator':
                break;
            case 'selector': selectorOnMouseDown();
                break;
            case 'node': nodeOnMouseDown();
                break;
            case 'seat': mainModule.seatOnMouseDown();
                break;
            case 'shape': shapeOnMouseDown();
                break;
        }
    }

    /**
     * Handle selector on mouse move
     */
    function selectorOnMouseDown() {
        selectionOnMouseDown();
        mainModule.handleMatrixOnMouseDown();
    }

    /**
     * Handle node on mouse down
     */
    function nodeOnMouseDown() {

        switch(selector.level){
            case 'polygon': polygonNodeOnMouseDown();
                break;
            case 'rectangle':rectangleNodeOnMouseDown();
                break;
            case 'ellipse':ellipseNodeOnMouseDown();
                break;
        }
    }

    /**
     * Handles polygon node on mouse down
     */
    function polygonNodeOnMouseDown(){
        if (currentObject && currentObject.enableNode && !mouseBtn) {
            currentObject.nodeObject.startNodeDrag(position);
        }
    }

    /**
     * Handle rectangle node on mouse down
     */
    function rectangleNodeOnMouseDown(){
        if (currentObject && currentObject.enableNode) {
            currentObject.startNodeDrag(position);
        }
    }

    /**
     * Handles ellipse node on mouse down here
     */
    function ellipseNodeOnMouseDown(){
        if(currentObject && currentObject.enableNode){
            currentObject.startNodeDrag(position);
        }
    }

    /**
     * shape on mouse down
     */
    function shapeOnMouseDown() {
        switch (selector.level) {
            case 'rectangle': mainModule.addRectangleObject();
                break;
            case 'ellipse': mainModule.addEllipseObject();
                break;
            case 'polygon':
                break;
        }
    }

    /**
     * It handles the selection on mouse down
     */
    function selectionOnMouseDown() {

        collection.hideSelection();

        mainModule.selectObject();

        switch (selector.level) {
            case 'section': sectionOnMouseDown();
                break;
            case 'row': rowOnMouseDown();
                break;
            case 'matrix': matrixOnMouseDown();
                break;
            case 'text': textOnMouseDown();
                break;
            case 'media': mediaOnMouseDown();
                break;
            case 'rectangle': rectSelectOnMouseDown();
                break;
            case 'polygon': polySelectOnMouseDown();
                break;
            case 'ellipse': ellipseSelectOnMouseDown();
                break;
        }
    }

    /**
    * Handle the section on mouse down
    */
    function sectionOnMouseDown() {

        mainModule.sectionDragOnMouseDown();
        // selectorDragOnMouseDown.sectionDragOnMouseDown(currentObject,component['section']);
        selectorRotateOnMouseDown.sectionRotateOnMouseDown(selector, component['section'], position, canvas, ctx);
    }

    /**
     * Handle row on mouse down
     */
    function rowOnMouseDown() {

        mainModule.modifyRowOnMouseDown();
        mainModule.rowDragOnMouseDown();
        // selectorDragOnMouseDown.rowDragOnMouseDown(currentObject,component['row']);
        selectorRotateOnMouseDown.rowRotateOnMouseDown(selector, component['row'], mouse, canvas, ctx);
    }

    /**
     * Handle matrix on mouse down
     */
    function matrixOnMouseDown() {

        mainModule.modifyMatrixOnMouseDown();
        mainModule.matrixDragOnMouseDown();
        // selectorDragOnMouseDown.matrixDragOnMouseDown(currentMatrixRow,component['matrix']);
        selectorRotateOnMouseDown.matrixRotateOnMouseDown(selector, component['matrix'], mouse, canvas, ctx);
    }

    /**
     * Handle text on mouse down
     */
    function textOnMouseDown() {
        mainModule.textDragOnMouseDown();
        // selectorDragOnMouseDown.textDragOnMouseDown(currentObject,component['text']);
        selectorRotateOnMouseDown.textRotateOnMouseDown(selector, component['text'], mouse, canvas, ctx);
    }

    /**
     * Handles the media on mouse down
     */
    function mediaOnMouseDown() {
        mainModule.mediaDragOnMouseDown();
        selectorRotateOnMouseDown.mediaRotateOnMouseDown(selector, component['media'], mouse, canvas, ctx);
    }

    /**
     * Handle rectangle on mouse down
     */
    function rectSelectOnMouseDown() {
        mainModule.rectShapeDragOnMouseDown();
        // selectorDragOnMouseDown.rectShapeDragOnMouseDown(currentObject,component['rectangle']);
        selectorRotateOnMouseDown.rectRotateOnMouseDown(selector, component['rectangle'], mouse, canvas, ctx);
    }

    /**
     * Handle ellipse on mouse down
     */
    function ellipseSelectOnMouseDown() {
        mainModule.ellipseShapeDragOnMouseDown();
        // selectorDragOnMouseDown.ellipseShapeDragOnMouseDown(currentObject,component['ellipse']);
        selectorRotateOnMouseDown.ellipseRotateOnMouseDown(selector, component['ellipse'], mouse, canvas, ctx);
    }

    /**
     * Handle polygon on mouse down
     */
    function polySelectOnMouseDown() {
        mainModule.polyShapeDragOnMouseDown();
        // selectorDragOnMouseDown.polyShapeDragOnMouseDown(currentObject,component['polygon']);
        selectorRotateOnMouseDown.polyRotateOnMouseDown(selector, component['polygon'], mouse, canvas, ctx);
    }

    return {
        select: select,
        updateVariable: updateVariable
    }

})();
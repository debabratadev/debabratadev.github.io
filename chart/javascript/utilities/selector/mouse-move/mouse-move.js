/**
 * Componet selection on mouse move
 */
var componentSelectorOnMouseMove = (function () {

    let currentObject;
    let currentMatrixrow;
    let mouse;
    let component;
    let canvas;
    let ctx;
    let currX;
    let currY;

    /**
     * Update variable for selector on mouse up 
     * 
     * @param {*} selector      is the component selector
     * @param {*} currentObject is the current object
     * @param {*} mouse         is the mouse object 
     */
    function updateVariable(object, matrix, mousePoint, canvasRef, context, xMouse, yMouse) {
        currentMatrixrow = matrix;
        component = mainModule.getComponent();

        currentObject = object;
        mouse = mousePoint;
        canvas = canvasRef;
        ctx = context;
        currX = xMouse;
        currY = yMouse;
    }

    /**
     * Branch according to type
     * 
     * @param {*} componentSelector is the selector 
     */
    function select(componentSelector) {
        selector = componentSelector;

        switch (selector.type) {
            case 'creator': mainModule.creatorOnMouseMove();
                break;
            case 'selector': selectorOnMouseMove();
                break;
            case 'node': nodeSelectorOnMouseMove(); return false;
            case 'seat': mainModule.seatOnMouseMove(); return false;
            case 'text': textOnMouseMove(); return false;
            case 'shape': shapeOnMouseMove(); return false;
        }

        //Will handle the true and false of the object here
        return true;
    }

    /**
     * Selector on mouse move
     */
    function selectorOnMouseMove() {

        canvas.style.cursor = 'default';

        switch (selector.level) {
            case 'section': sectionOnMouseMove();
                break;
            case 'row': rowOnMouseMove();
                break;
            case 'matrix': matrixOnMouseMove();
                break;
            case 'text': selectTextOnMouseMove();
                break;
            case 'media': mediaOnMouseMove();
                break;
            case 'rectangle': rectSelectOnMouseMove();
                break;
            case 'polygon': polySelectOnMouseMove();
                break;
            case 'ellipse': ellipseSelectOnMouseMove();
                break;
        }

        mainModule.setCanvas(canvas);
    }

    /**
     * Handle the text on mouse move
     */
    function textOnMouseMove() {
        canvas.style.cursor = "text";
        mainModule.setCanvas(canvas);
    }

    /**
     * Handle shape on mouse move
     */
    function shapeOnMouseMove() {
        canvas.style.cursor = "crosshair";

        switch (selector.level) {
            case 'rectangle': rectShapeOnMouseMove();
                break;
            case 'polygon': polyShapeOnMouseMove();
                break;
            case 'ellipse': ellipseShapeOnMouseMove();
                break;
        }

        mainModule.setCanvas(canvas);
    }

    /**
     * Handle section on mouse move
     * TODO -- to a single function
     */
    function sectionOnMouseMove() {
        if (selector.drag) {
            selectorDragOnMouseMove.sectionDragOnMouseMove(component['section'], mouse, canvas, ctx);
        }
        else if(selector.rotate){
            selectorRotateOnMouseMove.sectionRotateOnMouseMove(selector, component['section'], mouse, canvas, ctx);
        }
    }

    /**
     * Handle row on mouse move
     * 
     */
    function rowOnMouseMove() {
        if (selector.drag) {
            mainModule.handleRowsOnMouseMove();
        }
        else if(selector.rotate){
            selectorRotateOnMouseMove.rowRotateOnMouseMove(selector, component['row'], mouse, canvas, ctx);
        }
    }

    /**
     * Handle matrix on mouse move
     */
    function matrixOnMouseMove() {

        if (selector.drag) {
            mainModule.handleMatrixOnMouseMove();
        }
        else if(selector.rotate){
            selectorRotateOnMouseMove.matrixRotateOnMouseMove(selector, component['matrix'], mouse, canvas, ctx);
        }
    }

    /**
     * Handle text drag on mouse move
     */
    function selectTextOnMouseMove() {

        if (selector.drag) {
            selectorDragOnMouseMove.textDragOnMouseMove(component['text'], mouse, canvas, ctx);
        } else if(selector.rotate){
            selectorRotateOnMouseMove.textRotateOnMouseMove(selector, component['text'], mouse, canvas, ctx);
        }
    }

    /**
     * Handle Media drag on mouse move
     */
    function mediaOnMouseMove() {
        if (selector.drag) {
            selectorDragOnMouseMove.mediaDragOnMouseMove(component['media'], mouse, canvas, ctx);
        } else if(selector.rotate){
            selectorRotateOnMouseMove.mediaRotateOnMouseMove(selector, component['media'], mouse, canvas, ctx);
        }
    }

    /**
     * Handle movement while
     * rectangle is selected 
     */
    function rectSelectOnMouseMove() {
        if (selector.drag) {
            selectorDragOnMouseMove.rectDragOnMouseMove(component['rectangle'], mouse, canvas, ctx);
        } else if(selector.rotate){
            selectorRotateOnMouseMove.rectShapeRotateOnMouseMove(selector, component['rectangle'], mouse, canvas, ctx);
        }
    }

    /**
     * Handle polygon select on mouse down
     */
    function polySelectOnMouseMove() {
        if (selector.drag) {
            selectorDragOnMouseMove.polyDragOnMouseMove(component['polygon'], mouse, canvas, ctx);
        } else if(selector.rotate){
            selectorRotateOnMouseMove.polyShapeRotateOnMouseMove(selector, component['polygon'], mouse, canvas, ctx);
        }
    }

    /**
     * Handle ellipse select on mouse down
     */
    function ellipseSelectOnMouseMove() {
        if (selector.drag) {
            selectorDragOnMouseMove.ellipseDragOnMouseMove(component['ellipse'], mouse, canvas, ctx);
        } else if(selector.rotate){
            selectorRotateOnMouseMove.ellipseShapeRotateOnMouseMove(selector, component['ellipse'], mouse, canvas, ctx);
        }
    }

    /**
     * Handle rect shape on mouse move
     */
    function rectShapeOnMouseMove() {
        let pt = ctx.transformedPoint(currX, currY);
        if (currentObject) {
            currentObject.creating(pt);
        }
    }
    /**
     * Handle polygon shape on mouse move
     */
    function polyShapeOnMouseMove() {
        let pt = ctx.transformedPoint(currX, currY);
        if (currentObject) {
            currentObject.moveMouse(pt);
        }
    }

    /**
     * Handle ellipse shape on mouse move
     */
    function ellipseShapeOnMouseMove() {
        let pt = ctx.transformedPoint(currX, currY);
        if (currentObject) {
            currentObject.creating(pt);
        }
    }

    /**
     * It handles the node selection on mouse move
     * TODO handle the test cases for this
     */
    function nodeSelectorOnMouseMove() {

        switch (selector.level) {
            case 'polygon': polygonSelectorOnMouseMove();
                break;
            case 'rectangle': rectangleSelectorOnMouseMove();
                break;
            case 'ellipse': ellipseSelectorOnMouseMove();
                break;
        }
    }

    /**
     * Handles polygon selector on mouse move
     */
    function polygonSelectorOnMouseMove() {
        if (currentObject) {
            let pt = ctx.transformedPoint(currX, currY);
            currentObject.nodeObject.setTentativeNodePoint({ x: currX, y: currY });
            currentObject.nodeObject.nodeDragging(pt);
        }
    }

    /**
     * Handles rectangle selection on mouse move
     */
    function rectangleSelectorOnMouseMove() {
        if (currentObject) {
            let pt = ctx.transformedPoint(currX, currY);
            currentObject.selectNodePoint({x:currX,y:currY});
            currentObject.nodeDragging(pt);
        }
    }

    /**
     * Handles ellipse selection on mouse down
     */
    function ellipseSelectorOnMouseMove(){
        if (currentObject) {
            let pt = ctx.transformedPoint(currX, currY);
            currentObject.selectNodePoint({x:currX,y:currY});
            currentObject.nodeDragging(pt);
        }
    }

    return {
        select: select,
        updateVariable: updateVariable
    }

})();
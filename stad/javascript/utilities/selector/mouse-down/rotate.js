/**
 * Handles selector rotate on mouse down
 */
var selectorRotateOnMouseDown = (function () {

    /**
     * Handles section on mouse rotation here.
     */
    function sectionRotateOnMouseDown(selector,sectionComponent,mouse,canvas,ctx) {
        selector.rotate = sharedComponent.componentRotateOnMouseDown(sectionComponent, mouse, canvas, ctx);
        handleSelector(selector);
    }

     /**
     * hanlde row rotation on mouse down
     */
    function rowRotateOnMouseDown(selector,seatRowComponent,mouse,canvas,ctx) {
        selector.rotate = sharedComponent.componentRotateOnMouseDown(seatRowComponent, mouse, canvas, ctx);
        handleSelector(selector);
    }

     /**
     * handle the rotation of the matrix on mouse down
     */
    function matrixRotateOnMouseDown(selector,matrixRowComponent,mouse,canvas,ctx) {
        if (!matrixRowComponent.length) {
            return;
        }
        selector.rotate = sharedComponent.componentRotateOnMouseDown(matrixRowComponent, mouse, canvas, ctx);
        handleSelector(selector);
    }

    /**
     * Handle text rotate on mouse down
     */
    function textRotateOnMouseDown(selector,textComponent,mouse,canvas,ctx) {
        selector.rotate = sharedComponent.componentRotateOnMouseDown(textComponent, mouse, canvas, ctx);
        handleSelector(selector);
    }

    /**
     * Handle media rotate on mouse down
     */
    function mediaRotateOnMouseDown(selector,mediaComponent,mouse,canvas,ctx) {
        selector.rotate = sharedComponent.componentRotateOnMouseDown(mediaComponent, mouse, canvas, ctx);
        handleSelector(selector);
    }

    /**
     * Handle rectangle rotation on mouse downn
     */
    function rectRotateOnMouseDown(selector,rectShapeComponent,mouse,canvas,ctx) {
        selector.rotate = sharedComponent.componentRotateOnMouseDown(rectShapeComponent, mouse, canvas, ctx);
        handleSelector(selector);
    }

    /**
     * Handle polygon rotation
     */
    function polyRotateOnMouseDown(selector,polyShapeComponent,mouse,canvas,ctx) {
        selector.rotate = sharedComponent.componentRotateOnMouseDown(polyShapeComponent, mouse, canvas, ctx);
        handleSelector(selector);
    }

    /**
     * Handle ellipse rotation on mouse down
     */
    function ellipseRotateOnMouseDown(selector,ellipseShapeComponent,mouse,canvas,ctx) {
        selector.rotate = sharedComponent.componentRotateOnMouseDown(ellipseShapeComponent, mouse, canvas, ctx);
        handleSelector(selector);
    }

    /**
     * Set the selector to false here
     */
    function handleSelector(selector){
        mainModule.setSelector(selector);
    }

    return {
        sectionRotateOnMouseDown:sectionRotateOnMouseDown,
        rowRotateOnMouseDown:rowRotateOnMouseDown,
        matrixRotateOnMouseDown:matrixRotateOnMouseDown,
        textRotateOnMouseDown:textRotateOnMouseDown,
        rectRotateOnMouseDown:rectRotateOnMouseDown,
        polyRotateOnMouseDown:polyRotateOnMouseDown,
        ellipseRotateOnMouseDown:ellipseRotateOnMouseDown,
        mediaRotateOnMouseDown:mediaRotateOnMouseDown
    }

})();
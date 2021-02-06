/**
 * Handle rotation of component on mouse move
 */
var selectorRotateOnMouseMove = (function () {

    /**
     * Handles section rotation , when the mouse is moved here.
     */
    function sectionRotateOnMouseMove(selector,sectionComponent,mouse,canvas,ctx) {
        if (!selector.rotate) {
            return;
        }
        selector.rotate = sharedComponent.componentRotateOnMouseMove(sectionComponent, mouse, canvas, ctx);

        handleSelector(selector);
    }
     /**
     * Rotate the section on mouse move
     */
    function rowRotateOnMouseMove(selector,seatRowComponent,mouse,canvas,ctx) {
        if (!selector.rotate) {
            return;
        }
        selector.rotate = sharedComponent.componentRotateOnMouseMove(seatRowComponent, mouse, canvas, ctx);

        handleSelector(selector);
    }

    /**
     * Handle matrix rotaion on mouse movement
     */
    function matrixRotateOnMouseMove(selector,matrixRowComponent,mouse,canvas,ctx) {
        if (!selector.rotate) {
            return;
        }
        selector.rotate = sharedComponent.componentRotateOnMouseMove(matrixRowComponent, mouse, canvas, ctx);

        handleSelector(selector);
    }

    /**
     * Handle text rotate on the mouse move
     */
    function textRotateOnMouseMove(selector,textComponent,mouse,canvas,ctx) {
        if (!selector.rotate) {
            return;
        }
        selector.rotate = sharedComponent.componentRotateOnMouseMove(textComponent, mouse, canvas, ctx);

        handleSelector(selector);
    }

    /**
     * Handle text rotate on the mouse move
     */
    function mediaRotateOnMouseMove(selector,mediaComponent,mouse,canvas,ctx) {
        if (!selector.rotate) {
            return;
        }
        selector.rotate = sharedComponent.componentRotateOnMouseMove(mediaComponent, mouse, canvas, ctx);

        handleSelector(selector);
    }

     /**
     * Handle rectangle shape rotation on the mouse move
     */
    function rectShapeRotateOnMouseMove(selector,rectShapeComponent,mouse,canvas,ctx) {
        if (!selector.rotate) {
            return;
        }
        selector.rotate = sharedComponent.componentRotateOnMouseMove(rectShapeComponent, mouse, canvas, ctx);

        handleSelector(selector);
    }

     /**
     * Handle polygon shape rotation on mouse move
     */
    function polyShapeRotateOnMouseMove(selector,polyShapeComponent,mouse,canvas,ctx) {
        if (!selector.rotate) {
            return;
        }
        selector.rotate = sharedComponent.componentRotateOnMouseMove(polyShapeComponent, mouse, canvas, ctx);

        handleSelector(selector);
    }

    /**
     * Handle ellipse shape rotation on the mouse move
     */
    function ellipseShapeRotateOnMouseMove(selector,ellipseShapeComponent,mouse,canvas,ctx) {
        if (!selector.rotate) {
            return;
        }

        selector.rotate = sharedComponent.componentRotateOnMouseMove(ellipseShapeComponent, mouse, canvas, ctx);
        
        handleSelector(selector);
    }
    
    /**
     * Set the selector to false here
     */
    function handleSelector(selector){
        mainModule.setSelector(selector);
    }

    return {
        sectionRotateOnMouseMove:sectionRotateOnMouseMove,
        rowRotateOnMouseMove:rowRotateOnMouseMove,
        matrixRotateOnMouseMove:matrixRotateOnMouseMove,
        textRotateOnMouseMove:textRotateOnMouseMove,
        mediaRotateOnMouseMove:mediaRotateOnMouseMove,
        rectShapeRotateOnMouseMove:rectShapeRotateOnMouseMove,
        polyShapeRotateOnMouseMove:polyShapeRotateOnMouseMove,
        ellipseShapeRotateOnMouseMove:ellipseShapeRotateOnMouseMove
    }
})();
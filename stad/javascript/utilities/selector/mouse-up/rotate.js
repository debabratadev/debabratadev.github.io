/**
 * Handle component rotation on mouse up
 */
var selectorRotateOnMouseUp = (function () {

    /**
     * Handles section rotation when the mouse is up here.
     */
    function sectionRotateOnMouseUp(selector,sectionComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentRotateOnMouseUp(sectionComponent, mouse);
    }

     /**
     * It rotates the row on mouse up here.
     */
    function rowRotateOnMouseUp(selector,seatRowComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentRotateOnMouseUp(seatRowComponent, mouse);
    }

    /**
     * Rotate the matrix on mouse up
     */
    function matrixRotateOnMouseUp(selector,matrixRowComponent,mouse) {
        
        handleSelector(selector);
        if (!matrixRowComponent.length) {
            return;
        }
        
        sharedComponent.componentRotateOnMouseUp(matrixRowComponent, mouse);
    }
    
    /**
     * Rotate the text on mouse up
     */
    function textRotateOnMouseUp(selector,textComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentRotateOnMouseUp(textComponent, mouse);
    }

    /**
     * Rotate the text on mouse up
     */
    function mediaRotateOnMouseUp(selector,mediaComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentRotateOnMouseUp(mediaComponent, mouse);
    }

     /**
     * Rotate rectangle on mouse up
     */
    function rectShapeRotateOnMouseUp(selector,rectShapeComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentRotateOnMouseUp(rectShapeComponent, mouse);
    }

    /**
     * Rotate polygon on mouse up
     */
    function polyShapeRotateOnMouseUp(selector,polyShapeComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentRotateOnMouseUp(polyShapeComponent, mouse);
    }

    /**
     * Rotate ellipse shape on mouse up
     */
    function ellipseShapeRotateOnMouseUp(selector,ellipseShapeComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentRotateOnMouseUp(ellipseShapeComponent, mouse);
    }

    /**
     * Set the selector to false here
     */
    function handleSelector(selector){
        selector.rotate = false;
        mainModule.setSelector(selector);
    }

    return {
        sectionRotateOnMouseUp:sectionRotateOnMouseUp,
        rowRotateOnMouseUp:rowRotateOnMouseUp,
        matrixRotateOnMouseUp:matrixRotateOnMouseUp,
        textRotateOnMouseUp:textRotateOnMouseUp,
        rectShapeRotateOnMouseUp:rectShapeRotateOnMouseUp,
        polyShapeRotateOnMouseUp:polyShapeRotateOnMouseUp,
        ellipseShapeRotateOnMouseUp:ellipseShapeRotateOnMouseUp,
        mediaRotateOnMouseUp:mediaRotateOnMouseUp
    }
})();
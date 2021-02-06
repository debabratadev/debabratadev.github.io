/**
 * Handle selector drag on mouse up
 */
var selectorDragOnMouseUp = (function () {

     /**
     * It handles the section  drag when the mouse is up.
     */
    function sectionDragOnMouseUp(selector,sectionComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentDragOnMouseUp(sectionComponent, mouse);
    }

      /**
     * Drag the row on mouse up.
     */
    function rowDragOnMouseUp(selector,seatRowComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentDragOnMouseUp(seatRowComponent, mouse);
    }

    /**
     * Stop dragging the matrix on mouse up
     */
    function matrixDragOnMouseUp(selector,matrixRowComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentDragOnMouseUp(matrixRowComponent, mouse);
    }

    /**
     * Text drag on mouse up.
     */
    function textDragOnMouseUp(selector,textComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentDragOnMouseUp(textComponent, mouse);
    }

    /**
     * Text drag on mouse up.
     */
    function mediaDragOnMouseUp(selector,mediaComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentDragOnMouseUp(mediaComponent, mouse);
    }

     /**
     * Handle rect shape drag on mouse up
     */
    function rectShapeDragOnMouseUp(selector,rectShapeComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentDragOnMouseUp(rectShapeComponent, mouse);
    }

     /**
     * Handle poly shape drag on mouse up
     */
    function polyShapeDragOnMouseUp(selector,polyShapeComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentDragOnMouseUp(polyShapeComponent, mouse);
    }

        /**
     * Handle ellipse shape drag on mouse up
     */
    function ellipseShapeDragOnMouseUp(selector,ellipseShapeComponent,mouse) {

        handleSelector(selector);
        sharedComponent.componentDragOnMouseUp(ellipseShapeComponent, mouse);
    }

    /**
     * Set the selector to false here
     */
    function handleSelector(selector){
        selector.drag = false;
        mainModule.setSelector(selector);
    }

    return {
        sectionDragOnMouseUp:sectionDragOnMouseUp,
        rowDragOnMouseUp:rowDragOnMouseUp,
        matrixDragOnMouseUp:matrixDragOnMouseUp,
        textDragOnMouseUp:textDragOnMouseUp,
        mediaDragOnMouseUp:mediaDragOnMouseUp,
        rectShapeDragOnMouseUp:rectShapeDragOnMouseUp,
        polyShapeDragOnMouseUp:polyShapeDragOnMouseUp,
        ellipseShapeDragOnMouseUp:ellipseShapeDragOnMouseUp
    }

})();
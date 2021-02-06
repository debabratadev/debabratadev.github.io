/**
 * Handle selector drag on mouse move
 */
var selectorDragOnMouseMove = (function () {

    /**
     * Section drag on mouse move 
     */
    function sectionDragOnMouseMove(sectionComponent,mouse,canvas,ctx) {
        sharedComponent.componentDragOnMouseMove(sectionComponent, mouse, canvas, ctx);
    }

    /**
     * Row Drag on mouse move
     */
    function rowDragOnMouseMove(seatRowComponent,mouse,canvas,ctx) {
        sharedComponent.componentDragOnMouseMove(seatRowComponent, mouse, canvas, ctx);
    }

    /**
     * Matrix Drag on mouse move
     */
    function matrixDragOnMouseMove(matrixRowComponent,mouse,canvas,ctx) {
        sharedComponent.componentDragOnMouseMove(matrixRowComponent, mouse, canvas, ctx);
    }

    /**
     * Text Drag on mouse move
     */
    function textDragOnMouseMove(textComponent,mouse,canvas,ctx) {
        sharedComponent.componentDragOnMouseMove(textComponent, mouse, canvas, ctx);
    }

    /**
     * Media Drag on mouse move
     */
    function mediaDragOnMouseMove(mediaComponent,mouse,canvas,ctx) {
        sharedComponent.componentDragOnMouseMove(mediaComponent, mouse, canvas, ctx);
    }

    /**
     * Rectangle drag on mouse move
     */
    function rectDragOnMouseMove(rectShapeComponent,mouse,canvas,ctx) {
        sharedComponent.componentDragOnMouseMove(rectShapeComponent, mouse, canvas, ctx);
    }

    /**
     * Polygon drag on mouse move
     */
    function polyDragOnMouseMove(polyShapeComponent,mouse,canvas,ctx) {
        sharedComponent.componentDragOnMouseMove(polyShapeComponent, mouse, canvas, ctx);
    }

    /**
     * Ellipse drag on mouse move 
     */
    function ellipseDragOnMouseMove(ellipseShapeComponent,mouse,canvas,ctx) {
        sharedComponent.componentDragOnMouseMove(ellipseShapeComponent, mouse, canvas, ctx);
    }

    return {
        sectionDragOnMouseMove:sectionDragOnMouseMove,
        rowDragOnMouseMove:rowDragOnMouseMove,
        matrixDragOnMouseMove:matrixDragOnMouseMove,
        textDragOnMouseMove:textDragOnMouseMove,
        mediaDragOnMouseMove:mediaDragOnMouseMove,
        rectDragOnMouseMove:rectDragOnMouseMove,
        polyDragOnMouseMove:polyDragOnMouseMove,
        ellipseDragOnMouseMove:ellipseDragOnMouseMove,
    }
})();
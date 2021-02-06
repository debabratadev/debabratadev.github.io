/**
 * Drag operation for component
 * 
 * @param {*} component is the component object
 */
function Drag(component) {

    this.object = component;

    /**
     * Start Drag
     */
    this.startDrag = function(mouse) {
        this.object.startX = mouse.x;
        this.object.startY = mouse.y;
        this.object.rectangle = true;
        this.object.drag = true;
    }

     /**
     * Handle dragging of object
     * 
     * @param {*} mouse 
     */
    this.dragging = function(mouse) {
        this.object.startX = mouse.x;
        this.object.startY = mouse.y;
    }

    /**
     * Handle end drag of object
     * 
     * @param {*} mouse 
     */
    this.endDrag = function(mouse,childElement = false) {
        this.object.drag = false;
        mainModule.updateRectangleArray([]);
        if(!childElement){
            mainModule.updateChart();
        }
    }
}
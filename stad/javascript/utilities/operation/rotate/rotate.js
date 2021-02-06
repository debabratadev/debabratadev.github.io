/**
 * Handles rotation of the component
 * 
 * @param {*} component is the object to be rotated
 */
function Rotate(component) {

    this.object = component;

    /**
     * Start Rotation 
     */
    this.startRotate = function (mouse) {
        this.object.startRadian = Math.atan(lineModule.slopeOfALine(this.object.centroid, mouse));
        this.object.rPoint1 = this.object.rotateFirstPoint;
        this.object.rPoint2 = this.object.rotatePoint;

        this.object.prevCursor = this.object.canvas.style.cursor;
        this.object.rectangle = true;
        this.object.rotate = true;
    }

    /**
     * Rotating 
     */
    this.rotating = function (mouse) {
        let initialRadian = Math.PI / 2;
        let slope = lineModule.slopeOfALine(this.object.centroid, mouse);
        let finalRadian = Math.atan(slope);

        if (mouse.x > this.object.centroid.x) {
            finalRadian += Math.PI;
        }

        this.object.rotationAngle = initialRadian - finalRadian;

        this.object.rPoint1 = pointModule.rotateAroundAnotherPoint(this.object.centroid,
            this.object.rotationAngle, this.object.rotateFirstPoint);
        this.object.rPoint2 = pointModule.rotateAroundAnotherPoint(this.object.centroid,
            this.object.rotationAngle, this.object.rotatePoint);

        this.object.startRadian = finalRadian;
        this.object.canvas.style.cursor = "grabbing";
    }

    /**
     * Handle rotation end here
     */
    this.endRotate = function (mouse) {
        this.object.canvas.style.cursor = this.object.prevCursor;
        this.object.rotationAngle = 0;
        this.object.rotate = false;
        // mainModule.updateChart();
    }
}

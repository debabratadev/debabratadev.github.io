/**
 * Handles rotation of the polygon point
 * 
 * @param {*} component is the type of component object
 */
function RotatePolygon(component) {

    this.object = component;

    /**
     * Rotate the polygon point here
     */
    this.rotatePolygonPoint = function (parent=null) {

        let centroid = parent ? parent.centroid:this.object.centroid;
        let rotationAngle = parent?parent.rotationAngle:this.object.rotationAngle;

        for (let index = 0; index < this.object.coordinates.length; ++index) {
            let point = pointModule.rotateAroundAnotherPoint(centroid,
                rotationAngle, this.object.tempCordinate[index]);
            this.object.coordinates[index] = point;
        }
    }

    /**
     * Store the polygon point for 
     * The Rotation purpose
     */
    this.storePolygonPoint = function () {

        this.object.tempCordinate = [];

        for (let index = 0; index < this.object.coordinates.length; ++index) {
            this.object.tempCordinate.push({
                x: this.object.coordinates[index].x,
                y: this.object.coordinates[index].y
            });
        }
    }
}
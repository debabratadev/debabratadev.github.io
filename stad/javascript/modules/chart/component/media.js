/**
 * Handle the image component
 * 
 * @param {*} image is the image object
 */
function Media(image) {

    this.ctx;
    this.coordinates;
    this.distance={x:0,y:0};

    //Inspector variable
    this.scale = 35;
    this.opacity = 1;
    this.maxOpacity = 1;

    this.rotation;
    this.order;

    //dragging
    this.startX;
    this.startY;
    this.drag = false;

    //update image attribute
    this.img = image;
    this.src = (image.src ? image.src : null); //Will handle the error here

    this.canvas;

    //creation
    this.creation = true;

    //rectangle
    this.rectangle = false;
    this.rectCordinates;

    this.iWidth;
    this.iHeight;

    this.centroid;

    //handles rotation.
    this.startRadian;
    this.prevCursor;
    this.rPoint1;
    this.rPoint2;

    this.rotateFirstPoint;
    this.rotatePoint;
    this.rotate = false;
    this.rotationAngle = 0;
    this.imageAngle = 0;

    this.dragObject;
    this.rotateObject;

    this.zIndex = 4;
    this.backOrder = false;

    this.currentFactor;

    this.parentSection = null;

    this.parentRotationCounter = false;
    this.parentDistanceX = 0;
    this.parentDistanceY = 0;

    /**
     * This function will be contineously
     */
    this.draw = function (ctx, lineWidth, canvas) {
        this.updateVariable(ctx, lineWidth, canvas);
        this.drawImage();
        this.handleRectangle();
    }

    /**
     * Update the variable
     */
    this.updateVariable = function (ctx, lineWidth, canvas) {
        this.ctx = ctx;
        this.lineWidth = lineWidth / 2;
        this.canvas = canvas;
    }

    /**
     * Draw Image here
     */
    this.drawImage = function () {

        let ratio = this.calculateRatio();

        if(!this.img.width && !this.img.height){
            return;
        }

        this.handleCreation(ratio);
        this.ctx.lineWidth = this.lineWidth;   //TODO - checking for errors in linewidth
        
        if(!this.rotate && !this.availableParent){
            this.updateImageCordinate();
        }

        this.ctx.save();
        this.ctx.translate(this.centroid.x, this.centroid.y);
        this.ctx.rotate(this.imageAngle);
        this.ctx.translate(-this.centroid.x, -this.centroid.y);

        this.ctx.globalAlpha = this.opacity;
        this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height,
            this.coordinates.x, this.coordinates.y, this.img.width * ratio, this.img.height * ratio);
        this.ctx.globalAlpha = this.maxOpacity;

        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Calculate the ratio 
     */
    this.calculateRatio = function () {
        let width = (this.canvas.width * this.scale) / (100);
        let height = (this.canvas.height * this.scale) / (100);

        let hratio = width / this.img.width;
        let vratio = height / this.img.height;

        return Math.min(hratio, vratio);
    }

    /**
     * Handle Creation of image 
     * TODO Search for better way
     */
    this.handleCreation = function (ratio) {
        this.iWidth = this.img.width * ratio;
        this.iHeight = this.img.height * ratio;

        if (this.creation) {
            this.coordinates = {
                x: (this.canvas.width - this.iWidth) / 2,
                y: (this.canvas.height - this.iHeight) / 2
            }

            this.distance.x = this.canvas.width - this.coordinates.x - this.iWidth/2;
            this.distance.y = this.canvas.height - this.coordinates.y - this.iHeight/2;

            this.creation = false;
        }
    }

    /**
     * Set the scale for the image
     */
    this.setScale = function (scale) {
        this.scale = scale/this.currentFactor;
        this.coordinates.x = (this.canvas.width - this.iWidth) / 2;
        this.coordinates.y = (this.canvas.height - this.iHeight) / 2;

        // this.coordinates.x = this.canvas.width - this.distance.x;
        // this.coordinates.y = this.canvas.height - this.distance.y;
    }

    /**
     * Returns the scale of the image
     */
    this.getScale = function(){
        return parseInt(this.scale * this.currentFactor);
    }

    /**
     * Set the opacity here
     */
    this.setOpacity = function (opacity) {
        this.opacity = (Math.round(opacity) / 100).toFixed(2);
    }

    /**
     * It returns the opacity of the image
     */
    this.getOpacity = function(){
        return parseInt(this.opacity * 100);
    }

    /**
     * Get the url of the image 
     */
    this.getUrl = function(){
        return this.src;
    }

    /**
     * Move the component to back
     */
    this.moveToBack = function(){
        this.zIndex = 0;
        this.backOrder = true;
    }

    /**
     * Move the component to forth
     */
    this.moveToForth = function(){
        this.zIndex = 5;
        this.backOrder = false;
    }

    /**
     * Handle the rectangle process.
     * Enclosing the rectangle and creating the
     * rotational handler 
     */
    this.handleRectangle = function () {

        if (this.rectangle) {
            this.drawEnclosingRectangle();
            sharedComponent.handleRotation(this);
        }
    }

    /**
    * draw the enclosing rectangle here
    */
    this.drawEnclosingRectangle = function () {
        canvasModule.drawEnclosingRectangle(this.ctx, this.rectCordinates,
            this.rotate, this.rotationAngle, this.centroid,
            this.lineWidth, '#6BBEEE');
    }

    /**
     * Update the image cordinate here
     */
    this.updateImageCordinate = function () {

        this.imageCordinate = [];
        this.imageCordinate[0] = this.coordinates;
        this.imageCordinate[1] = {
            x: this.coordinates.x + this.iWidth,
            y: this.coordinates.y
        }
        this.imageCordinate[2] = {
            x: this.coordinates.x + this.iWidth,
            y: this.coordinates.y + this.iHeight
        }
        this.imageCordinate[3] = {
            x: this.coordinates.x,
            y: this.coordinates.y + this.iHeight
        }

        this.centroid = polyModule.centroidOfAPolygon(this.imageCordinate);

        if(this.parentRotationCounter){
            this.parentDistanceX = this.parentReferCentroid.x - this.centroid.x;
            this.parentDistanceY = this.parentReferCentroid.y - this.centroid.y;

            this.parentRotationCounter = false;
        }

        this.centroid = {x:this.centroid.x + this.parentDistanceX,y:this.centroid.y + this.parentDistanceY}

        this.imageCordinate = pointModule.rotateArrayPoint(this.imageCordinate, this.centroid,-this.imageAngle);
        this.rectCordinates = polyModule.findEnclosingRectangleCoordinate(this.imageCordinate);
    }

    /**
     * Check whether the point lies inside the polygon 
     */
    this.pointLiesInsideThePolygon = function (point) {

        this.updateImageCordinate();
        let coord = polyModule.findAllCoordinatesOfARectangle(this.rectCordinates);
        return polyModule.isInsidePolygon(coord, coord.length, point);
    }

    /**
     * Check whether the rotation handler has been hit or not
     */
    this.hitTest = function (ctx, x, y) {

        return canvasModule.pointHitTest(ctx, { x: x, y: y }, this.rotatePoint, this.lineWidth * 5);
    }

    //Drag of image

    /**
     * Drag the text 
     */
    this.startDrag = function (mouse) {

        this.dragObject = new Drag(this);
        this.dragObject.startDrag(mouse);
    }

    /**
     * Handle dragging of an application
     */
    this.dragging = function (mouse) {

        this.updateCordinatesWhileDragging(mouse);
        this.dragObject.dragging(mouse);
    }

    /**
     * End drag here
     */
    this.endDrag = function (mouse,childElement) {
        this.dragObject.endDrag(mouse,childElement);
    }

    /**
     * Update the coordinates while dragging here
     */
    this.updateCordinatesWhileDragging = function (mouse) {
        this.coordinates.x += mouse.x - this.startX;;
        this.coordinates.y += mouse.y - this.startY;

        this.distance.x = this.canvas.width - this.coordinates.x;
        this.distance.y = this.canvas.height - this.coordinates.y;
    }

    //rotation

    /**
     * Starts the drag for the rotation here
     */
    this.rotateStartDrag = function (mouse,parent) {
        this.initialAnglele = this.imageAngle;
        this.tempStartPoint = this.coordinates;

        if(!parent){
            this.rotateObject = new Rotate(this);
            this.rotateObject.startRotate(mouse);
            this.parentDistanceX = 0;
            this.parentDistanceY = 0;
        } else{
            this.availableParent = true;
        }
    }

    /**
    * Handles the dragging for rotation
    */
    this.rotateDragging = function (mouse,parent) {
        this.rotateMedia(mouse,parent);
    }

    /**
     * It ends the dragging for the rotation.
     */
    this.rotateEndDrag = function (mouse,parent) {
        // this.rotateObject.endRotate(mouse);
        if(!parent){
            this.rotateObject.endRotate(mouse);
            mainModule.updateChart();
        } else{
            this.availableParent = false;
            this.parentRotationCounter = true;
            this.parentReferCentroid = this.centroid;
        }

        this.rotate = false;
    }

    /**
     * Rotate Media here
     */
    this.rotateMedia = function (mouse,parent) {
        let centroid,rotationAngle;
        if(!parent){
            this.rotateObject.rotating(mouse);
            centroid = this.centroid;
            rotationAngle = this.rotationAngle;
        } else{
            centroid = parent.centroid; //need to understand things
            rotationAngle = parent.rotationAngle;
            this.coordinates = pointModule.rotateAroundAnotherPoint(centroid,rotationAngle,this.tempStartPoint);
            this.centroid = {x:this.coordinates.x,y:this.coordinates.y};
        }
        this.imageAngle = this.initialAnglele - rotationAngle;
    }
}
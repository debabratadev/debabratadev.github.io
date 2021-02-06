/**
 * Handle the seat component 
 */
function Seat() {

    this.seats;

    this.coordinates = [];

    this.prevX;
    this.prevY;
    this.currX;
    this.currY;
    this.startX;
    this.startY;
    this.drag;
    this.ctx;
    this.radius;

    this.strokeColor = "#000000";
    this.lineWidth = 1;
    this.fillColor = "#FFFFFF";
    this.prevFillColor;

    this.opacity=1;
    this.prevOpacity;

    this.labelColor = "#000000";

    this.rowCreate = false;
    this.parent = null; //later thing will be set here
    // this.showText = false;

    this.directionIndex = 0;
    this.select = false;

    this.label = "A";
    this.category = null;

    this.zIndex = 1;
    this.showText = false;
    this.rowExtremaColor="#00008B";

    /**
     *  This function will be comes infinitely
     */
    this.draw = function (ctx, radius,lineWidth) {

        this.updateVariable(ctx,radius,lineWidth);

        this.currX = this.coordinates[0].x;
        this.currY = this.coordinates[0].y;

        // if(this.parent.sequence!='Alphabet'){
        //     this.drawPoints();
        // }

        this.drawPoints();
        if (this.showText || this.parent.seatLabel) {
            this.showLabel();
        }
    }

    /**
     * Update the variable for the seat
     */
    this.updateVariable = function (ctx, radius,lineWidth) {
        this.ctx = ctx;
        this.radius = radius;
        this.lineWidth = lineWidth;
    }

    /**
     *  Draw the points
     */
    this.drawPoints = function () {

        let property = this.selectSeat();

        //TODO -- seat radius in terms of line width here to represent
        // this.ctx.globalAlpha = this.opacity;
        canvasModule.drawPoint(this.ctx, this.currX, this.currY,
            this.radius, this.lineWidth*3, property.color,
            this.fillColor);
        // this.ctx.globalAlpha=1;
    }

    /**
     * Select the seat by changing the color
     */
    this.selectSeat = function () {
        let lineWidth, strokeColor;

        if (this.select) {
            lineWidth = this.radius / 5;
            strokeColor = "#6BBEEE";
        } else if(this.rowCreate){
            lineWidth = this.radius*76;
            strokeColor = this.rowExtremaColor;

        }else{
            lineWidth = this.radius / 100;
            strokeColor = this.strokeColor;
        }

        return {
            width: lineWidth,
            color: strokeColor
        }
    }

    /**
     * Set the x position for label
     * Here 3,2, and 1 are the respective 
     * cordiantes to be divided for here.
     */
    this.setXForLabel = function (seatId) {
        
        if (seatId < 10) {
            return 3;
        } else if (seatId == 11) {
            return 1.9;
        } else if (seatId < 20) {
            return 1.5;
        }
        else if (seatId < 100) {
            return 2;
        } else {
            return 1;
        }
    }

    /**
     * Show the label in the seats.
     */
    this.showLabel = function () {
        this.chooseDirection(this.parent.direction);
        this.typeOflabel(this.parent.sequence);  //Usually will be set through the row side.
    }

    /**
     * Show alphabet label for the seats.
     */
    this.showAlphaLabel = function (startAt) {

        if (startAt > 25) {
            this.showNumericLabel(startAt - 26);
        } else {

            let xPos;
            let alphabet = String.fromCharCode(startAt + 65);
            xPos = (alphabet == 'W') ? 1.5 : (alphabet == 'I') ? this.radius : 2;

            this.ctx.fillStyle = this.labelColor;
            this.ctx.strokeStyle = this.labelColor;
            this.ctx.fillText(alphabet, this.currX - this.radius/2, this.currY +this.radius/2);
            this.label = alphabet;
        }
    }

    /**
     * Show the numeric label takes, the xposiion and seat id.
     */
    this.showNumericLabel = function (seatId) {
        let xPos = this.setXForLabel(seatId);

        this.ctx.font = this.radius + 'px Arial';
        this.ctx.fillStyle = this.labelColor;
        this.ctx.strokeStyle = this.labelColor;
        this.ctx.fillText(seatId, this.currX - this.radius / xPos, this.currY + this.radius / 3);

        this.label = seatId;
    }

    /**
     * Determine the type pf label to be displayed
     * Numeric and alphabet
     */
    this.typeOflabel = function (type) {

        if (isNaN(this.parent.seatStartAt)) {
            this.parent.seatStartAt = this.parent.seatStartAt.charCodeAt(0) - 65;
        }

        let startAt = this.seats.id + parseInt(this.parent.seatStartAt) + this.directionIndex;

        switch (type) {
            case 'Numeric': this.showNumericLabel(startAt);
                break;
            case 'Alphabet': this.showAlphaLabel(startAt);
                break;
        }
    }

    /**
     * Choose the direction and assign , direction according to that here
     */
    this.chooseDirection = function (direction) {

        if (direction == 'L') {
            this.directionIndex = 0;
        }
        else {
            let length = this.parent.seatComponent.length;
            this.directionIndex = length - 2 * this.seats.id - 1;
        }
    }

    /**
     * Set the seat details here
     * 
     * @param details is the property for seats
     */
    this.setSeatDetails = function (details) {
        this.seats = details;

        //individual details
        this.parent = details.parent;
        this.labelColor = details.seatLabelColor;
    }

    /**
     * Get the seat details.
     */
    this.getSeatDetails = function () {
        return this.seats;
    }

    /**
     * Set the category
     */
    this.setCategory = function(name,color){
        this.category = name;
        this.fillColor = color;
    }

    /**
     * returns the category
     */
    this.getCategory = function(){
        return [{
            'name':this.category,
            'color':this.fillColor
        }]
    }

    /**
     * Hit test, to check the current position for the ball
     * 
     * @param ctx 
     * @param x    is the x coordinates of the seat
     * @param y    is the y coordinats of the seat
     */
    this.hitTest = function (ctx, x, y) {

        let center = { x: this.currX, y: this.currY };
        let point = { x: x, y: y };

        return canvasModule.pointHitTest(ctx, point, center, this.radius);
    }

    /**
     * Starts the dragging of the functions
     * 
     * @param mouse holds the coordinated of the cursor
     */
    this.startDrag = function (mouse) {

        this.startX = mouse.x;
        this.startY = mouse.y;

        this.coordinates[0].x = mouse.x;
        this.coordinates[0].y = mouse.y;
    }

    /**
     * handles the dragging of the mouse
     * 
     * @param mouse holds the coordianted of the cursor
     */
    this.dragging = function (mouse) {

        this.currX += mouse.x - this.startX;
        this.currY += mouse.y - this.startY;

        this.coordinates[0].x = this.currX;
        this.coordinates[0].y = this.currY;

        //Update the start point
        this.startX = mouse.x;
        this.startY = mouse.y;
    }

    /**
     * End the dragging
     */
    this.endDrag = function (pt) {

        if (pt == -1) {
            this.coordinates[0].x = this.currX;
            this.coordinates[0].y = this.currY;
        } else {
            this.coordinates[0].x = pt.x;
            this.coordinates[0].y = pt.y;
        }
    }

}
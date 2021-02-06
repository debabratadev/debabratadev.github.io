/**
 * Handles the seat category function for other
 */
function SeatCategory() {

    this.category;
    this.seatComponent;
    this.seatObject = [];
    this.tempSeat = [];

    //for selection
    this.startPoint;
    this.endPoint;
    this.selection;
    this.rectWidth;
    this.rectHeight;

    this.rectangle;
    this.rectCord;
    this.rectLeftCord;

    //property of rectangle
    this.lineWidth;
    this.opacity = 0.1;
    this.strokeStyle = "#6BBEEE";
    this.fillStyle = "#808080"
    this.handleSe
    this.ctx;

    /**
     * It draws the rectangle. for selection
     */
    this.draw = function (ctx, lineWidth) {

        this.updateVariable(ctx, lineWidth);
        if (this.selection) {
            this.drawSelectionRectangle();
            this.handleSelection();
        } else if (this.rectangle) {
            this.drawEnclosingRectangle();
        }
    }

    /**
     * Update the variable
     */
    this.updateVariable = function (ctx, lineWidth) {
        this.ctx = ctx;
        this.lineWidth = lineWidth;
    }

    /**
     * Draws the rectangle for the selection
     */
    this.drawSelectionRectangle = function () {
        this.ctx.globalAlpha = this.opacity;
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fillRect(this.startPoint.x, this.startPoint.y, this.rectWidth, this.rectHeight);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }

    /**
     * It draws the enclosing rectangle
     */
    this.drawEnclosingRectangle = function () {

        this.getExtremaOfSeat();
        this.ctx.lineWidth = this.lineWidth * 2;
        this.ctx.strokeStyle = '#6BBEEE';
        canvasModule.drawRoundRect(this.ctx, this.rectLeftCord.x, this.rectLeftCord.y,
            this.rectWidth, this.rectHeight, 5, false);
    }

    /**
     * It handle the selection for the seat
     */
    this.handleSelection = function () {
        seatCollection.updateSeatColor(this.seatComponent);
        this.hitTestForSelection();
        seatCollection.updateSeatSelectionColor(this.tempSeat, '#ADD8E6');
    }

    /**
     * check whether it encloses the rectangle or not.
     */
    this.hitTestForSelection = function () {

        this.tempSeat = [];
        let rectCord = [];
        rectCord.push({x:this.startPoint.x,y:this.startPoint.y});
        rectCord.push({x:this.startPoint.x+this.rectWidth,y:this.startPoint.y});
        rectCord.push({x:this.startPoint.x+this.rectWidth,y:this.startPoint.y+this.rectHeight});
        rectCord.push({x:this.startPoint.x,y:this.startPoint.y+this.rectHeight});

        for (let index = 0; index < this.seatComponent.length; ++index) {
            let coordinate = this.seatComponent[index].coordinates[0];

            if(polyModule.isInsidePolygon(rectCord,rectCord.length, coordinate)){
                this.tempSeat.push(this.seatComponent[index]);
            }
        }
    }

    /**
     * It starts the selection
     */
    this.startSelection = function (mouse, component) {
        this.startPoint = this.endPoint = mouse;
        this.selection = true;
        this.rectWidth = 0;
        this.rectHeight = 0;
        this.seatComponent = component;
        seatCollection.updatePrevSeatColor(this.seatComponent);
    }

    /**
     * In a process of selecting 
     */
    this.selecting = function (mouse) {
        this.endPoint = mouse;
        this.rectWidth = this.endPoint.x - this.startPoint.x;
        this.rectHeight = this.endPoint.y - this.startPoint.y;
    }

    /**
     * It end the selection
     */
    this.endSelection = function (mouse) {
        this.selection = false;
        this.seatObject = this.tempSeat;
        seatCollection.updateSeatColor(this.seatComponent);
    }

    /**
     * get the extrema of the seat
     */
    this.getExtremaOfSeat = function () {

        this.rectCord = polyModule.findEnclosingRectangleCoordinate(this.getSeatCordinates());
        let radius = this.getRadiusMaxima();
        this.updateRectCord(radius);
        this.updateRectangleVariable();
    }

    /**
     * Update the rectangle cordinate here
     */
    this.updateRectCord = function (radius) {
        this.rectCord = {
            lowestX: this.rectCord.lowestX - radius,
            lowestY: this.rectCord.lowestY - radius,
            highestX: this.rectCord.highestX + radius,
            highestY: this.rectCord.highestY + radius,
        }
    }

    /**
     * Update the rectangle variable here
     */
    this.updateRectangleVariable = function () {
        this.rectLeftCord = {
            x: this.rectCord.lowestX,
            y: this.rectCord.lowestY
        }

        this.rectHeight = this.rectCord.highestY - this.rectCord.lowestY;
        this.rectWidth = this.rectCord.highestX - this.rectCord.lowestX;
    }

    /**
     * Get the seat cordinate
     * of the selected seatr
     */
    this.getSeatCordinates = function () {
        let seatCordinate = [];
        for (let index = 0; index < this.seatObject.length; ++index) {
            let cordinate = this.seatObject[index].coordinates[0];
            seatCordinate.push(cordinate);
        }
        return seatCordinate;
    }

    /**
     * Get the radius maxima of the seat
     */
    this.getRadiusMaxima = function () {
        if (!this.seatObject.length) {
            return 0;
        }
        let radius = this.seatObject[0].radius;
        for (let index = 0; index < this.seatObject.length; ++index) {
            let seatRadius = this.seatObject[index].radius;
            radius = radius > seatRadius ? radius : seatRadius;
        }
        return radius;
    }

    /**
     * Update the seat color
     */
    this.updateSeatColor = function (name,color) {
        for (let index = 0; index < this.seatObject.length; ++index) {
            let seat = this.seatObject[index];
            seat.fillColor = color;
            seat.category = name;
        }
    }

    /**
     * get the category 
     */
    this.getCategory = function (){
        let holder = [];
        for(let index = 0;index<this.seatObject.length;++index){
            let seat = this.seatObject[index];
            let catg = seat.getCategory();
            holder.push(catg[0]);
        }
        return holder;
    }
}
/**
 * Handle the matrix component
 */
function Matrix() {

    this.ctx;
    this.lineWidth;
    this.radius;
    this.currentZoomIndex;
    this.factor;
    this.canvas;
    this.pointCounter = 0;

    this.rowStartCordinates = [];
    this.rowEndCordinates = [];
    this.rowSpacing = 4;
    this.rowComponent = [];
    this.currentFactor;
    this.radius = 7;
    
    this.parentSection = null;

    /**
     * Draw functions for matrices
     */
    this.draw = function (ctx, lineWidth, radius, currentZoomIndex, factor, canvas) {
        this.updateVariable(ctx, lineWidth, radius, currentZoomIndex, factor, canvas);
        this.handleTypeOfMatrices();
        this.drawChildObject();
    }

    /**
     * Update the variable 
     */
    this.updateVariable = function (ctx, lineWidth, radius, currentZoomIndex, factor, canvas) {
        this.ctx = ctx;
        this.lineWidth = lineWidth / 2;
        // this.radius = radius;
        this.currentZoomIndex = currentZoomIndex;
        this.canvas = canvas;
        this.factor = factor;
    }

    /**
     * Draws the child object such as rows
     */
    this.drawChildObject = function () {
        for (let index = 0; index < this.rowComponent.length; ++index) {
            let row = this.rowComponent[index];
            if(!row){
                continue;
            }
            row.draw(this.ctx, this.lineWidth, this.radius, this.currentZoomIndex, this.factor, this.canvas);
        }
    }

    /**
     * Handle type of matrices 
     * And do work
     */
    this.handleTypeOfMatrices = function () {

    }

    /**
     * Create Matrix
     */
    this.createMatrix = function (point) {
        if (this.creation == false) {
            return;
        }

        this.pointCounter++;

        this.creation = (this.pointCounter == 1) ? true : false;

        if (this.creation) {
            this.startPoint = { x: point.x, y: point.y };
            this.endPoint = { x: point.x, y: point.y };
        }
        else {
            this.endPoint = { x: point.x, y: point.y };
            this.addParentSection();
        }
    }

    /**
     * Handles movement of mouse
     */
    this.moveMouse = function (point) {

        if (!this.pointCounter) {
            return;
        }
        this.endPoint = { x: point.x, y: point.y };
        this.editMatrices(point);
    }

    /**
     * Edit the matrices
     */
    this.editMatrices = function () {

        this.setEndPointsForRows();
        this.createRows();
        //create Rows 
    }

    /**
     * Set the end points for rows
     */
    this.setEndPointsForRows = function(){
        let firstStartPoint = { x: this.startPoint.x, y: this.startPoint.y };
        let lastStartPoint = { x: this.startPoint.x, y: this.endPoint.y };
        let firstEndPoint = { x: this.endPoint.x, y: this.startPoint.y };
        let lastEndPoint = { x: this.endPoint.x, y: this.endPoint.y };

        let distance = lineModule.lengthOfALine(firstStartPoint, lastStartPoint);

        let initialDistance = -this.rowSpacing;
        this.rowStartCordinates = [];
        this.rowEndCordinates = [];
        while ((initialDistance += this.radius + this.rowSpacing) < distance) {
             let firstPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(firstStartPoint,lastStartPoint,initialDistance);
             let lastPoint = lineModule.cordOfPointAlongACertainDistanceFromLine(firstEndPoint,lastEndPoint,initialDistance);

             this.rowStartCordinates.push({x:firstPoint.x,y:firstPoint.y});
             this.rowEndCordinates.push({x:lastPoint.x,y:lastPoint.y});

             initialDistance+=this.radius;
        }
    }

    /**
     * Create Rows for the matrices
     */
    this.createRows = function (){
        
        this.rowComponent = [];
        let length = this.rowStartCordinates.length;
        for(let index=0;index<length;++index){
            const row = this.createRowObject();
            row.startPoint = {x:this.rowStartCordinates[index].x,y:this.rowStartCordinates[index].y};
            row.endPoint = {x:this.rowEndCordinates[index].x,y:this.rowEndCordinates[index].y};
            row.rowId = index;
            row.editRows();
            row.creation = false;
        }
    }

    /**
     * Create Row object
     */
    this.createRowObject = function(){
        const seatRow = new Row();
        seatRow.radius = this.radius;
        seatRow.seatSpacing = this.seatSpacing; 
        seatRow.currentZoom = this.currentZoom;
        this.rowComponent.push(seatRow);
        return seatRow;
    }

    /**
     * Add Parent section of the rows
     */
    this.addParentSection = function(){
        for(let index=0;index<this.rowComponent.length;++index){
            const row = this.rowComponent[index];
            row.parentSection = this.parentSection;
            let length = row.seatComponent.length;
            row.seatComponent[0].rowCreate = false;
            row.seatComponent[length-1].rowCreate = false;
        }
    }
}
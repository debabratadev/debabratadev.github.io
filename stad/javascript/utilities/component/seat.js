/**
 * Operation related to collection of seat
 */
var seatCollection = (function () {

    /**
     * Set the row type here
     * 
     * @param {*} rowComponent  is the type of component
     */
    function setRowtype(rowComponent){
        for(let index=0;index<rowComponent.length;++index){
            rowComponent[index].displayType ="row";
        }
        return rowComponent;
    }

    /**
     * filter the matrix component from the seat component
     * This can never filter the rows
     */
    function filterMatrixComponent(rowComponent, matrix) {
        let temp = [];
        for (let index = 0; index < rowComponent.length; ++index) {
            if (rowComponent[index].displayType == "row") {
                temp.push(rowComponent[index]);
            }
            else {
                matrix.rowComponent.push(rowComponent[index]);
            }
        }
        return temp;
    }

    /**
     * seats of a component
     * 
     * @param {*} component is the component array
     */
    function getSeatsOfComponent(component) {
        let seat = [];
        for (let index = 0; index < component.length; ++index) {
            seat = seat.concat(component[index].seatComponent);
        }
        return seat;
    }

    //Handle seat color here

    /**
    * It update the previous seat color
    */
    function updatePrevSeatColor(seatComponent) {
        for (let index = 0; index < seatComponent.length; ++index) {
            seatComponent[index].prevFillColor = seatComponent[index].fillColor;
        }
    }

    /**
     * Update the seat Color
     */
    function updateSeatColor(seatComponent) {
        for (let index = 0; index < seatComponent.length; ++index) {
            seatComponent[index].fillColor = seatComponent[index].prevFillColor;
        }
    }

    /**
     * It update the previous seat Color
     */
    function updateSeatSelectionColor(seatComponent, color) {
        for (let index = 0; index < seatComponent.length; ++index) {
            seatComponent[index].fillColor = color;
        }
    }

    /**
     * It update the previous opacity property of the seat
     */
    function updatePrevSeatOpacity(seatComponent) {
        for (let index = 0; index < seatComponent.length; ++index) {
            seatComponent[index].prevOpacity = seatComponent[index].opacity;
        }
    }

    /**
     * Update the original seat opacity here
     */
    function updateSeatOpacity(seatComponent) {
        for (let index = 0; index < seatComponent.length; ++index) {
            seatComponent[index].opacity = seatComponent[index].prevOpacity;
        }
    }

    /**
     * It update the seat selection opacity
     */
    function updateSeatSelectionOpacity(seatComponent, opacity) {
        for (let index = 0; index < seatComponent.length; ++index) {
            seatComponent[index].opacity = opacity;
        }
    }
    return {
        filterMatrixComponent: filterMatrixComponent,
        getSeatsOfComponent: getSeatsOfComponent,
        updatePrevSeatColor: updatePrevSeatColor,
        updateSeatSelectionColor: updateSeatSelectionColor,
        updateSeatColor: updateSeatColor,
        updatePrevSeatOpacity:updatePrevSeatOpacity,
        updateSeatOpacity:updateSeatOpacity,
        updateSeatSelectionOpacity:updateSeatSelectionOpacity,
        setRowtype:setRowtype
    }
})();
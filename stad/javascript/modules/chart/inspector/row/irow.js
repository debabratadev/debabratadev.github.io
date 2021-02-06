/**
 * Handles row properties
 */
var rowInspector = (function () {

    let rowObject;
    let inputNumber = ['row-curve', 'row-seat-space', 'row-seat-radius'];

    /**
     * Sets the row object along with the different property to be shown.
     * 
     * @param {*} object is the current row object, whose property need to be set.
     */
    function setRowObject(object) {

        rowObject = object;

        helperModule.showInspector('row-inspector');
        helperModule.showAndHideBlock('row-label-icon', rowObject.label);
        helperModule.showAndHideBlock('seat-label', rowObject.seatLabel);

        document.getElementById('row-curve').value = rowObject.curve + ' ' + String.fromCharCode(176);
        // document.getElementById('row-space').value =  parseInt(rowObject.rowSpace)+ ' pt';
        document.getElementById('row-seat-space').value = rowObject.getSeatSpacing()+ ' pt';
        document.getElementById('row-seat-radius').value = rowObject.getSeatRadius()  + ' pt';

        document.getElementById('row-label').checked = rowObject.label;
        document.getElementById('row-sequence').value = rowObject.rowSequence;
        document.getElementById('row-start').value = rowObject.startAt;

        document.getElementById('row-seat-label').checked = rowObject.seatLabel;
        document.getElementById('row-seat-seq').value = rowObject.sequence;
        document.getElementById('row-seat-start').value = rowObject.seatStartAt;
        document.getElementById('row-seat-direction').value = rowObject.direction;
        
        listModule.setType('row',rowObject);
        listModule.createList('row-column-catg');

        helperModule.cursorResizeType(inputNumber);
    }

    /**
     * Sets the curve of the row
     */
    function setCurve() {
        let value = document.getElementById('row-curve').value;
        value.trim(" ");
        value = value.split(" ");
        rowObject.curve = value[0];
        rowObject.drawCurve();
    }

    /**
     * Sets the Row spacing here
     */
    function setRowSpacing() {
        rowObject.rowSpace = document.getElementById('row-space').value;
    }

    /**
     * Sets the spacing between the seats here.
     */
    function setSeatSpacing() {

        let value = document.getElementById('row-seat-space').value;
        value = parseInt(value.replace(/\D/g, ''));

        rowObject.setSeatSpacing(value);
    }

    /**
     * It sets the seat Radius here.
     */
    function setSeatRadius() {
        let value = document.getElementById('row-seat-radius').value;
        value = parseInt(value.replace(/\D/g, ''));

        if(value<1){
            return;
        }
        rowObject.setSeatRadius(value);
        // if(!value){
        //     return;
        // }
        // // rowObject.updateSeatRadius(value);
        // // rowObject.updateSpacing();
        // // rowObject.seatRadius = value;
        // // rowObject.updateSeatSpacing();
        // // rowObject.seatSpacing();
    }

    /**
     * Toggle whether to show the label or not.
     */
    function toggleRowLabel() {

        rowObject.label = document.getElementById('row-label').checked;

        if (rowObject.label) {
            document.getElementById('row-label-icon').style.display = "block";
        }
        else {
            document.getElementById('row-label-icon').style.display = "none";
        }
    }

    /**
     * Sets the row label type
     */
    function setRowLabelType() {

        rowObject.rowSequence = document.getElementById('row-sequence').value;
        setStartAtValue(rowObject.rowSequence, document.getElementById('row-start'));
        setRowStartAt();
    }

    //TODO Starts At

    //TODO Direction

    /**
     * Toggle the seat labelling , whethet to show the seat label or not.
     */
    function toggleSeatLabel() {

        rowObject.seatLabel = document.getElementById('row-seat-label').checked;

        if (rowObject.seatLabel) {
            document.getElementById('seat-label').style.display = "block";
        }
        else {
            document.getElementById('seat-label').style.display = "none";
        }
    }

    /**
     * Sets the seat label type, Numeric or alphabetic in this case.
     */
    function setSeatLabelType() {

        rowObject.sequence = document.getElementById('row-seat-seq').value;
        setStartAtValue(rowObject.sequence, document.getElementById('row-seat-start'));

        setStartAt();
    }

    /**
     * Sets the start At point for the sequence.
     */
    function setStartAt() {
        rowObject.seatStartAt = document.getElementById('row-seat-start').value;
    }

    /**
     * Sets the label start At
     */
    function setRowStartAt() {
        rowObject.startAt = document.getElementById('row-start').value;
    }

    /**
     * Sets the direction of the the labelling of the seats.
     * Toggle between both the direction, here.
     */
    function setDirection() {
        rowObject.direction = document.getElementById('row-seat-direction').value;
    }

    /**
     * Sets the initial label value.
     * @param {*} value is the value we need to update according to selection
     * @param {*} id 
     */
    function setStartAtValue(value, id) {
        if (value == "Numeric") {
            id.value = 0;
        }
        else if (value == "Alphabet") {
            id.value = 'A';
        }
        else {
            id.value = null;
        }
    }

    //TODO - Category creations

    return {
        setCurve: setCurve,
        setRowSpacing: setRowSpacing,
        toggleRowLabel: toggleRowLabel,
        toggleSeatLabel: toggleSeatLabel,
        setSeatLabelType: setSeatLabelType,
        setStartAt: setStartAt,
        setRowStartAt: setRowStartAt,
        setDirection: setDirection,
        setRowObject: setRowObject,
        setSeatSpacing: setSeatSpacing,
        setSeatRadius: setSeatRadius,
        setRowLabelType: setRowLabelType,
    }
})();
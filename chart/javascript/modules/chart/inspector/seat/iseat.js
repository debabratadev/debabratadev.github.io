/**
 * Handles properties related to seat 
 */
var seatInspector = (function () {

    let seatObject;

    /**
     * Set the seat object
     * 
     * @param {*} object is the seat object
     */
    function setSeatObject(object) {
        seatObject = object
        helperModule.showInspector('seat-inspector');
        document.getElementById('seat-text').value = seatObject.label;
        listModule.setType('seat',seatObject);
        listModule.createList('seat-column-catg');
    }

    /**
     * Set the seat Color for defining the category
     * 
     */
    function setSeatColor(color,category){
        // seatObject.fillColor = document.getElementById('seat-color').value;
        seatObject.fillColor = color;
        seatObject.category = category;
    }

    /**
     * Set the category type here
     */
    function setCategoryType(){
        seatObject.category = document.getElementById('seat-category').value;
    }

    return {
        setSeatObject: setSeatObject,
        setSeatColor:setSeatColor,
        setCategoryType:setCategoryType
    }
})();
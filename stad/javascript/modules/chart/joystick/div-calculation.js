/**
 * Calculation of div for joystick
 */
var divCalci = (function () {

    let elemId = document.getElementById('joystick');

    /**
     *  Sets the element id for calculation
     * @param {} id 
     */
    function setElmntIdForCalci(id) {
        elemId = document.getElementById(id);
    }

    /**
     * return the height of div
     */
    function getHeight() {
        return elemId.clientHeight;
    }

    /**
     * return the radius of the div
     */
    function getRadius() {
        return elemId.clientWidth / 2;
    }

    /**
     * return the center of the height
     */
    function getCenterOfHeight() {
        return getHeight() / 2;
    }

    /**
     * get the coordinates of the top position of an element
     */
    function getCoordinatesOfDiv() {
        let coord = elemId.getBoundingClientRect();
        
        return {
            x: coord.left,
            y: coord.top
        }
    }

    /**
     * return the coordinate point of the circle
     */
    function getPointOfCircle() {
        let coord = getCoordinatesOfDiv();
        let height = getCenterOfHeight();
        coord.y += height;

        return coord;
    }

    /**
     * get the center coordinates of the circle
     */
    function getCenterCord(id) {
        elemId = document.getElementById(id);
        let radius = getPointOfCircle();
        radius.x += getRadius();
        
        return radius;
    }

    return {
        getCenterCord: getCenterCord,
        getRadius: getRadius,
        setElmntIdForCalci: setElmntIdForCalci,
    }

})();
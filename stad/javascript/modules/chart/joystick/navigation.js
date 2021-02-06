/**
 *Navigation through joystick
 */
var navModule = (function () {

    let ctx;
    let translateBy = 20;
    let check = 1;
    let factor = 1;
    let joystickFactor = 1;

    /**
     * sets the context of the canvas 
     * @param {*} context 
     */
    function setContext(context) {
        ctx = context;
    }

    function setNav(factor,navFactor) {
        translateBy /= factor;
        factor = factor;
        joystickFactor = navFactor;
    }

    /**
     * calls nav drag to left 
     */
    function navLeft() {
        ctx.translate(translateBy, 0);
    }

    /**
     * calls nav drag to right
     */
    function navRight() {
        ctx.translate(-translateBy, 0);
    }

    /**
     * calls nav drag to up
     */
    function navUp() {
        ctx.translate(0, translateBy);
    }

    /**
     * call nav drag to down
     */
    function navDown() {
        ctx.translate(0, -translateBy);
    }

    /**
     * When the joystick inner circle is moved then
     * 
     * @param {*} xCord 
     * @param {*} yCord 
     */
    function navMove(xCord, yCord) {
        ctx.translate((yCord.x - xCord.x) /(15 * joystickFactor), (yCord.y - xCord.y) / (15 * joystickFactor));
    }

    /**
     * Original point of navigation.
     */
    function navOriginal() {
        mainModule.realZoom();
    }
 
    return {
        navLeft: navLeft,
        navRight: navRight,
        navUp: navUp,
        navDown: navDown,
        navMove: navMove,
        navOriginal: navOriginal,
        setContext: setContext,
        setNav: setNav
    }
})();
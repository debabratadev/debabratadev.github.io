/**
 * Handle events for navigation
 */
var navigationHandler = (function () {

    /**
     * Add the listener for the navigation here
     */
    function addListener(){
        document.getElementById('nav-left').addEventListener('click',navModule.navLeft);
        document.getElementById('nav-right').addEventListener('click',navModule.navRight);
        document.getElementById('nav-up').addEventListener('click',navModule.navUp);
        document.getElementById('nav-down').addEventListener('click',navModule.navDown);
    }
    return {
        addListener: addListener
    }

})();
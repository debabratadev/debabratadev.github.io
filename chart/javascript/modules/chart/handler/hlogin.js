/**
 * Handles event for login
 */
var loginHandler = (function () {

    /**
     * Add Listener for Chart
     */
    function addListener() {

        let loginBtn = document.getElementById('login-btn');
        loginBtn.addEventListener('click',logInModule.validateForm);
    }
    return {
        addListener: addListener
    }

})();
/**
 * Handles event for login
 */
window.onload = function () {
    let loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', logInModule.validateForm);
};



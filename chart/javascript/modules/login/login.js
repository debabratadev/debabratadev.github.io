/**
 * Login api call/authentication
 */
var logInModule = (function () {

    /**
     * Validate the form
     */
    function validateForm(event) {
        event.preventDefault();
        window.location.replace("chart.html");
        // navigate();
    }

    /**
     * Navigate to the next page
     */
    function navigate() {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                let response = JSON.parse(this.responseText);
                let token = response.data.token.token;
                let userId = response.data.id;
                let userEmail= response.data.email;

                //set local storage here
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('user-id',userId);
                window.localStorage.setItem('user-email',userEmail);

                //navigate on successful login here.
                window.location.replace("list.html");
            }
        };

        let form = document.getElementById('form-login');
        var formData = new FormData(form);

        let url = urlModule.header + urlModule.loginURL;

        xhttp.open("POST", url, true);

        xhttp.send(formData);

    }

    return {
        validateForm: validateForm,
        navigate: navigate
    }
})();

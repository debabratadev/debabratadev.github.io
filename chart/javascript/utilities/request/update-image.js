/**
 * Update Image module for the chart
 */
let updateImageModule = (function () {

    const method = "POST";
    const token = window.localStorage.getItem('token');

    /**
     * Send update Image Request
     */
    function updateImageRequest(chartId) {

        const url = urlModule.header + urlModule.chartBaseURL + urlModule.chartBgURL + chartId;

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                chartBackgroundImage(this.responseText);
            }
        };

        let form = document.getElementById('chart-image').files[0];

        let formData = new FormData();
        formData.append('chart_reference', form);

        xhttp.open(method, url, true);
        xhttp.setRequestHeader('Authorization', 'Bearer ' + token);

        xhttp.send(formData);
    }

    /**
     * Change the background Image for the chart
     * 
     * @param {*} response is the chart data
     */
    function chartBackgroundImage(response) {
        response = JSON.parse(response);
        let data = response.data;
        mainModule.gkhead.src = data;
        bgHelper.setChartAddress(data);

        //need to update the background image
        mainModule.updateChart();
    }

    /**
     * Handles whether the image exist or not
     */
    function isImageExist(url){
    
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                return url;
            } else{
                return null;
            }
        };

        xhttp.open("GET", url, true);
        xhttp.send(null);
    }


    return {
        updateImageRequest: updateImageRequest,
        isImageExist:isImageExist
    }

})();
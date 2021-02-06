/**
 * It handles feature for background of images
 */
var bgHelper = (function () {

    /**
     * Maintain the aspect ratio of the background images here
     * 
     * @param {*} id   is the document id here
     * @param {*} img  is the image 
     */
    function aspectRatio(id, img) {

        let divWidth = id.clientWidth;
        let divHeight = id.clientHeight;

        let bgWidth = img.width;
        let bgHeight = img.height;


        let hratio = divWidth / bgWidth;
        let vratio = divHeight / bgHeight;

        let ratio = Math.min(hratio, vratio);

        return {
            width: img.width * ratio,
            height: img.height * ratio
        }
    }

    /**
     * Sets the Reference Chart here
     */
    function setChartReference(url) {
        let chartImage = document.getElementById('chart-image-div');
        // chartImage.style.backgroundImage = "url(../images/Eden.jpg)";  
        chartImage.style.backgroundImage = "url(" + url + ")";
        chartImage.style.backgroundSize = "100% 100%";
    }

    /**
     * Set the chart to new address
     */
    function setChartAddress(url) {
        let chartImage = document.getElementById('chart-image-div');
        chartImage.style.backgroundImage = "url(" + url + ")";
        chartImage.style.backgroundSize = "100% 100%";

    }

    return {
        aspectRatio: aspectRatio,
        setChartReference: setChartReference,
        setChartAddress: setChartAddress,
    }
})();
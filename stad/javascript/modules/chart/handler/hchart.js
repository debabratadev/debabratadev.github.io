/**
 * Handles event for chart
 */
var chartHandler = (function () {

    /**
     * Add Listener for Chart
     */
    function addListener() {

        //chart name
        let chartNameId = document.getElementById('chart-name');
        chartNameId.addEventListener('change', chartInspector.setChartName);

        document.getElementById('chart-image').addEventListener('change',mainModule.uploadImage);
        
    }
    return {
        addListener: addListener
    }

})();
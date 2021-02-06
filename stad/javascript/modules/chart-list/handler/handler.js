
/**
 * Different handler for chart list 
 */

window.onload = function () {
    document.getElementById('body').onload = chartListModule.initialise();
    document.getElementById('chart-new').addEventListener('click',chartListModule.createNewChart);
    document.getElementById('log-out-btn').addEventListener('click',chartListModule.logOut);
    document.getElementById('chart-search').addEventListener('keyup',chartListModule.filterChartOnName);
};



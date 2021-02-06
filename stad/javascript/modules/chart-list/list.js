/**
 * Main chart list module
 */
var chartListModule = (function () {

    let userId = localStorage.getItem('user-id');
    let token = localStorage.getItem('token');
    let emailId = localStorage.getItem('user-email');

    let del = false;
    let chartList = [];
    let chartCounter = 0;

    /**
     * Initialise the list module
     */
    function initialise() {
        document.getElementById('user-email').value = emailId;
        fetchListOfChart();
    }

    /**
     * Fetch list of chart 
     */
    function fetchListOfChart() {

        const url = urlModule.header + urlModule.chartBaseURL + "user/" + userId;

        const getMethod = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + token
            },
        }

        fetch(url, getMethod)
            .then(response => response.json())
            .then(data => processListOfChart(data))
            .catch(err => fetchListOfChart())
    }

    /**
     * Process the List of chart
     * 
     * @param {*} data is the user data 
     */
    function processListOfChart(data) {

        let length = data.data.length;
        let chartName;
        chartList = [];

        for (let index = 0; index < length; ++index) {
            let id = data.data[index][0];
            let src = data.data[index][2];

            let chartData = data.data[index][4];
            chartData = JSON.parse(chartData);

            if (chartData == null) {
                chartName = "Untitled";
            } else {
                chartName = chartData[8]['chart']['name'];
            }

            if (!src) {
                src = "http://localhost/Chart/ui/images/Eden.jpg";
                // src=null;
            }

            chartList.push({ 'id': id, 'src': src, 'name': chartName });

            listHandlingModule.createList(id, src, chartName);
        }

        //Show no chart if no chart is availbel

        if (!length) {
            document.getElementById('no-card').style.display = "block";
        }

        chartCounter = length;
    }

    /**
     * On basis of name filter the chart.
     * TODO - working with regular expression for this
     */
    function filterChartOnName() {

        let value = document.getElementById('chart-search').value;
        value = value.trim();

        listHandlingModule.clearList();

        for (let index = 0; index < chartList.length; ++index) {

            let id = chartList[index]['id'];
            let src = chartList[index]['src'];
            let chartName = chartList[index]['name'];

            if (helperModule.regularExpressionSearch(value, chartName)) {
                listHandlingModule.createList(id, src, chartName);
            }
        }
    }

    /**
     * Create New Chart.
     */
    function createNewChart() {

        const url = urlModule.header + urlModule.chartBaseURL + urlModule.createChart;

        let data = {
            'user_id': userId,
            'chart_data': "null"
        }

        processNewChart(token, url, data);
    }

    /**
     * Handle the chart to be available
     * 
     * @param {*} node 
     */
    function selectedChart(node) {

        let chartId = node.id;

        window.localStorage.setItem('new-chart', false);
        window.localStorage.setItem('chart-id', chartId);

        if (!del) {
            window.location.assign('chart.html');
        }
        del = false;
    }

    /**
     * Navigate to new chart
     * Process the new chart
     * 
     * @param {*} token   is the token stored
     * @param {*} url     is the api;s url
     * @param {*} data    is the data to be sent
     * 
     * @return chart_id;  
     */
    function processNewChart(token, url, data) {

        const postMethod = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        }

        fetch(url, postMethod)
            .then(response => handleNavigation(response))       //handle navigation here
            .then(data => storeNewChartId(data)) //handle local storage here
            .catch(err => console.log(err))
    }

    /**
     * Handle the navigation of the chart 
     * 
     * @param {*} response  is the response object 
     */
    function handleNavigation(response) {
        if (response.status == 200) {
            window.location.assign('chart.html');
        }
        return response.json();
    }

    /**
     * Store the new chart data to the localstorage
     * 
     * @param {*} data
     */
    function storeNewChartId(data) {

        let id = data.data.id;
        window.localStorage.setItem('new-chart', true);
        window.localStorage.setItem('chart-id', id);
    }

    /**
     * Delet the chart from list
     */
    function deleteChartFromList(chartId) {

        const url = urlModule.header + urlModule.chartBaseURL + chartId;

        const deleteMethod = {
            method: 'DELETE', // Method itself
            headers: {
                'Content-type': 'application/json; charset=UTF-8', // Indicates the content
                'Authorization': 'Bearer ' + token
            },
        }

        fetch(url, deleteMethod)
            .then(response => response.json())
            .then(data => {
                --chartCounter;
                if (!chartCounter) {
                    document.getElementById('no-card').style.display = "block";
                }
            }) // Manipulate the data retrieved back, if we want to do something with it
            .catch(err => console.log(err)) // Do something with the error

        del = true;
    }

    /**
     * Log out from the charting application
     */
    function logOut() {
        localStorage.clear();
        window.location.assign('login.html');
    }

    /**
     * Set the delete var
     * To stop outward propagation
     */
    function setDeleteVar() {
        del = true;
    }

    return {
        initialise: initialise,
        createNewChart: createNewChart,
        selectedChart: selectedChart,
        deleteChartFromList: deleteChartFromList,
        setDeleteVar: setDeleteVar,
        logOut: logOut,
        filterChartOnName: filterChartOnName
    }

})();
/**
 * Update the json for chart to the database
 * Represent the current state of operation
 */
let updateChartModule = (function () {

    let spinner = document.getElementById('chart-spinner');
    let state = document.getElementById('spinner-state');

    /**
     * Update the chart TODO -- when update chart failed
     */
    function updateChart(data, chartId) {

        // let token = window.localStorage.getItem('token');
        // const url = urlModule.header+urlModule.chartBaseURL + chartId;

        // data = stringifyData(data);

        // const putMethod = configurePutMethod(data,token);

        // spinner.classList.add('fa-spin');
        // state.innerHTML = "Saving";

        // fetch(url, putMethod)
        //     .then(response => {
        //             if(response.status == 200){
        //                 spinner.classList.remove('fa-spin');
        //                 state.innerHTML ="Saved";
        //             }
        //             return response.json()
        //         })
        //     .then(data => console.log("updateed", data)) // Manipulate the data retrieved back, if we want to do something with it
        //     // .then(data => data = data) // Manipulate the data retrieved back, if we want to do something with it
        //     .catch(err => console.log(err)) // Do something with the error
    }

    /**
     * It stringify the given data
     *
     * @param {*} data
     */
    function stringifyData(data){
        let cache = [];

       return  JSON.stringify(data, function (key, value) {
            if (typeof value === "object" && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    return;
                }
                cache.push(value);
            }

            return value;
        });
    }

    /**
     * This functions confgure the put method
     *
     * @param {*} data  is the chart data
     * @param {*} token is the token for auth
     */
    function configurePutMethod(data,token){

        return {
            method: 'PUT', // Method itself
            headers: {
                'Content-type': 'application/json; charset=UTF-8', // Indicates the content
                'Authorization': 'Bearer ' + token
            },
            body: data
        }
    }

    return {
        updateChart: updateChart
    }
})();
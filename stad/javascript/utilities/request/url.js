/**
 * Contains the list of url used
 */
var urlModule = (function () {

    const base ="/";
    const header = base +"Chart/api/chart/";

    //chart URL
    const chartBaseURL = "happsnow/v1/charts/";
    const createChart ="create";

    //background URL
    const chartBgURL = "background/image/";

    //user URL
    const userURL = "happsnow/v1/users/";

    //Login
    const loginURL = "happsnow/v1/users/login";

    //Media URL
    const mediaURL = "happsnow/v1/medias/";

    return {
        header:header,
        chartBaseURL:chartBaseURL,
        chartBgURL:chartBgURL,
        userURL:userURL,
        createChart:createChart,
        loginURL:loginURL,
        mediaURL:mediaURL
    }
}
)();

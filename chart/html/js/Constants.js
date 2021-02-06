/*
*
*All global variables are defined here
*
*
*/

var MAINCANVAS,
    COMPARECANVAS,
    NAVIGATORCANVAS,
    UTILITY;

var Constants =  {
    version: '1.4.6',
    pdfBaseUrl: 'http://192.168.9.129:8081/OpalPdfServer/',
    soapBaseUrl: 'http://192.168.9.129:9090/OPAL_V3_Phase2/',
    loginCheckUrl : 'http://192.168.9.129:9090/OPAL_V3_Phase2/loginCheck.htm',
    hamServerPath: 'http://192.168.9.129:9090',

    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    hamReady: false,
    userInfo : { //This will be updated at server side
        readOnly: '',
        collaboration: '',
        userId: '',
        stageId: '',
        lineId: '',
        taskId: '',
        annotationInfo: {
            userRole: '',
            userName: '',
            email: '',
            filename: '',
            lang: '',
            backgroundColor: ''
        }
    },
    colorData: {},
    pageNumber: 0,
    totalPages: 0,
    actionLoaded: false,
    skipAuthentication: false,
    actionUrl: {
        homePageUrl: "/businessProcess/taskDashBoardIndex.htm",
        approveArtworkUrl: "/businessProcess/saveReviewInputs.htm",
        requestAmendUrl: "/businessProcess/saveReviewInputs.htm",
        getUserCommandUrl: "soap/getUserCommand.htm",
        defaultLanguageUrl: "jam/en.htm",
        loadColorUrl: "soap/loadColors.htm",
        loadStickiesUrl: "soap/loadStickies.htm",
        updateStickiesUrl: "soap/updateStickies.htm",
        deleteStickiesUrl: "soap/deleteStickies.htm",
        deleteCommentUrl: "soap/deleteComment.htm",
        addStickiesUrl: "soap/addStickies.htm",
        addCommentUrl: "soap/addComment.htm",
        updateCommentUrl: "soap/updateComment.htm",
        loadStagesUrl: "soap/loadStages.htm"

    },
    extjsImgDirectory: 'libs/extjs/resources/themes/images/gray/',
    topToolbarHeight: 38,
    bottomToolbarHeight: 30,
    hundredPercentDpi: 72,
    pdfFile: '',
    assetName :'',
    maxDpi: 2304,
    separationColor: 'All',
    imagePath: 'resources/images/',
    compare: {
        activated: false,
        stageId: null,
        pdfFile: null
    },
    basket : false,

    //If other sites need to pass some extra params to their APIs from HAM
    configs: {
        acceptRejectExtraParams: '',
        soapExtraParams: {}
    }
};

var Events = {
    shake: {
        shakeThreshold: 700,
        lastUpdate: 0,
        lastX: undefined,
        lastY: undefined,
        lastZ: undefined
    }
};

if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);
}
function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity,
        curTime = new Date().getTime();
    if ((curTime - Events.shake.lastUpdate) > 100) {
        var diffTime = curTime - Events.shake.lastUpdate;
        Events.shake.lastUpdate = curTime;

        var x = acceleration.x,
            y = acceleration.y,
            z = acceleration.z,
            speed = Math.abs(x + y + z - Events.shake.lastX - Events.shake.lastY -
                Events.shake.lastZ) / diffTime * 10000;

        if (speed > Events.shake.shakeThreshold) {
            if(Ham) {
                Ham.application.getController('HamController').resetHam();
            }
        }
        Events.shake.lastX = x;
        Events.shake.lastY = y;
        Events.shake.lastZ = z;
    }
}
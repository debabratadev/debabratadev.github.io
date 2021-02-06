/**
 * Handles properties for chart reference 
 */
function Background() {

    this.realheight;
    this.realwidth;
    this.ctx;
    this.img;

    this.draw = function(ctx, bgImg, canvas) {

        this.ctx = ctx;
        this.img = bgImg.src;

        let hratio = canvas.width / bgImg.width;

        let vratio = canvas.height / bgImg.height;
        var ratio = Math.min(hratio, vratio);

        //to center the canvas..    //Will change here the other code..
        var centerShift_x = (canvas.width - bgImg.width * ratio) / 2;
        var centerShift_y = (canvas.height - bgImg.height * ratio) / 2;

        // var centerShift_x = canvas.width / 2;
        // var centerShift_y = canvas.height / 2;

        this.realheight = centerShift_x;
        this.realwidth = centerShift_y;

        // //Todo later
        this.ctx.clearRect(-1000, -1000, 1000 * canvas.width, 1000 * canvas.height);
        this.ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height,
            centerShift_x, centerShift_y, bgImg.width * ratio, bgImg.height * ratio);
    }
}
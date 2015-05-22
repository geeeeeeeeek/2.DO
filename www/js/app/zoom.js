/**
 * Created by Tong on 05.01.
 */
define(function() {
    function zoom() {
        var wWidth = $(window).width();
        $('body').css('zoom', wWidth / 1080);
        window.screenRatio = wWidth / 1080;
    }
    return zoom;
});

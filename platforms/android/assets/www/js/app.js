require(['./config'], function () {

    require(['jquery', 'backbone', 'fastclick','backbone.localStorage-min'], function ($, Backbone, FastClick) {
        window.$ = $;
        window.Backbone = Backbone;
        window.FastClick = FastClick;

        require(['app/router'], function () {
            /*Router has started.*/
        });


        $(function () {
            require(['app/zoom'], function (zoom) {
                zoom();
            });

            FastClick.attach(document.body);
        });

    });

});
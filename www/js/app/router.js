/**
 * Created by Tong on 05.20.
 */

define(function () {

    var AppRouter = Backbone.Router.extend({

        routes: {
            '': 'todo'
        },

        todo: function () {
            require(['app/views/todos-view'], function (todos_view) {
                $('.inner-wrapper').html(new todos_view().el);
            })
        }

    });
    window.Router = new AppRouter();
    Backbone.history.start();
});
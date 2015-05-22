/**
 * Created by Tong on 05.22.
 */
define(function () {
    var LogModel = Backbone.Model.extend({
        defaults: {
            'text': 'This is an example TODO.',
            'date': '20150520',
            'time': '12:00'
        }
    });

    return LogModel;
});
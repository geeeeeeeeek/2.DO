/**
 * Created by Tong on 05.22.
 */
define(['app/models/log'], function (LogModel) {
    var LogCollection = Backbone.Collection.extend({
        model: LogModel,
        models: [],

        localStorage: new Backbone.LocalStorage('logs'),

        log: function (todo) {
            var log = new LogModel();
            if (todo.get('completed') == true) {
                log.set('text', 'Completed task <em style="color: #808080">' + todo.get('text') + '</em>.');
                log.set('time', todo.get('time'));
            } else {
                log.set('text', 'Created task <em style="color: #808080">' + todo.get('text') + '</em>.');

                var date = new Date();
                var time = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
                    + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                log.set('time', time)
            }

            this.add(log);
            return log;
        }

    });

    return LogCollection;
});
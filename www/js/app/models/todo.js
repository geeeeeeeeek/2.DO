/**
 * Created by Tong on 05.20.
 */

define(function () {
    var TodoModel = Backbone.Model.extend({
        defaults: {
            'text': 'This is an example TODO.',
            'date': '20150520',
            'completed': false,
            'category': 'WORK',
            'time': '12:00',
            'starred': false
        },

        toggleComplete: function () {
            this.save({completed: !this.get('completed')});
        },

        toggleStar: function () {
            this.save({starred: !this.get('starred')});
        },

        getFormattedTime: function () {
            return this.get('time');
        }
    });

    return TodoModel;
});
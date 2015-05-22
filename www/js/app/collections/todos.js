/**
 * Created by Tong on 05.20.
 */

define(['app/models/todo'], function (TodoModel) {
    var TodoCollection = Backbone.Collection.extend({
        model: TodoModel,
        models: [],

        localStorage: new Backbone.LocalStorage('todos'),

        getCompleted: function () {
            return this.where({completed: true});
        },

        getRemained: function () {
            return this.where({completed: false})
        }

    });

    return TodoCollection;
});
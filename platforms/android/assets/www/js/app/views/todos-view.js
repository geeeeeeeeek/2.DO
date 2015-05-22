/**
 * Created by Tong on 05.20.
 */


define(['text!html/homepage/homepage.html', 'app/models/todo',
        'app/collections/todos', 'app/views/todo-view', 'app/models/log',
        'app/collections/logs', 'app/views/me-view'],
    function (todos_template, TodoModel, TodoCollection, TodoView, LogModel, LogCollection, MeView) {
        var TodosView = Backbone.View.extend({
            el: todos_template,
            events: {
                'click #todo-add': 'startAdding',
                'click .button-done': 'completeAdding',
                'click .todos-new-wrapper-blank': 'clearAdding',
                'keydown input.todos-new': 'completeAdding',
                'click .tab': 'switchTab',
                'click .button-complete-all': 'completeAll',
                'click .button-clear-all': 'clearAll',
                'click .button-clear-history': 'clearHistory',
                'click .button-more': 'toggleMenu',
                'click .todos-menu-wrapper-blank': 'toggleMenu',
                'click .me-card-more-todo': function () {
                    $('#todo-tab').click();
                }, 'click .me-card-more-done': function () {
                    $('#done-tab').click();
                }
            },
            todos: new TodoCollection(),
            logs: new LogCollection(),

            initialize: function () {
                this.$activeTab = this.$('#todo-tab');
                this.$activePage = this.$('#todo-page');

                this.listenTo(this.todos, 'add', this.render);
                this.listenTo(this.todos, 'reset', this.renderAll);
                this.listenTo(this.logs, 'add', this.renderLog);
                this.listenTo(this.logs, 'reset', this.logAll);
                this.listenTo(this.todos, 'destroy', this.destroyTodo);
                this.listenTo(this.todos, 'change:completed', this.completeTodo);

                this.todos.fetch({reset: false});
                this.todoFetchCompleted = true;
                this.logs.fetch({reset: false});
                this.stopListening(this.logs, 'add', this.renderLog);

            },

            render: function (model) {
                if (!model)
                    return;

                if (this.todoFetchCompleted) {
                    this.log(model);
                }
                var view = new TodoView(model);
                if (model.get('completed') == false) {
                    this.$('#todo-page').prepend(view.el);
                } else {
                    this.$('#done-page').prepend(view.el);
                }

                this.updateMeNum();
            },

            renderAll: function () {
                this.$('#todo-page').html('');
                this.$('#done-page').html('');

                var self = this;
                _.each(this.todos, function (todo) {
                    self.render(todo);
                });
            },

            renderLog: function (log) {
                var view = new MeView(log);
                this.$('.me-items').prepend(view.el);
            },

            log: function (model) {
                if (!model)
                    return;

                var log = this.logs.log(model);
                log.save();
                this.renderLog(log);
            },

            logAll: function () {
                this.$('#me-page').html('');

                var self = this;
                _.each(this.logs, function (log) {
                    self.log(log);
                })
            },

            startAdding: function () {
                this.$('.todos-new-wrapper').fadeToggle('medium');
                this.$('input.todos-new').focus();
            },

            completeAdding: function (ev) {
                if (ev.type == 'keydown' && ev.which != 13) {
                    /*Only finish editing when ENTER down.*/
                    return;
                }
                var text = this.$('input.todos-new').val();
                var todo = new TodoModel();

                todo.set('text', text);
                this.todos.add(todo);
                todo.save();

                this.clearAdding();

                if (this.$activeTab != this.$('#todo-tab')) {
                    this.$('#todo-tab').click();
                }
            },

            clearAdding: function () {
                this.$('.todos-new-wrapper').fadeToggle('medium');
                this.$('input.todos-new').val('');
            },

            switchTab: function (ev) {
                /*Switch high lighting tab*/
                this.$activeTab.removeClass('selected').addClass('unselected');
                this.$activeTab = $(ev.currentTarget);
                this.$activeTab.removeClass('unselected').addClass('selected');
                /*Switch page to display*/
                this.$activePage.fadeToggle(0);
                var activeTabId = this.$activeTab.attr('id');
                var activePageId = activeTabId.substr(0, activeTabId.indexOf('-')) + "-page";
                this.$activePage = this.$("#" + activePageId);
                this.$activePage.fadeToggle('medium');
            }
            ,

            completeTodo: function (model) {
                this.render(model);
            },

            completeAll: function () {
                var remained = this.todos.getRemained();
                _.each(remained, function (item) {
                    item.toggleComplete();
                });
                this.toggleMenu();
            },

            clearAll: function () {
                var completed = this.todos.getCompleted();
                _.each(completed, function (item) {
                    item.destroy();
                });
                this.toggleMenu();
            },

            toggleMenu: function () {
                this.$('.menu-modal').toggle(100, 'swing');
            },

            destroyTodo: function () {
                this.updateMeNum();
            },

            updateMeNum: function () {
                this.$('.me-card-more-todo>.me-card-more-num').html('(' + this.todos.getRemained().length + ')');
                this.$('.me-card-more-done>.me-card-more-num').html('(' + this.todos.getCompleted().length + ')');
            },

            clearHistory: function () {
                var history = this.logs.models;
                while (history[0]) {
                    history[0].destroy();
                    history = this.logs.models;
                }
                this.toggleMenu();

                var ctx = this;
                setTimeout(function () {
                    ctx.$('.me-items').fadeToggle('medium');
                }, 300);
                setTimeout(function () {
                    ctx.$('.me-items').html('');
                    ctx.$('.me-items').fadeToggle('fast');
                }, 900);
            }
        });

        return TodosView;
    }
)
;
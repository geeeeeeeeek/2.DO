/**
 * Created by Tong on 05.20.
 */

define(['text!html/homepage/todo-item.html', 'app/models/todo'],
    function (todo_template, TodoModel) {
        var TodoView = Backbone.View.extend({
            model: TodoModel,
            template: _.template(todo_template),
            events: {
                'click div.todo-item-title-line': 'toggleFunctionLine',
                'click input.todo-item-text-editor': function (ev) {
                    ev.stopPropagation();
                },
                'click svg.todo-item-modify': 'startEditingText',
                'click svg.todo-item-tag': 'startEditingTag',
                'click svg.todo-item-star': 'toggleStar',
                'click svg.todo-item-delete': 'deleteTodo',
                'click svg.todo-item-complete': 'toggleComplete',
                'keydown input.todo-item-text-editor': 'completeEditingText',
                'keydown input.todo-item-tag-modal': 'completeEditingTag',
                'click input.todo-item-tag-modal': function (ev) {
                    ev.stopPropagation();
                }
            },

            enabled: true,
            showingFuncLine: false,

            initialize: function (model) {
                /*If it is a newly added item, initialize it.*/
                var date = new Date();
                var time = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
                    + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                model.save({time: time});

                this.model = model;
                this.render();
                this.listenTo(this.model, 'change:completed', this.destroyView);
                this.listenTo(this.model, 'destroy', this.destroyView);
            },

            render: function () {
                if (this.model.changed.id !== undefined) {
                    return;
                }

                this.$el.html(this.template(this.model.attributes));

                if (this.model.get('starred') == true) {
                    this.$('path.svg-star').css('fill', '#e6d600');
                    this.$('.todo-item-star').css('display', 'inline-block');
                }

                this.$el.css('display', 'none');
                var ctx = this;
                setTimeout(function () {
                    ctx.$el.slideDown('middle');
                }, 0);

            },

            toggleFunctionLine: function () {
                this.$('.todo-item-func-line').slideToggle('fast');
                if (this.model.get('starred') == false) {
                    this.$('.todo-item-star').fadeToggle('fast');
                }
                this.$('.todo-item-modify').fadeToggle('fast');
                this.$('.todo-item-more').fadeToggle('fast');
                this.showingFuncLine = !this.showingFuncLine;
            },

            toggleStar: function (ev) {
                ev.stopPropagation();
                if (this.showingFuncLine) {
                    if (this.model.get('starred') == false) {
                        this.$('path.svg-star').css('fill', '#e6d600');
                    } else {
                        this.$('path.svg-star').css('fill', '#bebebe');
                    }
                } else {
                    this.$('.todo-item-star').fadeToggle('fast');
                    this.$('path.svg-star').css('fill', '#bebebe');
                }

                this.model.toggleStar();
            },

            toggleComplete: function () {
                if (!this.enabled)
                    return;

                this.$('.todo-item-text').fadeToggle(0);
                this.$('.todo-item-text').css('text-decoration', 'line-through');
                this.$('.todo-item-text').fadeToggle('fast');

                this.model.toggleComplete();
            },

            toggleEnable: function () {
                this.enabled = !this.enabled;
                if (this.enabled == true) {
                    this.$('path.svg-blue').css('fill', '#03a9f4');
                    this.$('path.svg-red').css('fill', '#f44336');
                } else {
                    this.$('path.svg-blue').css('fill', '#bebebe');
                    this.$('path.svg-red').css('fill', '#bebebe');
                }
            },

            deleteTodo: function () {
                if (!this.enabled)
                    return;

                this.model.destroy();

                this.toggleEnable();

            },

            startEditingText: function (ev) {
                ev.stopPropagation();
                this.$('.todo-item-text-editor').val(this.model.get('text'))
                    .css('display', 'block').focus();
                this.toggleEnable();
            },

            /** Callback when editing finished.
             * There are two ways, on ENTER pressed or the input blurred.
             * */
            completeEditingText: function (ev) {
                if (ev.type == 'keydown' && ev.which != 13) {
                    /*Only finish editing when ENTER down.*/
                    return;
                }
                this.toggleEnable();
                var text = this.$('.todo-item-text-editor').val();
                this.model.save({text: text});
                this.$(".todo-item-text").text(text);
                this.$('.todo-item-text-editor').css('display', 'none');
                /*Use animation to inform user the editing mode has ended.*/
                this.toggleFunctionLine();
            },

            startEditingTag: function (ev) {
                if (!this.enabled)
                    return;

                ev.stopPropagation();
                this.$('.todo-item-tag-modal').val(this.model.get('category'))
                    .css('display', 'block').focus();
                this.toggleEnable();
            },

            completeEditingTag: function (ev) {
                if (ev.type == 'keydown' && ev.which != 13) {
                    /*Only finish editing when ENTER down.*/
                    return;
                }
                this.toggleEnable();
                var tag = this.$('.todo-item-tag-modal').val();
                this.model.save({category: tag});
                this.$(".todo-item-category").text(tag);
                this.$('.todo-item-tag-modal').css('display', 'none');
                /*Use animation to inform user the editing mode has ended.*/
                this.toggleFunctionLine();
            },

            destroyView: function () {
                if (!this.enabled)
                    return;

                var ctx = this;

                setTimeout(function () {
                    ctx.$el.fadeToggle('medium');
                }, 300);
                setTimeout(function () {
                    ctx.$el.html('');
                }, 900);
            }

        });

        return TodoView;
    }
)
;
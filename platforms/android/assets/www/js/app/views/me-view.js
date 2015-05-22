/**
 * Created by Tong on 05.22.
 */
define(['text!html/homepage/me-item.html', 'app/models/log'],
    function (me_template, LogModel) {
        var MeView = Backbone.View.extend({
            model: LogModel,
            template: _.template(me_template),
            events: {},

            initialize: function (model) {
                this.model = model;
                this.render();
            },

            render: function () {
                if (this.model.changed.id !== undefined) {
                    return;
                }

                this.$el.html(this.template(this.model.attributes));

                this.$el.css('display', 'none');
                var ctx = this;
                setTimeout(function () {
                    ctx.$el.slideDown('middle');
                }, 0);

            }


        });

        return MeView;
    }
)
;
(function ($) {
    var options = {
        value: '',
        value_param: ''
    };
    $.widget('ui.t11e_input', $.ui.t11e_search, {options: options});
    $.ui.t11e_input.defaults = options;

    /*jslint nomen: false */
    $.ui.t11e_input.prototype._create = function () {
        var self = this;
        var o = self.options;

        $.ui.t11e_search.prototype._subscribe_events.apply(self, arguments);

        if (self.element.is('input[type="text"]') || self.element.is('input[type="hidden"]')) {
            if ('' === o.value_param) {
                var input_name = self.element.attr('name');
                if (t11e.util.is_defined(input_name) &&
                    '' !== input_name) {
                    o.value_param = input_name;
                }
            } else {
                self.element.attr('name', o.value_param);
            }
            self.element.addClass('t11e-widget-form' +
                ' ui-' + self.widgetName +
                ' ui-widget' +
                ' ui-widget-content');
            if (o.disabled) {
                self.element.addClass('ui-' + self.widgetName + '-disabled ui-disabled');
            }
            var changed = function (evt) {
                if (!self.ignore_event) {
                    t11e.event.trigger('update_request.' + o.search_group, function (params) {
                        self._save_params(params);
                    });
                }
            };
            self.element.bind('change', changed);
        } else {
            t11e.util.error('t11e_input widget must be a text input or hidden input');
        }
    };

    $.ui.t11e_input.prototype._load_params = function (params) {
        var self = this;
        var o = self.options;
        var values = params[o.value_param];
        var value = t11e.util.is_defined(values) ? values[0] : '';
        value = t11e.util.is_defined(value) ? value : '';
        self.ignore_event = true;
        try {
            self.value(value);
        } finally {
            self.ignore_event = false;
        }
    };

    $.ui.t11e_input.prototype._save_params = function (params) {
        var self = this;
        var o = self.options;
        var val = self.value();
        if ('' !== val && !o.disabled) {
            params[o.value_param] = [val];
        } else {
            delete params[o.value_param];
        }
        self._reset_pagination();
    };

    $.ui.t11e_input.prototype._clear_params = function (params) {
        var self = this;
        var o = self.options;
        delete params[o.value_param];
        delete params[o.page_param];
    };

    $.ui.t11e_input.prototype.value = function (value) {
        var self = this;
        var o = self.options;
        if (arguments.length) {
            o.value = $.trim(value);
            self.element.val(o.value);
            self.element.change();
        }
        return self.element.val();
    };

    $.ui.t11e_input.prototype.enable = function () {
        var self = this;
        $.Widget.prototype.enable.apply(self, arguments);
        self.attr('disabled', false);
        self.element.change();
    };

    $.ui.t11e_input.prototype.disable = function () {
        var self = this;
        $.Widget.prototype.disable.apply(self, arguments);
        self.element.attr('disabled', true);
        self.element.change();
    };

    $.ui.t11e_input.prototype.destroy = function (value) {
        var self = this;
        $.Widget.prototype.destroy.apply(this, arguments);
        self.element.removeClass('t11e-widget-form' +
            ' ui-' + self.widgetName +
            ' ui-widget' +
            ' ui-widget-content' +
            ' ui-' + self.widgetName + '-disabled'
        );
        return self;
    };
}(jQuery));

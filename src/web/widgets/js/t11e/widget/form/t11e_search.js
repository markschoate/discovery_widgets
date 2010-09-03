(function ($) {
    var options = {
        page_param: 'page',
        search_group: 'default'
    };
    $.widget('ui.t11e_search', {options: options});
    $.ui.t11e_search.defaults = options;

    /*jslint nomen: false */
    $.ui.t11e_search.prototype._subscribe_events = function () {
        var self = this;
        var o = self.options;
        self.ignore_event = false;
        t11e.event.subscribe('request.' + o.search_group, function (params) {
            self._load_params(params);
        });
        t11e.event.subscribe('clear_params_from_search.' + o.search_group,
            function (params) {
                self._clear_params(params);
            });
    };
    /*jslint nomen: false */
    $.ui.t11e_search.prototype._reset_pagination = function () {
        var self = this;
        delete params[self.options.page_param];
    };

    /*jslint nomen: false */
    $.ui.t11e_search.prototype._load_params = function (params) {};
    /*jslint nomen: false */
    $.ui.t11e_search.prototype._save_params = function (params) {};
    /*jslint nomen: false */
    $.ui.t11e_search.prototype._clear_params = function (params) {};

}(jQuery));

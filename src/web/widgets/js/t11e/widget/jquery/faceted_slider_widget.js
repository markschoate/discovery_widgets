/**
 * @copyright Transparensee Systems, Inc.
 * @fileOverview t11e.widget.jquery.SliderWidget definition
 */

t11e.util.define_namespace('t11e.widget.jquery');
if (false) {
    t11e.widget.jquery.prototype.Eclipse__Outline__Hack = undefined;
}

/**
 * Single handled slider widget.
 *
 * <h2>Options</h2>
 *
 * <dl>
 *    <dt>css_class</dt>
 *    <dd>An option CSS class to be applied to this widget instance to facilitate custom styling.</dd>
 *
 *    <dt>title</dt>
 *    <dd>The widget's title, which is displayed on the page.</dd>
 *
 *    <dt>search_group</dt>
 *    <dd>The search group this widget is associated with.</dd>
 *
 *    <dt>param</dt>
 *    <dd>The query parameter this widget is associated with.</dd>
 *
 *    <dt>min_value</dt>
 *    <dd>The minimum value for the slider range.</dd>
 *
 *    <dt>max_value</dt>
 *    <dd>The maximum value for the slider range.</dd>
 *
 *    <dt>step</dt>
 *    <dd>The increment value for the slider. The default is '1'.</dd>
 *
 *    <dt>page_param</dt>
 *    <dd>Causes the pagination widget to reset when when this widget is updated. The 'page_param' value
 *    must be set to the same as the pagination widget's 'page_param' value.</dd>
 * </dl>
 *
 * <h2>Example</h2>
 * <div class="t11e-widget t11e-widget-jquery-slider t11e-widget-id-2105">
 *   <div class="t11e-hd t11e-widget-jquery-slider-hd">Rating</div>
 *   <div class="t11e-bd t11e-widget-jquery-slider-bd">
 *     <div class="amount"></div>
 *     <div class="slider-control"></div>
 *   </div>
 *   <div class="t11e-ft t11e-widget-jquery-slider-ft"></div>
 * </div>
 * <script type="text/javascript">
 * //<!--
 *   if ('undefined' === typeof t11e) { t11e = {}; }
 *   if ('undefined' === typeof t11e.widget_options) { t11e.widget_options = {}; }
 *   t11e.widget_options['2105'] = {
 *     "max_value": 5,
 *     "min_value": 0,
 *     "search_group": "default",
 *     "page_param": "page",
 *     "param": "rating"
 *   };
 * //-->
 * </script>
 *
 * @name t11e.widget.jquery.FacetedSliderWidget
 * @class A single-handled slider.
 */
t11e.widget.jquery.FacetedSliderWidget = function ($) {
    t11e.util.log("init FacetedSliderWidget");
    var options = t11e.widget_options[$(this).attr('t11e-widget-id')];
    var search_group = options.search_group;
    var dimension = options.dimension;
    var facets = $(this).find(".t11e-facets:first");
    var amount = $(this).find(".t11e-amount:first");
    var slider_ctl = $(this).find(".t11e-slider-control:first");
    var slider_options = {
        'min': Number(options.min_value),
        'max': Number(options.max_value),
        'step': Number(options.step) > 0 ? Number(options.step) : 1
    };
    slider_ctl.slider(slider_options);

    var value_to_param = function (value) {
        t11e.util.log('calling value to param', value);
        return t11e.widget.jquery.util.call_func($, value, options.value_to_param);
    };

    var param_to_value = function (param) {
        t11e.util.log('calling param to value', param);
        return t11e.widget.jquery.util.call_func($, param, options.param_to_value);
    };

    var update_amounts = function (event, ui) {
        if (t11e.util.is_defined(options.format) &&
            t11e.util.is_function(options.format)) {
            options.format($, amount, ui.value);
        }
        else {
            amount.html(ui.value);
        }
    };

    slider_ctl.bind('slide', update_amounts);
    update_amounts(null, slider_options);

    if (t11e.util.is_defined(dimension)) {
        /**
        * @function
        * @description
        * @param {Object} search The search response object.
        */
        var update_from_response = function (search) {
            var current = slider_ctl.slider('value');
            var cmap = {};
            var facet_counts =
                t11e.widget.jquery.util.get_dimension_drilldown($, search, dimension);
            if (t11e.util.is_defined(facets)) {
                sparkline_values = [];
                for (var facet in facet_counts) {
                    sparkline_values.push(facet_counts[facet]);
                    if (facet === current) {
                        cmap[facet] = '#f00';
                    } else {
                        cmap[facet] = '#ccc';
                    }
                }
                t11e.util.log(sparkline_values);
                facets.sparkline(sparkline_values, {
                    type: 'bar',
                    barWidth: 16,
                    barSpacing: 11,
                    colorMap: cmap
                });
            }
        };
        /**
         * Subscribe to the response topic.
         * @param {String} response.search_group
         * @param {Function} callback
         */
        t11e.event.subscribe('response.' + search_group, update_from_response);
    }

    var ignore_event = false;
    /** @scope t11e.widget.jquery.SliderWidget */
    /**
     * This function is used as a callback for the <code>request</code> event and it is
     * used to update the slider's state from the current search parameters
     * object. The new value is read from the <code>params</code> object and the slider
     * updated accordingly. See {@link t11e.widget.activate_search_page } for a
     * complete list of events.
     * @param params
     */
    var load_from_params = function (params) {
        var values = params[options.param];
        var param_value = (t11e.util.is_defined(values) && values.length > 0) ? values[0] : 0;
        var value = param_to_value(param_value);
        if (value !== slider_ctl.slider('value')) {
            ignore_event = true;
            try {
                slider_ctl.slider('value', value);
            } finally {
                ignore_event = false;
            }
            update_amounts(null, {'value': Number(value)});
        }
    };
    t11e.event.subscribe('request.' + search_group, load_from_params);

    /** @scope t11e.widget.jquery.SliderWidget */
    /**
     * This function is used as a callback for the <code>update_request</code> event.
     * It takes a single argument, which is the search parameters object,
     * a mapping of search parameters to their values. The function sets the
     * value of the parameter from the <code>options.param</code> variable with the slider's
     * current value. Whenever the search criteria gets updated, any pagination
     * widgets on the page need to be reset. In this case, the slider widget
     * removes the <code>options.page_param</code> value from the search parameters object.
     * See {@link t11e.widget.activate_search_page } for a
     * complete list of events.
     * @function
     * @param params Search parameters
     */
    var save_to_params = function (params) {
        var value = slider_ctl.slider('value');
        params[options.param] = [value_to_param(value)];
        t11e.util.remove_param(params, options.page_param);
    };

    slider_ctl.bind('slidechange', function (event, ui) {
        if (!ignore_event) {
            t11e.event.trigger('update_request.' + search_group, save_to_params);
        }
    });

    var clear_params_from_search = function (params) {
        t11e.util.remove_param(params, options.param);
        t11e.util.remove_param(params, options.page_param);
    };
    t11e.event.subscribe('clear_params_from_search.' + search_group, clear_params_from_search);
};
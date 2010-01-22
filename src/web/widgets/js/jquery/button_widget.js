/**
 * @copyright Transparensee Systems, Inc.
 * @fileOverview t11e.widget.jquery.ButtonWidget definition
 */

/**
 * <h2>Options</h2>
 * <dl>
 *    <dt>search_group</dt>
 *    <dd>The search group this widget is associated with.</dd>
 *
 *    <dt>event_name</dt>
 *    <dd>The event_name option is a template that is filled in with the rest of
 *       the options.</dd>
 * </dl>
 *
 * <h2>Reset Search Example</h2>
 * <div class="t11e-widget t11e-widget-jquery-button t11e-widget-id-2041">
 *   <div class="t11e-hd t11e-widget-jquery-button-hd"></div>
 *   <div class="t11e-bd t11e-widget-jquery-button-bd">
 *     <a href="#">Reset</a>
 *   </div>
 *   <div class="t11e-ft t11e-widget-jquery-button-ft"></div>
 * </div>
 * <script type="text/javascript">
 * //<!--
 *   if ('undefined' === typeof t11e) { t11e = {}; }
 *   if ('undefined' === typeof t11e.widget_options) { t11e.widget_options = {}; }
 *   t11e.widget_options['2041'] = {
 *     "event_name": "reset_search"
 *      };
 * //-->
 * </script>
 *
 * <h2>Clear Search Example</h2>
 * <pre class="brush: html">
 * <![CDATA[
 * <div class="t11e-widget t11e-widget-jquery-button t11e-widget-id-2043">
 *   <div class="t11e-hd t11e-widget-jquery-button-hd"></div>
 *    <div class="t11e-bd t11e-widget-jquery-button-bd">
 *      <a href="#">Clear</a>
 *    </div>
 *   <div class="t11e-ft t11e-widget-jquery-button-ft"></div>
 * </div>
 * <script type="text/javascript">
 * //<!--
 *   if ('undefined' === typeof t11e) { t11e = {}; }
 *   if ('undefined' === typeof t11e.widget_options) { t11e.widget_options = {}; }
 *   t11e.widget_options['2043'] = {
 *     "event_name": "clear_search.${search_group}",
 *     "search_group": "realestate"
 *      };
 * //-->
 * </script>
 * ]]>
 * </pre>
 * @name t11e.widget.jquery.ButtonWidget
 * @class Implements a button that triggers a configured event.
 */
t11e.util.declare('t11e.widget.jquery.ButtonWidget', function ($) {
    var options = t11e.widget_options[$(this).attr('t11e-widget-id')];
    var event_name = $.template(options.event_name).apply(options);
    var button = $(this).find('.t11e-widget-jquery-button-bd:first a');

    button.bind('click', function (event) {
        t11e.event.trigger(event_name);
        event.preventDefault();
        event.stopPropagation();
    });
});

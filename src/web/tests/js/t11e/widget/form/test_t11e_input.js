(function ($) {
    module('Options', {
        setup: function () {
            var input_el = $('<input name="test" />');
            t11e.util.log(input_el.length);
            $('#qunit-fixture', document).append(input_el);
        },
        teardown: function () {
        }
    });

    test('Initialize - defaults', function () {

        var input = $('input', $('#qunit-fixture')).t11e_input();
        t11e.util.log(input.t11e_input('option', 'value_param'));
        t11e.util.log(input.t11e_input('option', 'value'));
        t11e.util.log(input.t11e_input('option', 'page_param'));
        t11e.util.log(input.t11e_input('option', 'search_group'));

    });

    test('Initialize - with options', function () {
        var input = $('input', $('#qunit-fixture')).t11e_input({
            'value_param': 'k',
            'value': '100',
            'page_param': 'p',
            'search_group': 'tango'
        });
        t11e.util.log(input.t11e_input('option', 'value_param'));
        t11e.util.log(input.t11e_input('option', 'value'));
        t11e.util.log(input.t11e_input('option', 'page_param'));
        t11e.util.log(input.t11e_input('option', 'search_group'));
    });

    var test_input = function (input) {
        same(input('value'), 'Hello', 'Expected "Hello:');
        start();
    };

    module('Hello', {
        setup: function () {
            var input_el = $('<input name="test" />');
            t11e.util.log(input_el.length);
            $('#qunit-fixture', document).append(input_el);
            t11e.event.subscribe('update_request.default', test_input(input_el));
        },
        teardown: function () {
            t11e.event.unsubscribe('update_request.default', test_input);
        }
    });

    test('Change input', function () {
        var widget = $('input');
        widget.t11e_input();
        stop();
        widget.t11e_input('value', 'Hello');
    });

}(jQuery));

/**
 * @copyright Transparensee Systems, Inc.
 * @fileOverview t11e.widget.jquery.TextBoxWidget definition
 */

t11e.util.define_namespace('t11e.widget.jquery');
if (false) {
    t11e.widget.jquery.prototype.Eclipse__Outline__Hack = undefined;
}

t11e.widget.jquery.text_highlighter = function ($, target, template, matcher) {
    var highlight_text_node = function (node) {
        var replacement = [];
        var expr = /\w+/g;
        var text = node.nodeValue;
        var last_pos = 0;
        while (null !== (match = expr.exec(text))) {
            var token = match[0];
            if (matcher(token)) {
                replacement.push(document.createTextNode(text.substring(last_pos, match.index)));
                var highlighted = $(template);
                highlighted.text(token);
                replacement.push(highlighted[0]);
                last_pos = match.index + token.length;
            }
        }
        if (replacement.length > 0) {
            replacement.push(document.createTextNode(text.substring(last_pos)));
            var parent = node.parentNode;
            for (var i = 0; i < replacement.length; i++) {
                parent.insertBefore(replacement[i], node);
            }
            parent.removeChild(node);
        }
    };
    var highlight_nodes = function (node) {
        if (node.nodeType === Node.TEXT_NODE) {
            highlight_text_node(node);
        } else {
            $(node.childNodes).each(function (i, elem) {
                highlight_nodes(elem);
            });
        }
    };
    highlight_nodes(target);
};

t11e.widget.jquery.text_token_filter_factory = function ($, tokens) {
//    var append_variant = function (target, token, before, after) {
//        var pos = token.lastIndexOf(before);
//        if (pos === token.length - before.length) {
//            var variant = token.substring(0, pos) + after;
//            if ($.inArray(variant, target) === -1) {
//                target.push(variant);
//            }
//        }
//    };
    var expanded_tokens = [];
    $(tokens).each(function (i, token) {
        if ($.inArray(token, expanded_tokens) === -1) {
            if (token.substr(token.length - 1, 1) === "*")
            {
                // deal with "startsWith" tokens
                expanded_tokens.push(token.substr(0, token.length - 1));
            } else {
                expanded_tokens.push(token);
            }
            // Manually duplicate some tokens with new suffixes if they
            // match, a partial reversion of step3 of the Porter stemmer
            // algorithm. Step2 y to i has been rolled into some of these.
//            append_variant(expanded_tokens, token, 'ive', 'iviti');
//            append_variant(expanded_tokens, token, 'ive', 'ivity');
//            append_variant(expanded_tokens, token, 'ble', 'biliti');
//            append_variant(expanded_tokens, token, 'ble', 'bility');
//            append_variant(expanded_tokens, token, 'ate', 'ator');
//            append_variant(expanded_tokens, token, 'ate', 'ation');
//            append_variant(expanded_tokens, token, 'ize', 'ization');
//            append_variant(expanded_tokens, token, 'ble', 'bli');
//            append_variant(expanded_tokens, token, 'ble', 'bly');
//            append_variant(expanded_tokens, token, 'ance', 'anci');
//            append_variant(expanded_tokens, token, 'ance', 'ancy');
//            append_variant(expanded_tokens, token, 'ence', 'enci');
//            append_variant(expanded_tokens, token, 'ence', 'ency');
//            append_variant(expanded_tokens, token, 'ate', 'ational');
        }
    });
    return function (token) {
        token = token.toLowerCase();
        var match = false;
        for (var i = 0; i < expanded_tokens.length; i++) {
            var expanded = expanded_tokens[i];
            if (token.indexOf(expanded) === 0) {
                match = true;
                break;
            }
        }
        return match;
    };
};

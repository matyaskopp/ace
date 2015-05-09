define(function(require, exports, module) {
    "use strict";

    var TokenIterator = require("../token_iterator").TokenIterator;
    function is(token, type) {
        return token.type.lastIndexOf(type) > -1;
    }

    var PmltqCompletions = function() {

    };

    (function() {
        this.$compldata = [];
        this.addCompletion = function(value, type, meta) {
            this.$compldata.push({
                meta: meta,
                //                caption : caption,
                value: value,
                score: Number.MAX_VALUE,
                className: type
            });
        }
        this.getCompletions = function(state, session, pos, prefix) {
            var token = session.getTokenAt(pos.row, pos.column);
            if (!token || is(token,"comment")) return [];
            return this.$compldata;
        };

    }).call(PmltqCompletions.prototype);

    exports.PmltqCompletions = PmltqCompletions;
});

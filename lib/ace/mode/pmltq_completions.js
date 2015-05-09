define(function(require, exports, module) {
    "use strict";

    var TokenIterator = require("../token_iterator").TokenIterator;

    var PmltqCompletions = function() {

    };

    (function() {
        this.$compldata = [];
        this.addCompletion = function(value, meta) {
            this.$compldata.push({
                meta: meta,
                //                caption : caption,
                value: value,
                score: Number.MAX_VALUE
            });
        }
        this.getCompletions = function(state, session, pos, prefix) {
            var token = session.getTokenAt(pos.row, pos.column);
            if (!token) return[];
            return this.$compldata;
        };

    }).call(PmltqCompletions.prototype);

    exports.PmltqCompletions = PmltqCompletions;
});

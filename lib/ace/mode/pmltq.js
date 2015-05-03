define(function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    // defines the parent mode
    var TextMode = require("./text").Mode;
    var Tokenizer = require("../tokenizer").Tokenizer;

    // defines the language specific highlighters and folding rules
    var PmltqHighlightRules = require("./pmltq_highlight_rules").PmltqHighlightRules;
    var WorkerClient = require("../worker/worker_client").WorkerClient;
    var Range = require("../range").Range;

    var Mode = function() {
        // set everything up
        this.HighlightRules = PmltqHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        // configure comment start/end characters
        this.lineCommentStart = "#";

        // By default ace keeps indentation of previous line
        this.getNextLineIndent = function(state, line, tab) {
            var indent = this.$getIndent(line);
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
            return indent;
        };

        this.checkOutdent = function(state, line, input) {
            if (!/^\s+$/.test(line)) return false;
            return /^\s*[\}\]\)]/.test(input);
        };

        this.autoOutdent = function(state, doc, row) {
            var line = doc.getLine(row);
            var match = line.match(/^(\s*[\}\]\)])/);
            if (!match) return 0;
            var column = match[1].length;
            var openBracePos = doc.findMatchingBracket({
                row: row,
                column: column
            });
            if (!openBracePos || openBracePos.row == row) return 0;
            var indent = this.$getIndent(doc.getLine(openBracePos.row));
            doc.replace(new Range(row, 0, row, column - 1), indent);
        };

        // create worker for live syntax checking
        /*
    this.createWorker = function(session) {
        var worker = new WorkerClient(["ace"], "ace/mode/pmltq_worker", "PmltqWorker");
        worker.attachToDocument(session.getDocument());
        worker.on("errors", function(e) {
            session.setAnnotations(e.data);
        });
        return worker;
    };
*/

        this.setKeywords = function(data) {
            console.log("################" + data);
        }
    }).call(Mode.prototype);

    exports.Mode = Mode;
});

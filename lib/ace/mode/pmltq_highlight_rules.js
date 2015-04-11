define(function(require, exports, module) {
"use strict";



var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var r_Selector_name = "(?:\\$[a-zA-Z_][a-zA-Z0-9_]*\\b)";
var r_VAR_OR_SELF = "(?:"+r_Selector_name+"|\\$\\$)";
var r_VAR_REF = "(?:\\$[0-9]+)";

var r_STRING = "(?:'(?:[^'\\\\]+|\\\\.)*'|\"(?:[^\"\\\\]+|\\\\.)*\")";
var r_NUMBER = "(?:-?[0-9]+(?:\\.[0-9]+)?)";
var r_literal = "(?:"+r_STRING+"|"+r_NUMBER+")";

var r_OP = "(?:[-+*&]|\\bdiv\\b|\\bmod\\b)";
var r_LOGIC = "(?:\\band\\b|\\bor\\b|!)";
var r_CMP = "(?:\\?|!?=|!?~\\*?|[<>]=?)";
var r_OP_OTHER = "(?::=|,|(?:!\\s*)?\\bin\\b|->|::|\\.\\.|;|>>)";
var r_OPERATOR = "(?:"+r_OP+"|"+r_LOGIC+"|"+r_CMP+"|"+r_OP_OTHER+")";

var r_PAR = "(?:[\\[\\]{}()])";

var PmltqHighlightRules = function() {
   this.setKeywords = function(tok,reg) {
         this.$rules.start.push({token: tok, regex: "\\b"+reg+"\\b"});
   }


   
   this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "#.*$",
                comment: "START"
            },
            {
                token : "support.variable",
                regex : "(?:"+r_VAR_OR_SELF+"|"+r_VAR_REF+")",
            },
            {
                token : "support.constant",
                regex : r_literal,
            },
            {
                token : "OPERATOR",
                regex : r_OPERATOR,
            },
            {
                token : "PAR",
                regex : r_PAR,
            },
            {
                token : "VAR.D3",
                regex : "for",
            },
        ],
 
  };

//  this.normalizeRules(); // IMPORTANT (this cause push/pop to work)
};

oop.inherits(PmltqHighlightRules, TextHighlightRules);

exports.PmltqHighlightRules = PmltqHighlightRules;

});

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


var PmltqHighlightRules = function() {

   this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "#.*$",
                comment: "START"
            },

        ],
 
  };

  this.normalizeRules(); // IMPORTANT (this cause push/pop to work)
  
console.log(this.$rules);
};

oop.inherits(PmltqHighlightRules, TextHighlightRules);

exports.PmltqHighlightRules = PmltqHighlightRules;

});

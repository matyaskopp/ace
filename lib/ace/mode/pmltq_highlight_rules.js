define(function(require, exports, module) {
"use strict";


/************************************************/
function printStack(currentState, stack) { 
    var ret = "";
    for(var s in stack)ret = ret+stack[s].stack+" ("+stack[s].added+")\n\t";
    alert("printStack: "+currentState+"\nSTACK:\n\t"+ret);
    return currentState;
};

function _emptystack(currentState, stack) { // the last item in this._push array is on the top of stack
    if(stack.length == 0) {
      return this._next;
    } else {
      return "ERROR";
    }
};
function _push_next(currentState, stack) { // the last item in this._push array is on the top of stack
    if(this._push.constructor === Array) {
      for(var i in this._push)stack.unshift({stack: this._push[i],added: currentState});
    } else {
      stack.unshift({stack: this._push,added: currentState});
    }
//    alert("_push_next: "+currentState+"\nSTACK:\n\t"+stack.join("\n\t"));
    return this._next;
};
function _reset(currentState, stack) { // the last item in this._push array is on the top of stack
    stack = [];
    return "start";
};
function _rem_push_next(state,stack){
    for(var i in this._rem) {
      if(stack.length > 1 && stack[0].stack==this._rem[i]) stack.shift();
      else return "ERROR";
    }
    if(this._push.constructor === Array) {
      for(var i in this._push)stack.unshift({stack: this._push[i],added: state});
    } else {
      stack.unshift({stack: this._push,added: state});
    }
    return this._next;
};//*/
function _pop(currentState, stack) {
    if(this._log) printStack(currentState,stack);
    var s = stack.shift();
    if(currentState == "conditions" && !s) return "start"; //jump to start without semicolon at the end
    return  s ? s.stack : "ERROR";
};




function _log(value, currentState, stack) {
    return [
              {type:"ERROR1."+currentState, value: "@"},
           ];
};
/*********************************************************/



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
var r_CMP = "(?:\\?|!?=|!?~\\*?|[<>]=?|!?~)";
var r_OP_OTHER = "(?::=|,|(?:!\\s*)?\\bin\\b|->|::|\\.\\.|;)";
var r_OPERATOR = "(?:"+r_OP+"|"+r_LOGIC+"|"+r_CMP+"|"+r_OP_OTHER+")";

var r_PAR = "(?:[\\[\\]{}()])";

var PmltqHighlightRules = function() {
   this.setKeywords = function(tok,reg) {
         console.log(tok);
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
                token: "FILTER.D3",
                regex: ">>",
                next: "group_by"
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
        ],



        /******************FILTERS***********************/
        "group_by": [
            {
                token: ["SP","KEYWORD.FOR","SP"],
                regex: "(\\s*)(for)\\b(\\s*)",
/*
                onMatch: function(value, currentState, stack) {              
                    var tokens = value.split(this.splitRegex);
                    stack.unshift("give");
                    return [
                        {type:"SP.D", value: tokens[1]},
                        {type:"KEYWORD.FOR", value: tokens[2]},
                        {type:"SP.D", value: tokens[3]}
                    ];
                },
*/
                _push: "give",
                _next: "columns",
                next: _push_next

            },
            {
                token: ["SP","KEYWORD.GIVE","SP","KEYWORD.DISTINCT"],
                regex: "(\\s*)\\b(give)\\b(\\s*)((?:distinct)?)",
                _push: "sort_by",
                _next: 'columns',
                next: _push_next
            },
            {
                token: ["SP","KEYWORD.DISTINCT"],
                regex: "(\\s*)((?:distinct)?)",
                _push: "sort_by",
                _next: 'columns',
                next: _push_next
            }
        ],
        "give": [
            {
                token: ["SP","KEYWORD.GIVE","SP","KEYWORD.DISTINCT"],
                regex: "(\\s*)\\b(give)\\b(\\s*)((?:\\bdistinct\\b)?)",
                _push: "sort_by",
                _next: 'columns',
                next: _push_next
            }
        ], 
        "columns": [
            {
                token: ["SKIPCOLUMS"],
                regex: "((?:(?!(?:sort|give|>>)).)*)",
                next: _pop
            }
        ],
        "sort_by": 
        [
            { 
                token: ["KW.FILTER","SP","KEYWORD.SORTBY", "SORTBYPARAMS"],
                regex: "((?:>>)?)(\\s*)(\\bsort(?:\\s* by)?)(\\s*\\$"+r_NUMBER+"\\s*(?:asc|desc)?\\s*(?:,\\s*\\$"+r_NUMBER+"\\s*(?:asc|desc)?\\s*)*)",
                next: "filter"
            },
            {
                token: ["FILTER","SP","KEYWORD.FILTER"],
                regex: "(>>)(\\s*)((?:filter|where))",
                _push: "filter",
                _next: "col_comma_clause",
                next: _push_next
            },

        ],
        "filter" : [
            {
                token: ["FILTER","SP","KEYWORD.FILTER"],
                regex: "(>>)(\\s*)((?:filter|where))",
                _push: "filter",
                _next: "col_comma_clause",
                next: _push_next
            },
            {
                token: ["FILTER"],
                regex: "(>>)",
                next: "group_by"
            },
        ],
        "col_comma_clause" : [

            {
                token: "col_comma_clause",
                regex: ".*",
                next: _pop
            },
        ],
        "rowConstraint" : [
            {
                token: "rowConstraint.D4",
                regex: ".*",
                next: _pop
            },
        ],
        "columnExp":
        [
           {
                token: ["support.constant"],
                regex: "("+r_literal+")",
                next: _pop
           },
           {
                token: ["VAR.COLUMNREF"],
                regex: "(\\$"+r_NUMBER+")",
                next: _pop
           },
           
        ]
 
  };

//  this.normalizeRules(); // IMPORTANT (this cause push/pop to work)
};

oop.inherits(PmltqHighlightRules, TextHighlightRules);

exports.PmltqHighlightRules = PmltqHighlightRules;

});

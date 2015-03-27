define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;


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


function _from_comma_to_expression(currentState, stack) {
    var remove=false;
    var i = stack.length -1; 
    while( ! remove && i >= 0)
    {
      if(stack[i].stack == 'comma_clause') remove=true;
      i--;
    }
    while(remove && stack.length > 0)
    {
      if(stack.shift().stack == 'comma_clause') break;
    }
    if(this._push.constructor === Array) {
      for(var i in this._push)stack.unshift({stack: this._push[i],added: currentState});
    } else {
      stack.unshift({stack: this._push,added: currentState});
    }
    return   this._next;
};

function _log(value, currentState, stack) {
    return [
              {type:"ERROR1."+currentState, value: "@"},
           ];
};
  var BaseChar = "\\u0041-\\u005A\\u0061-\\u007A\\u00C0-\\u00D6\\u00D8-\\u00F6"+
      "\\u00F8-\\u00FF\\u0100-\\u0131\\u0134-\\u013E\\u0141-\\u0148\\u014A-\\u017E"+
      "\\u0180-\\u01C3\\u01CD-\\u01F0\\u01F4-\\u01F5\\u01FA-\\u0217\\u0250-\\u02A8"+
      "\\u02BB-\\u02C1\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03CE"+
      "\\u03D0-\\u03D6\\u03DA\\u03DC\\u03DE\\u03E0\\u03E2-\\u03F3\\u0401-\\u040C"+
      "\\u040E-\\u044F\\u0451-\\u045C\\u045E-\\u0481\\u0490-\\u04C4\\u04C7-\\u04C8"+
      "\\u04CB-\\u04CC\\u04D0-\\u04EB\\u04EE-\\u04F5\\u04F8-\\u04F9\\u0531-\\u0556"+
      "\\u0559\\u0561-\\u0586\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u063A\\u0641-"+
      "\\u064A\\u0671-\\u06B7\\u06BA-\\u06BE\\u06C0-\\u06CE\\u06D0-\\u06D3\\u06D5\\u06E5-"+
      "\\u06E6\\u0905-\\u0939\\u093D\\u0958-\\u0961\\u0985-\\u098C\\u098F-\\u0990\\u0993-"+
      "\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09DC-\\u09DD\\u09DF-\\u09E1\\u09F0-"+
      "\\u09F1\\u0A05-\\u0A0A\\u0A0F-\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32-"+
      "\\u0A33\\u0A35-\\u0A36\\u0A38-\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-"+
      "\\u0A8B\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2-\\u0AB3\\u0AB5-"+
      "\\u0AB9\\u0ABD\\u0AE0\\u0B05-\\u0B0C\\u0B0F-\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30"+
      "\\u0B32-\\u0B33\\u0B36-\\u0B39\\u0B3D\\u0B5C-\\u0B5D\\u0B5F-\\u0B61\\u0B85-"+
      "\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99-\\u0B9A\\u0B9C\\u0B9E-\\u0B9F\\u0BA3-"+
      "\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB5\\u0BB7-\\u0BB9\\u0C05-\\u0C0C\\u0C0E-"+
      "\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C60-\\u0C61\\u0C85-"+
      "\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CDE\\u0CE0-"+
      "\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D60-"+
      "\\u0D61\\u0E01-\\u0E2E\\u0E30\\u0E32-\\u0E33\\u0E40-\\u0E45\\u0E81-\\u0E82\\u0E84"+
      "\\u0E87-\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5"+
      "\\u0EA7\\u0EAA-\\u0EAB\\u0EAD-\\u0EAE\\u0EB0\\u0EB2-\\u0EB3\\u0EBD\\u0EC0-\\u0EC4"+
      "\\u0F40-\\u0F47\\u0F49-\\u0F69\\u10A0-\\u10C5\\u10D0-\\u10F6\\u1100\\u1102-"+
      "\\u1103\\u1105-\\u1107\\u1109\\u110B-\\u110C\\u110E-\\u1112\\u113C\\u113E\\u1140"+
      "\\u114C\\u114E\\u1150\\u1154-\\u1155\\u1159\\u115F-\\u1161\\u1163\\u1165\\u1167"+
      "\\u1169\\u116D-\\u116E\\u1172-\\u1173\\u1175\\u119E\\u11A8\\u11AB\\u11AE-\\u11AF"+
      "\\u11B7-\\u11B8\\u11BA\\u11BC-\\u11C2\\u11EB\\u11F0\\u11F9\\u1E00-\\u1E9B\\u1EA0-"+
      "\\u1EF9\\u1F00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-"+
      "\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE"+
      "\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC"+
      "\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2126\\u212A-\\u212B\\u212E\\u2180-\\u2182\\u3041-"+
      "\\u3094\\u30A1-\\u30FA\\u3105-\\u312C\\uAC00-\\uD7A3";
  var Ideographic = "\\u4E00-\\u9FA5\\u3007\\u3021-\\u3029";
  var Letter = BaseChar+Ideographic;
  var Digit =
       "\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u0966-\\u096F\\u09E6-\\u09EF"+
       "\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE7-\\u0BEF\\u0C66-\\u0C6F"+
       "\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29";
  var CombiningChar =
      "\\u0300-\\u0345\\u0360-\\u0361\\u0483-\\u0486\\u0591-\\u05A1\\u05A3-\\u05B9"+
      "\\u05BB-\\u05BD\\u05BF\\u05C1-\\u05C2\\u05C4\\u064B-\\u0652\\u0670\\u06D6-\\u06DC"+
      "\\u06DD-\\u06DF\\u06E0-\\u06E4\\u06E7-\\u06E8\\u06EA-\\u06ED\\u0901-\\u0903"+
      "\\u093C\\u093E-\\u094C\\u094D\\u0951-\\u0954\\u0962-\\u0963\\u0981-\\u0983\\u09BC"+
      "\\u09BE\\u09BF\\u09C0-\\u09C4\\u09C7-\\u09C8\\u09CB-\\u09CD\\u09D7\\u09E2-\\u09E3"+
      "\\u0A02\\u0A3C\\u0A3E\\u0A3F\\u0A40-\\u0A42\\u0A47-\\u0A48\\u0A4B-\\u0A4D\\u0A70-"+
      "\\u0A71\\u0A81-\\u0A83\\u0ABC\\u0ABE-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0B01-"+
      "\\u0B03\\u0B3C\\u0B3E-\\u0B43\\u0B47-\\u0B48\\u0B4B-\\u0B4D\\u0B56-\\u0B57\\u0B82-"+
      "\\u0B83\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD7\\u0C01-\\u0C03\\u0C3E-"+
      "\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55-\\u0C56\\u0C82-\\u0C83\\u0CBE-"+
      "\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5-\\u0CD6\\u0D02-\\u0D03\\u0D3E-"+
      "\\u0D43\\u0D46-\\u0D48\\u0D4A-\\u0D4D\\u0D57\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E"+
      "\\u0EB1\\u0EB4-\\u0EB9\\u0EBB-\\u0EBC\\u0EC8-\\u0ECD\\u0F18-\\u0F19\\u0F35\\u0F37"+
      "\\u0F39\\u0F3E\\u0F3F\\u0F71-\\u0F84\\u0F86-\\u0F8B\\u0F90-\\u0F95\\u0F97\\u0F99-"+
      "\\u0FAD\\u0FB1-\\u0FB7\\u0FB9\\u20D0-\\u20DC\\u20E1\\u302A-\\u302F\\u3099\\u309A";

  var Extender =
      "\\u00B7\\u02D0\\u02D1\\u0387\\u0640\\u0E46\\u0EC6\\u3005\\u3031-\\u3035\\u309D-"+
      "\\u309E\\u30FC-\\u30FE";

  var NameChar   = "[-._:"+Letter+Digit+CombiningChar+Extender+"]";
  var NCNameChar = "[-._"+Letter+Digit+CombiningChar+Extender+"]";
  var Name       = "(?:[_:"+Letter+"]"+NameChar+"*)";
  var NCName     = "(?:[_"+Letter+"]"+NCNameChar+"*)";
  var NmToken    = "(?:"+NameChar+"+)";

/************************************************/


var regexType = NCName;
var XMLNAME = Name;
var TYPE_PREFIX = "(?:"+Name+"\\s*\\?)";
var regexATTR_simple = "(?:\\[\\]|content\\(\\)|(?:\\[\\s*[0-9][0-9]*\\s*\\])"+XMLNAME+"|"+XMLNAME+"(?:\\[\\s*[0-9][0-9]*\\s*\\])?)";
var regexATTR = "(?:content\\(\\)|\\.|\\[\\s*[0-9][0-9]*\\s*\\]|(?:\\[\\s*[0-9][0-9]*\\s*\\])"+XMLNAME+"|"+XMLNAME+"(?:\\[\\s*[0-9][0-9]*\\s*\\])?)";
var regexSelector_name = "(?:\\$[a-zA-Z_][a-zA-Z0-9_]*\\b)";
var regexVAR_OR_SELF = "(?:"+regexSelector_name+"|\\$\\$)";

var r_OP = "(?:[-+*&]|div|mod)";
var r_LOGIC = "(?:and|or)";
var r_CMP = "(?:!?=|!?~\\*?|[<>]=?)";
var r_FUNC = "(?:(?:descendants|lbrothers|rbrothers|sons|depth_first_order|order_span_min|order_span_max|depth|lower|upper|length|substr|tr|replace|substitute|match|ceil|floor|round|trunc|percnt|name|type_of|id|file|tree_no|address|abs|exp|power|log|sqrt|ln)\\b)";
var r_STRING = "(?:'(?:[^'\\\\]+|\\\\.)*'|\"(?:[^\"\\\\]+|\\\\.)*\")";
var r_NUMBER = "(?:-?[0-9]+(?:\\.[0-9]+)?)";
var r_literal = "(?:"+r_STRING+"|"+r_NUMBER+")";
var r_OCCURR = "(?:[0-9][0-9]*|[0-9][0-9]*[+-]?|[0-9][0-9]*\\.\\.[0-9][0-9]*)(?:\\|(?:[0-9][0-9]*|[0-9][0-9]*[+-]?|[0-9][0-9]*\\.\\.[0-9][0-9]*))*x";
var LOG = {regex: ["."],onMatch:_log};

/************** RELATIONS *************************/
var user_defined = true;
var pmlrf_relations = true;

var regexDistanceInterval = "(?:\\{(?:-?[0-9][0-9]*)?,(?:-?[0-9][0-9]*)?\\})";
var regexRelationTree = "(?:(?:child|parent|same-tree-as|same-document-as)|(?:(?:sibling|descendant|ancestor)"+regexDistanceInterval+"?))";
var regexRelationOrdering = "(?:(?:depth-first-precedes|depth-first-follows|order-precedes|order-follows)"+regexDistanceInterval+"?)";

var regexRelationUserDefined = "";
var regexRelationPmlrfRelations = "";

// IMPORTANT !!! THIS DOES NOT WORK:
// (?=A(!=B))

// PERL REGEX: "(?:[_a-zA-Z][-.\\/_a-zA-Z]*(?=\\s*->|\\s*"+regexSelector_name+"(?!\\s*:=)|\\s+"+Name+"\\s*(?:\\[|\\$)))";
var regexRelationName = "(?:[_a-zA-Z][-.\\/_a-zA-Z]*(?!\\s*"+regexSelector_name+"\\s*:=)(?=\\s*->|\\s*"+regexSelector_name+"|\\s+"+Name+"\\s*(?:\\[|\\$)))";
// PERL REGEX: "(?:[_a-zA-Z][-.\\/_a-zA-Z]*(?=(?:\\{[0-9]*,[0-9]*\\})(?:\\s*->|\\s*"+regexSelector_name+"(?!\\s*:=)|\\s+"+Name+"\\s*(?:\\[|\\$))))";
var regexRelationName_param = "(?:[_a-zA-Z][-.\\/_a-zA-Z]*(?=(?:\\{[0-9]*,[0-9]*\\})(?!\\s*"+regexSelector_name+"\\s*:=)(?=\\s*->|\\s*"+regexSelector_name+"|\\s+"+Name+"\\s*(?:\\[|\\$))))";

var regexRelation = "(?:(?:(?:"+regexRelationTree+"|"+regexRelationOrdering;
if(user_defined && regexRelationUserDefined !== "") regexRelation += "|"+regexRelationUserDefined;
regexRelation += ")\\s*(?!->)(?:\\:\\:)?)";

if(pmlrf_relations && regexRelationPmlrfRelations !== "") regexRelation += "|(?:"+regexRelationPmlrfRelations+"(?:\\{\\s*[0-9]*,[0-9]*\\})?)\\s*(?!\\:\\:)(?:->)?)";
if(regexRelationName !== "") regexRelation += "|(?:"+regexRelationName+"\\s*(?!\\:\\:)(?:->)?)";
if(regexRelationName_param !== "") regexRelation += "|(?:"+regexRelationName_param+"\\{\\s*[0-9]*,[0-9]*\\}\\s*(?!\\:\\:)(?:->)?)";
regexRelation +=")";
/**********************************************/
var regexNotSelector = "(?!\\[\\s*\\d*\\s*\\][^ \\],]+)";


var PmltqHighlightRules = function() {

    var member_or_subquery = [
            {
                token: ["SP.member_or_subq"],
                regex: "(\\s\\s*)",

            },
            {
                token: ["MEMBER","SP","OPERATOR"],
                regex: "(member)(\\s*)((?:\\:\\:)?)",
                _push: "member",
                _next: "simple_attribute",
                next: _push_next

            }//TODO RELATION(?) selector
        ];
    var expression = [ //TODO
            {
                token: ["SP.expression"],
                regex: "(\\s\\s*)",
            },
            {
                token: ["OPERATOR.aritm"],
                regex: "("+r_OP+")",
                next: "term"
            },
            { // jump to predicate or flat_set_expression
                token: ["rPAR.expression"],
                regex: "(\\))",
                next: _pop
            },

      ];
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
   this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : "#.*$",
                comment: "START"
            },
            {
                token : ["SP","ERROR1.TESTS"],
                regex : "(\\s*)(@TEST.*@)",
                next: "TEST"

            },
            {
                token: ["OPERATOR.NOT_DISJOINT","SP","TYPE","SP","VAR","SP","OPERATOR.ASSIGN","SP", "lPAR"], /* (+)? (type)? var := [*/
                regex: "(\\+?)(\\s*)("+regexType+"?)(\\s*)("+regexSelector_name+")(\\s*)(:=)(\\s*)(\\[)",
                _push: ["conditions"],
                _next: "condition",
                next: _push_next

            },
            {
                token: ["OPERATOR.NOT_DISJOINT","SP","TYPE","SP", "rPAR"], /* (+)? (type)? [*/
                regex: "(\\+?)(\\s*)("+regexType+"?)(\\s*)(\\[)",
                _push: ["conditions"],
                _next: "condition",
                next: _push_next
            },
            {
                token: ["ERROR.start"],
                regex: "(\\])",
                next: "ERROR"
            },
            {
                token: "FILTER.D3",
                regex: ">>",
                next: "group_by"
            },

        ],
        
        "TEST" : [
            {
              token:["SP","RELATION.TEST.OK.regexRelationTree","REST"],
              regex: "(\\s*)("+regexRelationTree+"\\s(?!->)(?:\\:\\:)?)(.*)",
              next:"start"
            },
            {
              token:["SP","RELATION.TEST.OK.regexRelationOrdering","REST"],
              regex: "(\\s*)("+regexRelationOrdering+"\\s(?!->)(?:\\:\\:)?)(.*)",
              next:"start"
            },
            {
              token:["SP","RELATION.TEST.OK.regexRelationName","REST"],
              regex: "(\\s*)((?:"+regexRelationName+"\\s*(?!\\:\\:)(?:->)?))(.*)",
              next:"start"
            },
            {
              token:["SP","RELATION.TEST.OK.regexRelationName_param","REST"],
              regex: "(\\s*)((?:"+regexRelationName_param+"\\{\\s*[0-9]*,[0-9]*\\}\\s*(?!\\:\\:)(?:->)?))(.*)",
              next:"start"
            },
            {token: "ERROR",regex:".*",next:_reset}
        ],

        "ERROR" : [ 
            {token: "ERROR",regex:".*@E@.*",next:_reset},
            {defaultToken: "ERROR"}
        ],
        "conditions": [
            {
                token: "SP.conditions",
                regex: "\\s\\s*",
                next: "conditions"
            },
            { // new line can be in this rule
                token: "empty",
                regex: "^$",
                next: "conditions"
            },
            {
                token: ["rPAR.D.conditions","SP","SEMICOLON"],
                regex: "(\\])(\\s*)(;)",
                _next: "start",
                next: _emptystack
            },
            {
                token: ["SP","rPAR.conditions"],
                regex: "(\\s*)(\\])",
                next: _pop
            },
            {
                token: ["OPERATOR.COMMA.conditions"],
                regex: "(,)",
                _next: "condition",
                _push: ["conditions"],
                next: _push_next
            },
        ],
        "condition" : [
            {
                token: "SP.condition",
                regex: "\\s\\s*",
                next: "condition"
            },
            { // new line can be in this rule
                token: "empty",
                regex: "^$",
                next: "condition"
            },
/*            {
                token: ["rPAR.D","SP","SEMICOLON"],
                regex: "(\\])(\\s*)(;)",
                _next: "start",
                next: _emptystack
            },

            {
                token: ["rPAR.D"],
                regex: "(\\])",
                next: _pop
            },*/
            { /*member_selector*/  // it must be before TYPE
                token: ["OPERATOR.NOT","SP","OCCURRENCES","SP","MEMBER.D3","SP.D2","OPERATOR"] , 
                regex: "(!?)(\\s*)((?:"+r_OCCURR+")?)(\\s*)(member)(\\s*)((?:\\:\\:)?)",
                _push: "member", 
                _next: "simple_attribute",
                next: _push_next
            },


/*
          { // ??????????????????????????
                token: ["OPERATOR"],
                regex: "(\\b(:?and|or)\\b|,)"
            },
*/
            { /*nested_selector*/
                token: ["OPERATOR.NOT","SP","OCCURRENCES","SP","storage.type.optional","SP","OPERATOR.NOT_DISJOINT","SP","RELATION","SP","TYPE","SP","VAR","SP","OPERATOR.ASSIGN","SP", "lPAR"], /* (?)? (relation)? (type)? var := [*/
                regex: "(!?)(\\s*)((?:"+r_OCCURR+")?)(\\s*)(\\??)(\\s*)(\\+?)(\\s*)("+regexRelation+"?)(\\s*)("+regexType+"?)(\\s*)("+regexSelector_name+")(\\s*)(:=)(\\s*)(\\[)",
                _push: ["conditions"],
                _next: "condition",
                next: _push_next
            },
            { /*nested_selector*/
                token: ["OPERATOR.NOT","SP","OCCURRENCES","SP","storage.type.optional","SP","OPERATOR.NOT_DISJOINT","SP","RELATION","SP","TYPE.D3","SP", "lPAR"], /* (?)? (relation)? (type)? [*/
                regex: "(!?)(\\s*)((?:"+r_OCCURR+")?)(\\s*)(\\??)(\\s*)(\\+?)(\\s*)("+regexRelation+"?)(\\s*)("+regexType+"?)(\\s*)"+regexNotSelector+"(\\[)",
                _push: ["conditions"],
                _next: "condition",
                next: _push_next
            },

/*            { //! (               // IT IS DONE IN simple_test
                token: ["OPERATOR.NOT","SP","lPAR.D3"] , 
                regex: "(!?)(\\s*)(\\()", // TODO lookahead for matching parenthese: (?!.*)
                _push: ["condition","comma_clause"], // ?????
                _next: "test",
                next: _push_next            
            },*/
            { /*subquery*/
                token: ["OPERATOR.NOT","SP","OCCURRENCES"] , 
                regex: "(!?)(\\s*)("+r_OCCURR+")",
                //_push: "condition",
                //_next: "member_or_subq",
                //next: _push_next            
                next: "member_or_subq"
            },
            {
                token: ["JUMP"],
                regex: "(\\s*)(?=\\])",
                next: _pop
            },
            {
                token: ["JUMP"],
                regex: "(\\s*)(?=,)",
                next: _pop
            },

            { // to parse spaces at begining of rule is necessary
                token: "ERROR1.condition",
                regex: "(\\s*)",
                _next: "test",
                _push: "condition",   // ???                     
                next: _push_next
            },
        ],
        "test" : [
            {
                token: "SP.test",
                regex: "\\s\\s*",
//                next: "test"
            },
            {
                token: ["OPERATOR.NOT"],
                regex: "(!?)",
                _push: "or_and_clause",
                _next: "simple_test",
                next: _push_next
            },
            { // NEVER MATCH !!! /* to parse spaces at begining of rule is necessary*/
                regex: "\\s*",
                next: _pop
            },

        ],
        "or_and_clause" : [
            {
                token: "SP.or_and_clause",
                regex: "\\s\\s*",
                next: "or_and_clause"
            },
            {
                token: ["OPERATOR.logic","SP","OPERATOR.NOT"],
                regex: "(or|and)(\\s*)(!?)",
                _push: "or_and_clause",
                _next: "simple_test",
                next: _push_next
            },
            { /* to parse spaces at begining of rule is necessary*/
                regex: "\\s*",//"\\s*(?=[^\\s])",
                next: _pop
            },
        ],
        "comma_clause" : [
            {
                token: "SP.comma_clause",
                regex: "\\s\\s*",
                next: "comma_clause"
            },
            { // new line can be in this rule
                token: "empty",
                regex: "^$",
                next: "condition"
            },
            {
                token: ["OPERATOR.COMMA","SP","OPERATOR.NOT"],
                regex: "(,)(\\s*)(!?)",
                _push: "comma_clause",
                _next: "simple_test",
                next: _push_next
            },
            {
                token: ["rPAR.comma_clause"],
                regex: "(\\))",
                next: _pop
            },
            { /* to parse spaces at begining of rule is necessary*/
                regex: "\\s*",// "\\s*(?=[^\\s])",
                next: _pop
            },
        ],
        "term" : [
            {
                token: "SP.term",
                regex: "\\s\\s*",
                next:"term"
            },
            { // new line can be in this rule
                token: "empty",
                regex: "^$",
            },
            { 
                token: ["lPAR.expression.D3"] , 
                regex: "(\\()",
                _next: "term",
                _push: ["flat_expression","expression"],   //????? ????????????????????????????????????????????????????????????????????????????????????,
                next: _push_next
            },
            { /*FUNC*/             // !!!
                token: ["SP","FUNC","lPAR.func","PARAMS","rPAR.func"] , 
                regex: "(\\s*)("+r_FUNC+")(\\()([^\\)]*)(\\))",  // TODO better regexp for matching parentheses
                next: _pop
            },
/*            { // hack it is imposible to recognize TYPEPREFIX and ATTRIBUTE   // TODO check it is not needed probably
                token: ["ATTRIBUTE","SP","OPERATOR.IN.D","SP","lPAR.SET"],
                regex: "("+regexATTR_simple+")(\\s\\s*)(!?\\s*in)(\\s*)(\\{)",
                _push: ["flat_set_expression","flat_expression"],
                _rem: ["flat_expression","predicate"],
                _next: "term",
                next: _rem_push_next
            },	*/
            { //every + attribute_path
                token: ["OPERATOR.EVERY","SP","VAR","OPERATOR.DOT"],
                regex: "(\\*?)(\\s*)("+regexVAR_OR_SELF+")(\\.)",
                next: "simple_attribute"
            },
            { // every + simple_attribute
                token: ["OPERATOR.EVERY","SP","TYPEPREFIX.D5","SP","ATTRIBUTE"],
                regex: "(\\*?)(\\s*)((?:"+TYPE_PREFIX+")?)(\\s*)("+regexATTR_simple+")",
                next: "step"
            },            
            {
                token: ["support.constant"],
                regex: "("+r_literal+")",
                next: _pop
            },
            {
                token: ["VAR"],
                regex: "("+regexVAR_OR_SELF+")",
                next: _pop
            },
            {
                token: ["JUMP"],
                regex: "((?=,))",
                next: _pop
            },  
      ],
        "expression" : [expression],
        "predicate" : [
            {
                token: ["SP.predicate"],
                regex: "(\\s\\s*)",

            },
            { // new line can be in this rule
                token: "empty",
                regex: "^$",
            },
            { 
                token: ["OPERATOR.CMP"],
                regex: "("+r_CMP+")",
                _push: "flat_expression",
                _next: "term",
                next: _push_next
            } , 	
            { 
                token: ["OPERATOR.D","SP","lPAR.SET"],
                regex: "(!?\\s*in)(\\s*)(\\{)",
                _push: ["flat_set_expression","flat_expression"],
                _next: "term",
                next: _push_next
            },	
            {
                token: ["rPAR.expression"], // hack jumb to expression if followed by 'CMP' or '!? in'
                regex: "(\\))(?=\\s*(?:"+r_CMP+"|!?\\s*in))",
                _push: ["predicate"],
                _next: "flat_expression",
                next: _from_comma_to_expression
            },
            {
                token: ["rPAR.expression"], // hack jumb to expression if followed by 'r_op' 
                regex: "(\\))(?=\\s*"+r_OP+")",
                _push: ["predicate"],
                _next: "flat_expression",
                next: _from_comma_to_expression
            },
            {
                token: ["JUMP"],
                regex: "(\\s*)(?=[,\\]])",
                next: _pop
            },

        ],
        "flat_expression" : [ 
            {
                token: ["SP.flat_expression"],
                regex: "(\\s\\s*)",
            },
            { // new line can be in this rule
                token: "empty",
                regex: "^$",
                next: "condition"
            },
            {
                token: ["OPERATOR"],
                regex: "("+r_OP+")",
                next: "term"
            },
            {
                token: ["lPAR.expression"],
                regex: "(\\))",
                next: _pop
            },
            { // jump to predicate or flat_set_expression
                token: ["SP.D3"],
                regex: "(\\s*)",
                next: _pop
            },

        ],
        "flat_set_expression" : [
            {
                token: ["SP.flat_set_expression"],
                regex: "(\\s\\s*)",
            },
            { // new line can be in this rule
                token: "empty",
                regex: "^$",
            },
            {
                token: ["OPERATOR"],
                regex: "(,)",
                _push: ["flat_set_expression","flat_expression"],
                _next: "term",
                next: _push_next
            },
            {
                token: ["rPAR.SET"],
                regex: "(\\})",
                next: _pop // top???
            },
        ],
  
        "member_or_subq" : member_or_subquery,
  
        "member" : [
            {
                token: ["SP.member"],
                regex: "(\\s\\s*)",

            },
            { // new line can be in this rule
                token: "empty",
                regex: "^$",
            },
            {
                token: ["VAR","SP","OPERATOR.ASSIGN","SP", "lPAR.member"],
                regex: "("+regexSelector_name+")(\\s*)(:=)(\\s*)(\\[)",
                _push: ["conditions"],
                _next: "condition",
                next: _push_next

            },

            {
                token: ["lPAR.member"],
                regex: "(\\[)",
                _push: ["conditions"],
                _next: "condition",
                next: _push_next

            }//TODO bez přiřazení
        ],
        "simple_attribute" : [
            {
                token: ["SP.simple_attribute"],
                regex: "(\\s\\s*)",

            },
            { /*SIMPLE ATTRIBUTE*/
                token: ["TYPEPREFIX.D5","SP","ATTRIBUTE"],
                regex: "((?:"+TYPE_PREFIX+")?)(\\s*)("+regexATTR_simple+")",
                next: "step"
            },
            { /*SIMPLE ATTRIBUTE*/
                token: ["ATTRIBUTE"],
                regex: "("+regexATTR_simple+")",
                next: "step"
            },
            { /*SIMPLE ATTRIBUTE*/
                token: ["ERROR1.simple_attribute"],
                regex: "(.*)",
                next: "step"
            },

        ],
        "simple_test" : [
            {
                token: "SP.simple_test",
                regex: "\\s\\s*",
                next: "test"
            },
            // predicate | subquery_test | ref | ( comma_clause )
            //comma_clause
            {
                token: "lPAR.simple_test",
                regex: "\\(",
                _next: "test",
                _push: "comma_clause",
                next: _push_next
            },
            //ref
            { 
                token: ["RELATION.D","SP","VAR.D2"] , 
                regex: "("+regexRelation+")(\\s*)("+regexSelector_name+")",
                next: _pop//"simple_test"
            },
            //subquery_test
            { /*subquery*/
                token: ["OPERATOR.NOT","SP","OCCURRENCES"] , 
                regex: "(!?)(\\s*)((?:[0-9][0-9]*|[0-9][0-9]*[+-]?|[0-9][0-9]*\\.\\.[0-9][0-9]*)(?:\\|(?:[0-9][0-9]*|[0-9][0-9]*[+-]?|[0-9][0-9]*\\.\\.[0-9][0-9]*))*x)",
                //_push: "condition",
                //_next: "member_or_subq",
                //next: _push_next            
                next: "member_or_subq"
            },
            member_or_subquery,
            // predicate
            { // VAR_OR_SELF /!?=/ VAR_OR_SELF
                token: ["VAR","SP","OPERATOR.CMP","SP","VAR"] , 
                regex: "("+regexVAR_OR_SELF+")(\\s*)(!?=)(\\s*)("+regexVAR_OR_SELF+")",
                next: _pop
            },
            //predicate -> flat_expression

            { /* to parse spaces at begining of rule is necessary*/
                regex: "\\s*",
                _push: ["predicate","flat_expression"],
                _next: "term",
                next: _push_next
            },

            
/*
            { 
                token: ["SP","OPERATOR.LOGIC.D2","SP"],
                regex: "(\\s*)("+r_LOGIC+")(\\s*)", 
                next: "test"
            },
            { 
                token: ["SP","OPERATOR.COMMA.D2","SP"],
                regex: "(\\s*)(,)(\\s*)",
                next: _pop
            },
            { 
                token: ["SP","rPAR.D2","SP"],
                regex: "(\\s*)(\\))(\\s*)",
                next: "simple_test"
            },
            { 
                token: ["SP","lPAR.D2","SP"],
                regex: "(\\s*)(\\()(\\s\\s*)",
                next: "test"
            },
            { 
                token: ["SP","OPERATOR.D2","SP"],
                regex: "(\\s*)("+r_CMP+")(\\s*)",
                next: "test" //TODO fix:  there souldnt be end!!!
            },
            {
                token: "rPAR",
                regex: "\\]",
                next: _pop
            }
*/

        ],

        "step" : [
            {
                token: ["keyword.operator.slash","ATTRIBUTE"],
                regex: "(\\/)((?:\\.|"+regexATTR+"|(?:\\[\\s*[0-9][0-9]*\\s*\\])))"
            },
            {
                token: ["SP.D3"],
                regex: "(\\s*)",
                next: _pop
            }

        ],
        "group_by": [
            {
                token: ["SP.D","KEYWORD.FOR","SP"],
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
                token: ["SP.D","KEYWORD.GIVE.D2","SP","KEYWORD.DISTINCT"],
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
                token: ["SP.D4","KEYWORD.GIVE.D3","SP","KEYWORD.DISTINCT"],
                regex: "(\\s*)\\b(give)\\b(\\s*)((?:\\bdistinct\\b)?)",
                _push: "sort_by",
                _next: 'columns',
                next: _push_next
            }
        ], 
        "columns": [
            {
                token: ["SKIPCOLUMS.D5"],
                regex: "((?:(?!(?:sort|give|>>)).)*)",
                next: _pop
            }
        ],
        "sort_by": 
        [
            { 
                token: ["KW.FILTER","SP","KEYWORD.SORTBY", "SORTBYPARAMS.D"],
                regex: "((?:>>)?)(\\s*)(\\bsort(?:\\s* by)?)(\\s*\\$"+r_NUMBER+"\\s*(?:asc|desc)?\\s*(?:,\\s*\\$"+r_NUMBER+"\\s*(?:asc|desc)?\\s*)*)",
                _push: "filter",
                _next: "rowConstraint",
                next: _push_next
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
                token: "col_comma_clause.D3",
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

  this.normalizeRules(); // IMPORTANT (this cause push/pop to work)
  
console.log(this.$rules);
};

oop.inherits(PmltqHighlightRules, TextHighlightRules);

exports.PmltqHighlightRules = PmltqHighlightRules;

});

function highlightVariables(vars){
  $(".ace_VAR_H").removeClass('ace_VAR_H');
  for(var i in vars) $(".ace_"+vars[i]).addClass('ace_VAR_H');
}

define('pmltq_editor', ['require', 'exports', 'module', 'ace/keyboard/hash_handler'], function(require, exports, module) {

  exports.PmltqEditor = function(ace,element,theme,mode,schema){
    this.editor = ace.edit(element);
    

    this.editor.setTheme('ace/theme/pmltq');
    this.editor.setOptions({
                 showGutter: false, // hides line numbers with background
                 displayIndentGuides: false,
                 showPrintMargin: false,// hides 80 char rule - dont work
                     //completing
                 enableBasicAutocompletion: true,
                 enableSnippets: true,
                 enableLiveAutocompletion: true
        });
    this.editor.$blockScrolling = Infinity;

    var PmltqMode = require(mode).Mode;
    var PmltqMode = require("ace/mode/pmltq").Mode;
    var PMLTQMode = new PmltqMode();
    this.editor.session.setMode(PMLTQMode);
    
    








          var keywords = {};
          Object.keys(schema.node_types).forEach(function(type) {
            var a = schema.node_types[type];
            type+=".TYPE"
            keywords[type]=a.join("|") + (keywords[type] ? "|"+keywords[type] : "" );
            for (var i = a.length; i--; )
                PMLTQMode.$highlightRules.addNewRule("start",type,a[i]);
          });
          

          Object.keys(schema.attributes).forEach(function(type) {
            var a = schema.attributes[type];
            keywords[type]=a.join("|") + (keywords[type] ? "|"+keywords[type] : "" );
            for (var i = a.length; i--; ) {              
              PMLTQMode.$highlightRules.addAtributes(type,a[i]);
            }
          });
          PMLTQMode.$highlightRules.addDefaultPopRule("step");


          var relations = [[schema.relations,"RELATION"]];
          var r;
          while( r = relations.shift()) {
            var data = r[0];
            var type = r[1];
            Object.keys(data).forEach(function(t2) {
              var a = data[t2];
              t2 = type+"."+t2;
              if(Array.isArray(a)){
                keywords[t2]=a.join("|") + (keywords[t2] ? "|"+keywords[t2] : "" );
                for (var i = a.length; i--; ) PMLTQMode.$highlightRules.addAtributes(t2,a[i]);
              } else {
                 relations.push([a,t2]);
              }
            });
          }

          PMLTQMode.$highlightRules.addKeywords(keywords);          
//          PMLTQMode.$highlightRules.normalizeRules(); not needed        
          PMLTQMode.$tokenizer = null; // force recreation of tokenizer
          this.editor.session.bgTokenizer.setTokenizer(PMLTQMode.getTokenizer(PMLTQMode.$highlightRules.getRules()));
          this.editor.session.bgTokenizer.start(0);








/************* Testing event ***********/
/*
        editor.on('input', function() {
            var pos = editor.session.getSelection().getCursor();
            //alert(editor.session.getTokenAt(pos.row,pos.column));
            console.log(editor.session.getTokenAt(pos.row,pos.column));
            console.log(editor.session.getTokens(pos.row));
        });
*/
        editor.on('changeSelection', function() {
            var pos = editor.session.getSelection().getCursor();
            //alert(editor.session.getTokenAt(pos.row,pos.column));
            var token=editor.session.getTokenAt(pos.row,pos.column);
            if(token && token.type.match(/VAR\./)) highlightVariables(token.type.match(/var_[^\.]*/))
            $("#tokens").empty();
            $.each(editor.session.getTokens(pos.row),function(){
                   $("#tokens").append(this.type);
                   $("#tokens").append(" ");
            });
        });

return this;
  }




});

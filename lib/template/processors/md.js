var hljs = require('highlight.js')
var marked = require("marked").setOptions({ langPrefix: 'language-', headerPrefix: '' })
var TerraformError = require("../../error").TerraformError
var marked = require("marked")
var renderer = new marked.Renderer()

// This overrides Marked’s default headings with IDs,
// since this changed after v0.2.9
// https://github.com/sintaxi/harp/issues/328
renderer.heading = function(text, level){
  return '<h' + level + '>' +  text + '</h' + level + '>'
}

module.exports = function(fileContents, options){

  return {
    compile: function(){
      return function (locals){
        hljs.configure({
          tabReplace: '  ',
          classPrefix: ''
        })
        marked.setOptions({
          highlight: function (code, lang) {
            if (lang != null) {
              try {
                if (lang === 'c') {
                  lang = 'cpp';
                }
                return hljs.highlight(lang, code).value
              } catch (error) {
                return code
              }
            } else {
              return code
            }
          }
        })
        return marked(fileContents.toString().replace(/^\uFEFF/, ''), {
          renderer: renderer
        })
      }
    },

    parseError: function(error){
      error.stack = fileContents.toString()
      return new TerraformError(error)
    }
  }

}

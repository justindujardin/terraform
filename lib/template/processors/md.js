var hljs = require('highlight.js');
var marked = require("marked").setOptions({ langPrefix: 'language-', headerPrefix: '' })
var TerraformError = require("../../error").TerraformError

module.exports = function(fileContents, options){

   return {
      compile: function(){
         return function (locals){
            hljs.configure({
               tabReplace: '  ',
               classPrefix: ''
            })
            marked.setOptions({
               highlight:function(code, lang) {
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
            return marked(fileContents.toString().replace(/^\uFEFF/, ''))
         }
      },

      parseError: function(error){
         error.stack = fileContents.toString()
         return new TerraformError(error)
      }
   }

}
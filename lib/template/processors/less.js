var exec = require('sync-exec')
var less           = require("less")
var TerraformError = require("../../error").TerraformError

module.exports = function(fileContents, options){

  var processor = {
    compile: function(){
      return function() {
        var result = exec('./node_modules/.bin/lessc ' + options.filename);
        if(result.status !== 0){
          throw processor.parseError(result.stderr)
        }
        return "<style>" + result.stdout + "</style>"
      }
    },

    parseError: function(error){
      return new TerraformError({
        source: "Less",
        dest: "CSS",
        message: error,
        stack: fileContents.toString()
      })
    }
  }

  return processor

}
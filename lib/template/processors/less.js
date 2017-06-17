var exec = require('sync-exec')
var cleanCSS = require('clean-css')
var path = require('path')
var less = require("less")
var TerraformError = require("../../error").TerraformError

module.exports = function (fileContents, options) {

    var processor = {
        compile: function () {
            return function () {
                var dirs = [
                    path.dirname(options.filename),
                    path.dirname(path.resolve(options.basedir))
                ];

                var cmdPath = path.join(__dirname, '/../../../node_modules/.bin/lessc') + ' ' + options.filename;
                var cmdExec = cmdPath + " --include-path=" + dirs.join(':');
                var result = exec(cmdExec)
                if (result.status !== 0) {
                    throw processor.parseError(result.stderr)
                }
                return "<style>" + new cleanCSS(null).minify(result.stdout).styles + "</style>"
            }
        },

        parseError: function (error) {
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

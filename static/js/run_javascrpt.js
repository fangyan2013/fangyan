
var exec = require("child_process").exec;

var url = `${__dirname}`.replace(/\\/g, '/')


module.exports = {

	myTest :function(){

        return new Promise(function(resolve, reject) {
            var cmd = "electron "+url+"/../../rpa_js/test2.js";
            console.log(cmd,'cmdcmdcmd')
            exec(cmd,{
                maxBuffer: 1024 * 2000
            }, function(err, stdout, stderr) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else if (stderr.lenght > 0) {
                    reject(new Error(stderr.toString()));
                } else {
                    console.log(stdout);
                    resolve();
                }
            });
        });
    }
}
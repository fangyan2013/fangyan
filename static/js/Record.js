
var exec = require("child_process").exec;

module.exports = {

	myTest :function(file_name,url,obj){

        return new Promise(function(resolve, reject) {
            // var cmd = "npx playwright codegen --target javascript -o test2.js -b chromium https://www.baidu.com"
            var cmd = "npx playwright codegen --target javascript -o ./rpa_js/"+file_name+".js -b chromium "+url
            exec(cmd,{
                maxBuffer: 1024 * 2000
            }, function(err, stdout, stderr) {
                if (err) {
                    console.log(err);
                    console.log("1");
                    obj(1,file_name)
                    reject(err);
                } else if (stderr.lenght > 0) {
                    reject(new Error(stderr.toString()));
                    console.log("2");
                    obj(2,file_name)
                } else {
                    console.log(stdout);
                    resolve();
                    console.log("3");
                    obj(3,file_name)
                }
            });
            console.log("具体是个什么情况呀!!!!");
        });
    }
}
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
const {PythonShell} = require("python-shell");
var _ = require('underscore');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/', function (req, res) {

    res.setHeader('Content-Type', 'application/json');

  	if (!req.body.code || !req.body.timeoutMs) {
        res.status(400);
        res.end(JSON.stringify({error: "no code or timeout specified"}));
  	}
  	else {
  	    res.status(200);

  		// Write code to file
      fs.writeFileSync('./code.py', req.body.code);
      var output = {stdout: "", stderr: "",timedOut: false, isError: false, killedByContainer: false};
      var options={
        mode: 'json',
        pythonPath: req.body.v3 ? 'python3' : 'python',
        stderrParser: function (stderr) { // with mode=json, without this parser
          // error and stderr cannot be handled! The code will crashes (SyntaxError:
          // Unexpected token F in JSON at position)
          return stderr;
        }
      };
      var pyshell = new PythonShell('./code.py', options);
      // sends a message to the Python script via stdin
      if (req.body.data){
        pyshell.send(req.body.data); // must be json format or have to use json.parse
      }

      // Timeout logic
  		var timeoutCheck = setTimeout(function () {
          console.error("Process timed out. Killing")
          pyshell.terminate('SIGKILL');
      }, req.body.timeoutMs)

      pyshell.on('message', function (message) {
        // should receive only one json response data
        output.stdout = message;

/*      }).on('stderr', function (stderr) {
        output.stderr = stderr;
        // handle stderr line by line
      }).on('error', function (error) {
        // handle error line by line
*/
      }).end(function (err,code,signal) {
        if (err){
          // err handling
          output.stderr = err.stack
        }
        if (pyshell.exitSignal == 'SIGKILL' || signal == 'SIGKILL'){
          var result = _.extend(output, { timedOut: true, isError: true, killedByContainer: true });
          res.end(JSON.stringify(result));
        }
        else{
          var result = _.extend(output, { timedOut: false, isError: code != 0 })
          res.end(JSON.stringify(result));
          clearTimeout(timeoutCheck);
        }
      });
  	}
});

app.listen(port, function () {
	console.log('Container service running on port '+port);
});

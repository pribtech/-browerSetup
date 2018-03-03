# -browerSetup
script to setup htmp



e.g.


var express = require('express')
  , http = require('http')
  , app = express();

require("browserSetup")(app,[{id:'vis',offset:'dist',include:['vis.js','vis.css']}
	,{id:'requirejs'}
	,{id:'font-awesome',base:'font-awesome',include:['css/font-awesome.min.css']}
	,{id:'bootstrap',offset:'dist',include:['js/bootstrap.min.js','css/bootstrap.min.css']}
	])
  
where id is package.json included library
  
  
  In html add
    <script src="initialise"></script>

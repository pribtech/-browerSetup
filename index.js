/**
 * Copyright 2018 Peter Prib

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
"use strict";
const path = require('path')
	,express = require('express');
function browserSetup(app,p) {
	console.log('browserSetup');
	var f,include,type,n
		,s="(function() {console.log('initialise');"
			+"\nfunction Loading (f) {this.callOnLoaded=f;this.count=1"
			+	"\nthis.finished=function () {this.count--\nalert('loading='+this.count);"
						+"\nif(this.count==0 & this.callOnLoaded) {this.callOnLoaded.call;}"
			+	"\n}\n}"
			+"\nvar loading=new Loading();\nhead0=document.getElementsByTagName('head')[0];"
			;
	for(var i in p) {
		n=p[i];
		try{ 
			if(n.file) {
				f=require.resolve(n.file);
			} else {
				f=path.dirname(require.resolve(n.id+path.sep+"README.md"))+(n.offset?path.sep+n.offset:"");
			}
		} catch (e) {
			console.error("browserSetup Cannot provision "+n.id+" reason: "+e);
			continue;
		}
		console.log("use "+n.id +' ==> '+f);
		app.use('/'+n.id, express.static(f));
		if(n.include) {
			for(var j in n.include) {
				include=n.id+'/'+n.include[j];
				if((include.match(/[^\\\/]\.([^.\\\/]+)$/) || [null]).pop()==='js') {
					s+="\nloading.count++;"
						+"\nvar e=document.createElement('script');"
						+"\ne.type='text/javascript';"
						+"\ne.src = '"+include+"';";
						+"\ne.onLoad = loading.finished;"; 
				} else {
					s+="\nloading.count++;"
						+"\nvar e=document.createElement('link');"
						+"\ne.type='text/javascript';"
						+"\ne.rel='stylesheet';"
						+"\ne.href='"+include+"';" 
						+"\ne.onLoad = loading.finished;"; 
				}
				s+="\nhead0.appendChild(e);console.log('initialise include issued for: "+include+"');";
			}
		}
	}
	s+="\nloading.finished();\nconsole.log('initialise end');})()";
	app.get('/initialise',function (req, res, next) {
		res.send(s); 
	});
}

module.exports = browserSetup;
if (typeof define !== 'function') {
    var define = require('amdefine')(browserSetup);
}
define(function(require) {
    //The value returned from the function is
    //used as the module export visible to Node.
    	return browserSetup;
	});

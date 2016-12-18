var cbcParse = require('./cbc-in-js/cbc.js').cbcParse;

var src = 'import a;\nint foo (void) {\n  int a = 1, b = 2, c;\n  c = a + b;\n  return c;\n}';

function init() {
	// make textareas can enter tab
	var textareas = document.getElementsByTagName('textarea');
	var count = textareas.length;
	for(var i=0;i<count;i++){
	    textareas[i].onkeydown = function(e){
	        if(e.keyCode==9 || e.which==9){
	            e.preventDefault();
	            var s = this.selectionStart;
	            this.value = this.value.substring(0,this.selectionStart) + "  " + this.value.substring(this.selectionEnd);
	            this.selectionEnd = s+2; 
	        }
	    }
	}
}

window.onload = function() {
	init();
	document.getElementById("codeInput").value = src;
	// document.getElementById("codeOutput").textContent = src;
	var obj = cbcParse(src);
	// console.log(obj);
	// $("#codeOutput").html('haha<span class="red">ggg</span>ddd')
	$("#codeOutput").html(token2html(obj.tokens));
}

function token2html(tokens) {
	var s = "";
	var lineno = 1, colno = 1;
	console.log(tokens)
	for (var i = 0; i < tokens.length -1 /*-1 for EOF*/; i++) {
		var len =  tokens[i].value.length;
		if (tokens[i].lineno > lineno) {
			s += line(tokens[i].lineno - lineno);
			lineno = tokens[i].lineno;
			colno = 1;
		}
		if (tokens[i].colno > colno) {
			s += space(tokens[i].colno - colno);
			colno = tokens[i].colno;
		}
		s += tokens[i].value;
		colno += len;
	}
	console.log(JSON.stringify(s))
	return s;
}


function repeatString(num, char) {
	return new Array(num + 1).join(char);
}

function line(num) {
	return repeatString(num, '<br/>');
}

function space(num) {
	return repeatString(num, '&nbsp');
}
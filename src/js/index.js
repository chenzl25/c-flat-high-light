var cbcParse = require('./cbc-in-js/cbc.js').cbcParse;


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
	$("#btn").click(highLight);
}

function highLight() {
	var obj = cbcParse($("#codeInput").val());
	if (typeof obj == 'string') {
		errorMsg = obj;
		$('#error').text(errorMsg);
		return;
	} else {
		$("#codeOutput").html(token2html(obj.tokens));
		$('#error').text('');
	}
}

function token2html(tokens) {
	var s = "";
	var lineno = 1, colno = 1;
	// console.log(tokens)
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
		lineno += resolveBlockCommentLine(tokens[i]);
		s += color(tokens[i]);
		colno += len;
	}
	return s;
}

function color(token) {
	type = token.type;
	value = token.value;
	if (type == 'keyWord') {
		if (isRed(value)) {
			return span(value, 'red');
		} else {
			return span(value, 'blue');
		}
	} else if (type == 'number') {
		return span(value, 'purple');
	} else if (type == 'string' || type == 'character') {
		return span(value, 'yellow');
	} else if (token.type == 'lineComment' || token.type == 'blockComment') {
		return span(replaceLine(value.replace(/ /g, '&nbsp')), 'gray');
	} else if (token.color) {
		return span(value, token.color);
	} else {
		return value
	}
}

function resolveBlockCommentLine(token) {
	var n = 0;
	if (token.type == 'blockComment') {
		s = token.value;
		for (var i = 0; i < s.length; i++) {
			if (s[i] == '\n') {
				n++;
			}
		}
	}
	return n;
}

function replaceLine(s) {
	var result = '';
	for (var i = 0; i < s.length; i++) {
		if (s[i] == '\n') {
			result += '<br/>'
		} else {
			result += s[i];
		}
	}
	return result;
}

function isRed(value) {
	switch (value) {
		case 'if':
		case 'while':
		case 'do':
		case 'for':
		case 'else':
		case 'return':
		case 'import':
		case 'const':
		case 'goto':
		case 'break':
		case 'default':
		case 'sizeof':
		case 'extern':
		case 'static':
		case 'continue':
			return true;
		default:
			return false;
	}
}

function span(value, color) {
	return '<span class="' + color + '">' + value + '</span>';
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
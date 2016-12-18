var Compiler = require('./compiler/Compiler').Compiler;
var visitor = require('./visitor/index');
var ASTPrinter = visitor.ASTPrinter;

var astPrinter = new ASTPrinter();

module.exports.cbcParse = cbcParse;

function cbcParse(src) {
  var files = [ { src: src,
      options: 
       { fileName: 'no-fileName',
         dirPath: 'no-dirPath' } } ]

  var compiler = new Compiler();

  var filesResult = compiler.compile(files);

  var result;
  filesResult.forEach(function(obj) {
    // console.log(obj.tokens);
    // astPrinter.print(obj.ast);
    result = obj
  });
  return result;
}


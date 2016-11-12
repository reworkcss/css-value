
var parse = require('..');

var fs = require('fs');
var readdir = fs.readdirSync;
var path = require('path');
var basename = path.basename;

readdir('test/cases')
.filter(function(fn) { return /\.js$/.test(fn); })
.forEach(function(file){
  var mod = require(path.resolve('test/cases/' + file));
  var title = basename(file, '.js');
  it('should support ' + title, function(){
    var ret = parse(mod.string);
    ret.should.eql(mod.object);
  })
});

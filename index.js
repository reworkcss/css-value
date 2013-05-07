
module.exports = parse;

function parse(str) {
  return new Parser(str).parse();
}

function Parser(str) {
  this.str = str;
}

Parser.prototype.skip = function(m){
  this.str = this.str.slice(m[0].length);
};

Parser.prototype.number = function(){
  var m = /^((\d+)(\w+)?) */.exec(this.str);
  if (!m) return;
  this.skip(m);
  var n = ~~m[2];
  var u = m[3];

  return {
    type: 'number',
    string: m[1],
    unit: u || '',
    value: n
  }
};

Parser.prototype.value = function(){
  return this.number();
};

Parser.prototype.parse = function(){
  var vals = [];

  while (this.str.length) {
    vals.push(this.value());
  }

  return vals;
};

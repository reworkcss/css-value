
module.exports = parse;

function parse(str) {
  var cleanStr = str.replace(/^\s+|\s+$/, '');
  return new Parser(cleanStr).parse();
}

function Parser(str) {
  this.str = str;
}

Parser.prototype.skip = function(m){
  this.str = this.str.slice(m.length);
};

Parser.prototype.comma = function(){
  var m = /^, */.exec(this.str);
  if (!m) return;
  this.skip(m[0]);
  return { type: 'comma', string: ',' };
};

Parser.prototype.operator = function(){
  var m = /^\/ */.exec(this.str);
  if (!m) return;
  this.skip(m[0]);
  return { type: 'operator', value: '/' };
};

Parser.prototype.ident = function(){
  var m = /^([\w-]+) */.exec(this.str);
  if (!m) return;
  this.skip(m[0]);
  return {
    type: 'ident',
    string: m[1]
  }
};

Parser.prototype.int = function(){
  var m = /^((-?\d+)([^\s\/]+)?) */.exec(this.str);
  if (!m) return;
  this.skip(m[0]);
  var n = ~~m[2];
  var u = m[3];

  return {
    type: 'number',
    string: m[1],
    unit: u || '',
    value: n
  }
};

Parser.prototype.float = function(){
  var m = /^((-?(?:\d+)?\.\d+)([^\s\/]+)?) */.exec(this.str);
  if (!m) return;
  this.skip(m[0]);
  var n = parseFloat(m[2]);
  var u = m[3];

  return {
    type: 'number',
    string: m[1],
    unit: u || '',
    value: n
  }
};

Parser.prototype.number = function(){
  return this.float() || this.int();
};

Parser.prototype.double = function(){
  var m = /^"([^"]*)" */.exec(this.str);
  if (!m) return m;
  this.skip(m[0]);
  return {
    type: 'string',
    quote: '"',
    string: '"' + m[1] + '"',
    value: m[1]
  }
};

Parser.prototype.single = function(){
  var m = /^'([^']*)' */.exec(this.str);
  if (!m) return m;
  this.skip(m[0]);
  return {
    type: 'string',
    quote: "'",
    string: "'" + m[1] + "'",
    value: m[1]
  }
};

Parser.prototype.string = function(){
  return this.single() || this.double();
};

Parser.prototype.color = function(){
  var m = /^(rgba?\([^)]*\)) */.exec(this.str);
  if (!m) return m;
  this.skip(m[0]);
  return {
    type: 'color',
    value: m[1]
  }
};

Parser.prototype.url = function(){
  var m = /^(url\([^)]*\)) */.exec(this.str);
  if (!m) return m;
  this.skip(m[0]);
  return {
    type: 'url',
    value: m[1]
  }
};

function readToMatchingParen(str) {
  if(str[0] !== '(') {
    throw new Error('expected opening paren');
  }

  var opens = 0;
  for(var i = 0; i < str.length; i++) {
    if(str[i] === '(') {
      opens++;
    }
    else if(str[i] === ')') {
      opens--;
    }

    if(opens === 0) {
      break;
    }
  }

  if(opens !== 0) {
    throw new Error('Failed parsing: No matching paren');
  }

  return str.slice(0, i + 1);
}

Parser.prototype.gradient = function(){
  var m = /^linear-gradient/.exec(this.str);
  if (!m) return m;
  this.skip(m[0]);

  var gradientStr = readToMatchingParen(this.str);
  this.skip(gradientStr);
  return {
    type: 'gradient',
    value: m[0] + gradientStr
  }
};

Parser.prototype.value = function(){
  this.str = this.str.replace(/^\s+/, '');
  return this.operator()
    || this.number()
    || this.color()
    || this.gradient()
    || this.url()
    || this.ident()
    || this.string()
    || this.comma();
};

Parser.prototype.parse = function(){
  var vals = [];

  while (this.str.length) {
    var obj = this.value();
    if (!obj) throw new Error('failed to parse near `' + this.str.slice(0, 10) + '...`');
    vals.push(obj);
  }

  return vals;
};

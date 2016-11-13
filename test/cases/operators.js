exports.string = '50px/50% auto/auto';

exports.object = [
  { type: 'number', string: '50px', unit: 'px', value: 50 },
  { type: 'operator', value: '/' },
  { type: 'number', string: '50%', unit: '%', value: 50 },
  { type: 'ident', string: 'auto' },
  { type: 'operator', value: '/' },
  { type: 'ident', string: 'auto' }
];



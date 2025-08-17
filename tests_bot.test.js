const assert = require('assert');
// Example: Test pairing code generation
const { generatePairCode } = require('../src/bot');
describe('Pairing', () => {
  it('should generate a code starting with JagX and 4 digits', () => {
    const code = generatePairCode('1234567890');
    assert(/^JagX\d{4}$/.test(code));
  });
});
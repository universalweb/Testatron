const lucy = require('Lucy');
const testatron = async ({
  filePath,
  destination,
  prefix
}) => {
  console.log('PARSING DOCS');
  const results = await testatron.build.json({
    filePath,
    prefix,
  });
  console.log('COMPILING TEST CASES');
  const testCases = await testatron.compile.cases({
    destination,
    results,
  });
  console.log('RUNNING TEST CASES');
  return testatron.run(testCases);
};
const {
  assignDeep,
} = lucy;
assignDeep(testatron, require(`./json.js`));
assignDeep(testatron, require(`./assert.js`));
assignDeep(testatron, require(`./compile.js`));
assignDeep(testatron, require(`./run.js`));
module.exports = testatron;

(async () => {
  const testatron = require('testatron');
  const {
    keys
  } = require('Lucy');
  console.log('Building Test Cases');
  await testatron({
    destination: `${__dirname}/tests`,
    filePath: './unitTest.js'
  });
  console.log('END');
})();

const lucy = require(`Lucy`);
const fs = require('fs');
const {
  eachArray,
  eachObject,
} = lucy;
const esformatter = require('esformatter');
const writeFile = (fileLocation, fileData) => {
  try {
    const formattedCode = esformatter.format(fileData, {
      indent: {
        value: '  '
      }
    });
    return fs.writeFileSync(`${fileLocation}`, formattedCode, 'utf8');
  } catch (error) {
    console.log(fileLocation, 'Formatting Error - Wrote raw code into file.', error);
    fs.writeFileSync(`${fileLocation}`, fileData, 'utf8');
  }
};
const cases = async ({
  destination,
  results,
}) => {
  const testLocations = [];
  eachObject(results, (item, key) => {
    const fileLocation = `${destination}/${key}/`;
    if (!item.code.length) {
      return console.log(`No code for ${key}`);
    }
    if (!fs.existsSync(fileLocation)) {
      fs.mkdirSync(fileLocation);
    }
    eachArray(item.code, (code, index) => {
      testLocations.push(`${fileLocation}${index}.js`);
      writeFile(`${fileLocation}${index}.js`, code);
    });
  });
  return testLocations;
};
exports.compile = {
  cases,
};

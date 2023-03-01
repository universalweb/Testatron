import {
	eachAsyncArray,
	eachObject,
} from 'Acid';
import fs from 'fs';
import format from 'prettier-eslint';
async function writeFile(fileLocation, fileData) {
	try {
		const eslintConfig = JSON.parse(fs.readFileSync('./.eslintrc').toString());
		const formattedCode = await format({
			eslintConfig,
			text: fileData,
		});
		return fs.writeFileSync(`${fileLocation}`, formattedCode, 'utf8');
	} catch (error) {
		console.log(fileLocation, 'Formatting Error - Wrote raw code into file.', error);
		fs.writeFileSync(`${fileLocation}`, fileData, 'utf8');
	}
}
async function cases({
	destination,
	results,
}) {
	const testLocations = [];
	eachObject(results, (item, key) => {
		const fileLocation = `${destination}/${key}/`;
		if (!item.code.length) {
			return console.log(`No code for ${key}`);
		}
		if (!fs.existsSync(fileLocation)) {
			fs.mkdirSync(fileLocation);
		}
		eachAsyncArray(item.code, async (code, index) => {
			testLocations.push(`${fileLocation}${index}.js`);
			await writeFile(`${fileLocation}${index}.js`, code);
		});
	});
	return testLocations;
}
export { cases };

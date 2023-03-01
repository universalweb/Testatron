import { buildJson } from './json.js';
import { assert } from './assert.js';
import { cases } from './compile.js';
import { run } from './run.js';
async function testatron({
	filePath,
	destination,
	prefix
}) {
	console.log('PARSING DOCS');
	const results = await buildJson({
		filePath,
		prefix,
	});
	console.log('COMPILING TEST CASES');
	const testCases = await cases({
		destination,
		results,
	});
	console.log('RUNNING TEST CASES');
	return run(testCases);
}
export { buildJson, cases, run };
export default testatron;

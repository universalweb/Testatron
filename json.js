import {
	compactMapArray,
	findItem,
} from 'Acid';
import fs from 'fs';
import extractComments from 'comment-parser';
const regexComments = /(\/\*([\s\S]*?)\*\/)/gm;
const readFile = (filePath) => {
	return fs.readFileSync(filePath).toString();
};
const buildJson = async ({
	filePath,
	prefix
}) => {
	const fileData = readFile(filePath);
	const matches = fileData.match(regexComments);
	const examples = {};
	matches.forEach((item) => {
		if (item.includes('@ignore') || item.includes('@ignoreTest')) {
			return;
		}
		const comment = extractComments(item)[0].tags;
		if (!comment) {
			return;
		}
		const functionTag = findItem(comment, 'function', 'tag');
		if (!functionTag) {
			return;
		}
		const commentName = functionTag.name;
		examples[commentName] = {
			code: [],
			examples: [],
			name: commentName,
		};
		compactMapArray(comment, (tag) => {
			if (tag.tag === 'example') {
				examples[commentName].examples.push(tag.source);
				const sourceExample = tag.source.replace('@example', '');
				const code = `${prefix}
					try {
						${sourceExample}
					} catch(err) {
						console.error(${commentName}, err);
					}
				`;
				examples[commentName].code.push(code);
			}
		});
	});
	return examples;
};
export { buildJson };


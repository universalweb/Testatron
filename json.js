const lucy = require(`Lucy`);
const {
  compactMapArray,
  findItem,
} = lucy;
const fs = require(`fs`);
const extractComments = require('comment-parser');
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
    const isAsync = item.includes('@async');
    const shouldAwait = (isAsync) ? 'await' : '';
    examples[commentName] = {
      async: isAsync,
      code: [],
      examples: [],
      name: commentName,
    };
    const testCase = findItem(comment, 'test', 'tag');
    if (testCase) {
      const code = `module.exports = async () => {
        const _commentName = '${commentName}';
        ${prefix}
        const assert = require('testatron').assert(_commentName);
        const func = ${testCase.source.replace('@test', '')}
        return await func();
      };`;
      return examples[commentName].code.push(code);
    }
    compactMapArray(comment, (tag) => {
      if (tag.tag === 'example') {
        examples[commentName].examples.push(tag.source);
        const groups = tag.source.split('// =>');
        const evaluation = groups[0].replace('@example', '');
        const solution = groups[1];
        const code = `module.exports = async () => {
          ${prefix}
          const _commentName = '${commentName}';
          const assert = require('testatron').assert(_commentName);
          const result = ${shouldAwait} ${evaluation}
          const testResult = await assert(result, ${solution});
          return testResult;
        };`;
        examples[commentName].code.push(code);
      }
    });
  });
  return examples;
};
exports.build = {
  json: buildJson
};

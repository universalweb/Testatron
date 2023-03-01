async function run(fileLocations) {
	let results = true;
	let index = 0;
	const fileLocationsLength = fileLocations.length;
	while (results && index <= fileLocationsLength) {
		const item = fileLocations[index];
		if (!item) {
			break;
		}
		try {
			results = await import(item)();
			if (!results) {
				console.log(`${item} Failed`);
			}
		} catch (error) {
			console.log(item, error, 'Code Error - Check test code');
		}
		index++;
	}
	console.log(`${index} out of ${fileLocationsLength} tests`);
}
export { run };

import { isEqual } from 'Lucy';
function assert(functionName) {
	return async (evaluate, solution) => {
		try {
			const asserted = isEqual(evaluate, solution);
			if (asserted) {
				console.log(functionName, asserted);
				return asserted;
			} else {
				console.log(`${functionName} - Test Failed - Result: ${evaluate} - Expected: ${solution}`);
			}
		} catch (error) {
			console.log(functionName, error);
		}
		return false;
	};
}
export { assert };

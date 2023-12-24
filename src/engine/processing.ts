type TTraverseObject = {
	path: string
	obj: unknown
	processingFn: (value: any, path: string) => void
	skippingFn: (path: string, invalidChunk: string) => void
}

export function traverseObject({path, obj, processingFn, skippingFn}: TTraverseObject): void {
	if (!path || !obj) {
		return;
	}

	const pathArray = (path || '').split('.');

	recursiveProcess({pathArray, targetPath: path, obj, processingFn, skippingFn});
}

type TRecursiveProcess = {
	pathArray: Array<string>
	targetPath: string
	currentIndex?: number
	obj: unknown
	processingFn: (value: any, path: string) => void
	skippingFn: (path: string, invalidChunk: string) => void
}

function recursiveProcess({pathArray, targetPath, obj, processingFn, skippingFn, currentIndex = 0}: TRecursiveProcess) {
	let currentPath = pathArray[currentIndex];
	currentIndex++;

	let iteratorIndex = -1;
	let isArray = false;

	if (currentPath.endsWith('[]')) {
		currentPath = currentPath.substring(0, currentPath.length - 2);
		isArray = true;
	}

	if (currentPath.endsWith(']')) {
		const parts = /(\w+)\[([^}]+)]/g.exec(currentPath); // ['addresses[0]', 'adresses', '0'...]

		if (parts && parts.length > 1) {
			currentPath = parts[1];
			iteratorIndex = Number(parts[2]);

			if (isNaN(iteratorIndex)) {
				iteratorIndex = -1;
			}
		}

		isArray = true;
	}

	if (!currentPath
		|| !obj.hasOwnProperty(currentPath)
		|| (isArray && !Array.isArray(obj[currentPath]))
		|| (isArray && iteratorIndex !== -1 && iteratorIndex >= obj[currentPath].length)
	) {
		skippingFn(targetPath, currentPath);
		return;
	}

	let current = obj[currentPath];

	if (isArray && iteratorIndex === -1) {
		// full iteration, 'addresses[]'
		current.forEach((element: any, iteratorIdx: number) => {
			const iterationArray = pathArray.map((path, idx) => {
				return idx === currentIndex - 1 ? `${currentPath}[${iteratorIdx}]` : path;
			});

			const iterationPath = iterationArray.join('.');

			recursiveProcess({
				pathArray: iterationArray,
				targetPath: iterationPath,
				obj: element,
				processingFn,
				skippingFn,
				currentIndex
			});
		});

		return;
	}

	if (isArray && iteratorIndex !== -1) {
		// pre-set index, 'addresses[1]'
		current = current[iteratorIndex];
	}

	if (currentIndex < pathArray.length) {
		recursiveProcess({pathArray, targetPath, obj: current, processingFn, skippingFn, currentIndex});
	} else {
		processingFn(current, targetPath);
	}
}

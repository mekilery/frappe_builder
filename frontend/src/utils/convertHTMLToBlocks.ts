function convertHTMLToBlocks(html: string) {
	const start = html.indexOf("```");
	let htmlStripped;
	if (start === -1) {
		htmlStripped = html;
	} else {
		const end = html.lastIndexOf("```");
		htmlStripped = html.substring(start + 3, end);
	}


	const doc = new DOMParser().parseFromString(htmlStripped, "text/html");
	const { body } = doc;
	return parseElement(body);
}

function parseElement(element: HTMLElement): BlockOptions {
	const obj: BlockOptions = {
		element: element.tagName.toLowerCase(),
	};

	if (element.style.length) {
		obj.styles = {};
		for (let i = 0; i < element.style.length; i++) {
			const prop = element.style[i];
			obj.styles[prop] = element.style.getPropertyValue(prop);
		}
	}

	if (element.attributes.length) {
		obj.attributes = {};
		for (let i = 0; i < element.attributes.length; i++) {
			const attr = element.attributes[i];
			if (attr.name !== 'style') {
				obj.attributes[attr.name] = attr.value;
			};
		}
	}

	// classes
	if (element.classList.length) {
		obj.classes = [];
		for (let i = 0; i < element.classList.length; i++) {
			obj.classes.push(element.classList[i]);
		}
	}

	if (element.hasChildNodes()) {
		obj.children = [];
		const { childNodes } = element;
		for (let i = 0; i < childNodes.length; i++) {
			const child = childNodes[i] as HTMLElement;
			if (child.nodeType === Node.ELEMENT_NODE) {
				obj.children.push(parseElement(child));
			} else if (child.nodeType === Node.TEXT_NODE) {
				obj.innerText = (child.textContent || '').trim();
			}
		}
	}

	return obj;
}

window.convertHTMLToBlocks = convertHTMLToBlocks;

declare global {
	interface Window {
		convertHTMLToBlocks: any;
	}
}


export default convertHTMLToBlocks;
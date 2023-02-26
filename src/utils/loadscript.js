export function loadScript (url) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')

		script.onload = () => resolve(`url loaded: ${ url }`)

		script.onerror = () => reject(new Error(`Load script from ${url} failed`))

		script.src = url
		const head = document.head || document.getElementsByTagName('head')[0]
		;(document.body || head).appendChild(script)
	})
}

export function removeScript(src) {
	let scripts = document.getElementsByTagName("script");
	for (let i = 0; i < scripts.length; i++) {
		if (scripts[i] && scripts[i].src && scripts[i].src.indexOf(src) != -1) {
			scripts[i].parentNode.removeChild(scripts[i]);
		}
	}
}
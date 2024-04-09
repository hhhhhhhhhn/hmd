import {replaceAsync} from "./math"

let render: Function|null = null
async function renderSvgBob(input: string): Promise<string> {
	if (!render) {
		let svgbob = await import("bob-wasm")
		await svgbob.default.loadWASM()
		render = svgbob.default.render
	}
	let rendered: string = render(input)
	let base64 = Buffer.from(rendered).toString("base64")
	return `<img src="data:image/svg+xml;base64,${base64}">`
}

export async function svgBobPreprocess(input: string): Promise<string> {
	let output = await replaceAsync(input, /\n```bob\n([\S\s]*?)```/g,
		async (_: any, image: string) =>
			`\n\n<div class="svgbob">
				${await renderSvgBob(image)}
			</div>\n\n`
		)
	return output
}

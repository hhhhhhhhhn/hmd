import katex from "katex"

let asciimath: any = null;
async function am() {
	if (!asciimath) {
		let {AsciiMath} = await import("asciimath-parser")
		asciimath = new AsciiMath()
	}
	return asciimath
}

// function escapeHTML(str: string) {
// 	return str.replace(/&/g, "&amp;")
// 		.replace(/</g, "&lt;")
// 		.replace(/>/g, "&gt;")
// 		.replace(/\//g, "&#47;")
// 		.replace(/"/g, "&quot;")
// 		.replace(/'/g, "&#39;")
// 		.replace(/[*]/g, "&#42;")
// 		.replace(/\n/g, " ")
// }

export async function renderAsciimath(input: string) {
	let tex = (await am()).toTex(input)
	let html = katex.renderToString(tex, {trust: true, strict: false})
	return html
}

export async function mathPreprocess(input: string): Promise<string> {
	let output = await replaceAsync(input, /\n```math\n([\S\s]*?)```/g,
		async (_: any, math: string) =>
			`<div class="math-block">
				${await renderAsciimath(math)}
			</div>`
		)
	output = await replaceAsync(output, /`math ([\S\s]*?)`/g,
			async (_: any, math: string) => `<span class="math-inline"> ${await renderAsciimath(math)} </span>`
		)
	output = await replaceAsync(output, /([^`])``([^\n]*?)``([^`])/g,
			async (_: any, before: string, math: string, after: string) => `${before} <span class="math-inline"> ${await renderAsciimath(math)} </span> ${after}`
		)
	return output
}

export async function replaceAsync(string: string, regexp: RegExp, replacerFunction: Function) {
    const replacements = await Promise.all(
        Array.from(string.matchAll(regexp),
            match => replacerFunction(...match)));
    let i = 0;
    return string.replace(regexp, () => replacements[i++]);
}

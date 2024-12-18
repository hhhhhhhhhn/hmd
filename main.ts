import {md} from "./md"
import path from "path"
import util from "util"
// @ts-ignore
import template from "./assets/template.html"
// @ts-ignore
import slide from "./assets/slide.html"
import {file} from "bun"

let cache: Map<string, [number|bigint, string]> = new Map()
async function renderCached(filename: string, options: any): Promise<string | null> {
	let markdown
	try {
		markdown = await Bun.file(filename).text()
	} catch {
		return null
	}
	let hash = Bun.hash(markdown + JSON.stringify(options))

	let cached = cache.get(filename)
	if (cached && cached[0] == hash) {
		return cached[1]
	}
	let html = await md.render(markdown, options)
	cache.set(filename, [hash, html])
	return html
}

let templates: Record<string, [string, string]> = {}
async function loadTemplate(name: string, value: any) {
	const templateString = await file(value).text()
	templates[name] = templateString.split("INSERTHERE") as [string, string]
}

function renderInTemplate(template: string, html: string): string {
	if (!(template in templates)) throw new Error("Template " + template + " not found")
	return templates[template][0] + html + templates[template][1]
}

async function main() {
	const {values, positionals} = util.parseArgs({allowPositionals: true})
	let folder = positionals.at(0)
	if (!folder) {
		console.error("No folder specified")
		process.exit(1)
	}

	loadTemplate("base", template)
	loadTemplate("slide", slide)

	Bun.serve({
		port: 8888,
		async fetch(request: Request): Promise<Response> {
			let parsedUrl = new URL(decodeURI(request.url))
			if (!parsedUrl.pathname.includes(".")) {
				let mdPath = parsedUrl.pathname + ".md"
				let isSlide = parsedUrl.searchParams.get("slide") != undefined

				let mdHtml
				try {
					mdHtml = await renderCached(path.join(folder, mdPath), {slide: isSlide})
				} catch (error) {
					return new Response(String(error), {status: 500})
				}

				let temp = isSlide ? "slide" : "base"

				let fullHtml = renderInTemplate(temp, mdHtml as string)

				let response = new Response(fullHtml)
				response.headers.set("Content-Type", "text/html")
				return response
			}
			return new Response("TODO")
		},
	})
}

main()

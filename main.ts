import {md} from "./md"
import path from "path"
import util from "util"
// @ts-ignore
import template from "./assets/template.html"
import {file} from "bun"

let cache: Map<string, [number|bigint, string]> = new Map()
async function renderCached(filename: string): Promise<string | null> {
	let markdown
	try {
		markdown = await Bun.file(filename).text()
	} catch {
		return null
	}
	let hash = Bun.hash(markdown)

	let cached = cache.get(filename)
	if (cached && cached[0] == hash) {
		return cached[1]
	}
	let html = await md.render(markdown)
	cache.set(filename, [hash, html])
	return html
}

async function main() {
	const {values, positionals} = util.parseArgs({allowPositionals: true})
	let folder = positionals.at(0)
	if (!folder) {
		console.error("No folder specified")
		process.exit(1)
	}
	const templateString = await file(template).text()
	const [templateStart, templateEnd] = templateString.split("INSERTHERE")

	Bun.serve({
		port: 8888,
		async fetch(request: Request): Promise<Response> {
			let url = decodeURI(request.url)
			if (!url.includes(".")) {
				let mdPath = url.split("/").slice(3).join("/") + ".md"
				let mdHtml
				try {
					mdHtml = await renderCached(path.join(folder, mdPath))
				} catch {
					return new Response("Not found", {status: 404})
				}

				let html = templateStart + mdHtml + templateEnd

				let response = new Response(html)
				response.headers.set("Content-Type", "text/html")
				return response
			}
			return new Response("TODO")
		},
	})
}

main()

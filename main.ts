import {md} from "./md"
import path from "path"
import util from "util"
import template from "./assets/template.html"
import {file} from "bun"

async function main() {
	const {_,positionals} = util.parseArgs({allowPositionals: true})
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
				let content
				try {
					content = await Bun.file(path.join(folder, mdPath)).text()
				} catch {
					return new Response("Not found", {status: 404})
				}
				let mdHtml = await md.render(content)

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

import { mathPreprocess } from "./math"
import { shellPreprocess } from "./shell"
import { linksPreprocess } from "./links"

const mdIt = require("markdown-it")({
    html: true,
  })
	.use(require("markdown-it-highlightjs"))
	.use(require("markdown-it-attrs"))
	.use(require("markdown-it-block-image"))
	.use(require("markdown-it-multimd-table"))

export const md = {
	render: async function(input: string): Promise<string> {
		let links = linksPreprocess(input)
		let math = await mathPreprocess(links)
		let shell = await shellPreprocess(math)
		return mdIt.render(shell)
	}
}

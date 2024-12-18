import { mathPreprocess } from "./math"
import { shellPreprocess } from "./shell"
import { linksPreprocess } from "./links"
import { svgBobPreprocess } from "./svgbob"
import { presentationPostprocess } from "./presentation"

const mdIt = require("markdown-it")({
    html: true,
  })
	.use(require("markdown-it-highlightjs"))
	.use(require("markdown-it-attrs"))
	.use(require("markdown-it-block-image"))
	.use(require("markdown-it-multimd-table"))

export const md = {
	render: async function(input: string, options?: any): Promise<string> {
		let output = input
		output = linksPreprocess(output)
		output = await mathPreprocess(output)
		output = await shellPreprocess(output)
		output = await svgBobPreprocess(output)
		output = mdIt.render(output)
		if (options && options["slide"]) {
			output = await presentationPostprocess(output)
		}
		return output
	}
}

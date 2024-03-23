export function linksPreprocess(input: string): string {
	return input.replaceAll(
		/\[\[(.*?)\]\]/g,
		(_, text) => {
			return `<a href="./${text}">[${text}]</a>`
		})
}

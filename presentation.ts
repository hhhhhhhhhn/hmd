export async function presentationPostprocess(input: string) {
	let out = "<div class=\"slide\" id=\"slide0\">"
	let slides = input.split("<hr>")
	for (let i = 0; i < slides.length; i++) {
		out += slides[i]
		if (i < slides.length - 1) out += `</div><div class="slide" id="slide${i+1}">`
	}
	return out + "</div>"
}

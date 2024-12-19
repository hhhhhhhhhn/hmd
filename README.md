# hmd
My personal markdown server, based on [Bun](https://bun.sh/) and [markdown-it](https://github.com/markdown-it/markdown-it),
with support for some extra features including:
- Live reload
- Presentations
- LaTeX and asciimath via [widcardw's asciimath parser](https://github.com/widcardw/asciimath-parser)
  and [KaTeX](https://katex.org/)
- Simplified `[[link]]` syntax
- [svgbob](https://github.com/ivanceras/svgbob) support
- Shell command output (useful for generating plots, e.g. using gnuplot, or running code)

## Usage
```bash
mkdir FOLDER
echo "# Test" > FOLDER/FILE.md

bun run main.ts FOLDER
$BROWSER "http://localhost:8888/FILE"
$BROWSER "http://localhost:8888/FILE?slide" # For presentations
```

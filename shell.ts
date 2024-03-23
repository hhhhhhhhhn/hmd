import { spawn } from "child_process"
import { replaceAsync } from "./math"

async function execAsync(command: string, stdin: string): Promise<string> {
	let process = spawn(command, {shell: true})
	process.stdin.setDefaultEncoding("utf8")
	process.stdin.write(stdin)
	process.stdin.end()
	let output = ""
	process.stdout.on("data", (data) => {
		output += data.toString()
	})
	let error = ""
	return new Promise((resolve, reject) => {
		process.on("close", (code) => {
			if (code == 0) {
				resolve(output)
			}
			else {
				reject(error)
			}
		})
		process.stderr.on("data", (data) => {
			console.error(data.toString())
			reject(`'${command}' failed with error: '${data.toString()}'`)
		})
	})
}

export async function shellPreprocess(input: string): Promise<string> {
	let output = await replaceAsync(
		input,
		/\n```!(.*?)\n([\s\S]*?)\n!(.*)\n```/g, // TODO: Replace with .*?
		async (_: any, command: string, stdin: string, format: string) => {
			let output = await execAsync(command, stdin)
			return "\n" + format.replace("{}", output) + "\n"
		})
	return output
}

//let test = `# This is a test
//
//!!!tr '"' "'" | cat
//These are some "quotes"
//!!!<p>{}</p>
//`
//
//async function main() {
//	console.log(await preprocessShell(test))
//}


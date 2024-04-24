import {Args, Command, Flags} from '@oclif/core'
import fs from 'fs'
import path from 'path'
import sortKeys from 'sort-keys'
import chalk from 'chalk'

export default class JsonSort extends Command {
  static args = {
    files_or_folder: Args.string({
      name: 'files_or_folder',
      description: 'Files or folder',
      required: true,
    }),
  }
  static static = false
  static description = 'Sort the contents of .json files'

  static examples = [
    `Single file use
$ do json sort file.json

Single file use with selected output name
$ do json sort file.json --output sorted.json

Single file use with prepend
$ do json sort file.json --output sorted.json --prepend "sorted-"

Multifile files use
$ do json sort *.json
$ do json sort *.json --output ./sorted
$ do json sort ./ --output ./sorted
$ do json sort ./ --output ./sorted --prepend "sorted-"
`,
  ]

  static flags = {
    verbose: Flags.boolean({char: 'v', description: 'Verbose output', required: false, default: false}),
    output: Flags.string({
      char: 'o',
      description: 'Output to file',
      required: false,
      default: '',
      parse: async (input: string) => input.trim(),
    }),
    prepend: Flags.string({
      char: 'p',
      description: 'Prepend to generated filenames',
      required: false,
      default: '',
      parse: async (input: string) => input.trim(),
    }),
    deep: Flags.boolean({char: 'd', description: 'Deep sort', required: false, default: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(JsonSort)
    if (flags.verbose) {
      console.log({args, flags})
    }
    let files = args.files_or_folder.includes('') ? args.files_or_folder.split(' ') : [args.files_or_folder]

    let existing_file_paths: string[] = []

    if (files.length == 1 && fs.lstatSync(files[0]).isDirectory()) {
      const found_file_paths = await this.listFolderFiles(files[0])
      existing_file_paths = found_file_paths.filter((path) => path.includes('.json'))
    } else {
      files.every((file) => this.fileExists(file))
      existing_file_paths = files
    }
    for (const file_path of existing_file_paths) {
      try {
        const file_contents = fs.readFileSync(file_path, 'utf8')
        const json_contents = JSON.parse(file_contents)
        const soreted_contents = sortKeys(json_contents, {deep: flags.deep})
        const output = flags.output.startsWith('./') ? flags.output.substring(2) : flags.output
        if (existing_file_paths.length > 1) {
          try {
            fs.mkdirSync(output, {recursive: true})
          } catch (err) {
            console.log(err)
          }
        }
        this.saveFile(file_path, soreted_contents, output, flags.prepend || '')
        this.log(chalk.green('[Success]'), file_path)
      } catch (err: any) {
        this.log(chalk.red('[Error]'), `${err.message}`)
      }
    }
  }

  saveFile(file_path: string, contents: object, output: string = file_path, prepend: string | '') {
    let filename = ''
    if (output.endsWith('.json')) {
      filename = output
    } else {
      filename = path.join(
        output || path.dirname(file_path),
        `${prepend ? prepend + '-' : ''}${path.basename(file_path)}`,
      )
    }

    fs.writeFileSync(filename, JSON.stringify(contents, null, 2), {encoding: 'utf8'})
  }

  fileExists(filePath: string): boolean {
    try {
      return fs.statSync(filePath).isFile()
    } catch (err) {
      throw this.error(`File ${filePath} does not exist`)
    }
  }

  async listFolderFiles(folderPath: string): Promise<string[]> {
    const files = await fs.promises.readdir(folderPath)
    const filesAndFolders = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(folderPath, file)
        const stats = await fs.promises.stat(filePath)
        return stats.isDirectory() ? this.listFolderFiles(filePath) : filePath
      }),
    )
    return filesAndFolders.flat()
  }
}

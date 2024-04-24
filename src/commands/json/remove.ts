import {Args, Command, Flags} from '@oclif/core'
import fs from 'fs'
import utilities from '../../utilities/filesystem.js'
import chalk from 'chalk'

export default class JsonRemove extends Command {
  static args = {
    files_or_folder: Args.string({
      name: 'files_or_folder',
      description: 'Files or folder',
      required: true,
    }),
  }
  static static = false
  static description = 'Remove keys from the the contents of .json files'

  static examples = [
    `Update the the input file
$ do json remove file.json --keys key_1,key_2.key3

Output to a new file
$ do json remove file.json --keys key_1,key_2.key3 --output ./extracted.json

Output to a new file and prepend
$ do json remove file.json --keys key_1,key_2.key3 --output ./extracted.json --prepend "extracted-"

Multiple input files
$ do json remove ./files --keys key_1,key_2.key3 --output ./extracted.json

Output to a new files
$ do json remove ./* --keys key_1,key_2.key3 --output ./extracted

Output to a new files and prepend
$ do json remove ./* --keys key_1,key_2.key3 --output ./extracted --prepend "extracted-"
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
    keys: Flags.string({
      char: 'k',
      description: 'Prepend to generated filenames',
      required: false,
      default: '',
      parse: async (input: string) => input.trim(),
      delimiter: ',',
    }),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(JsonRemove)
    if (flags.verbose) {
      console.log({args, flags})
    }
    let files = args.files_or_folder.includes('') ? args.files_or_folder.split(' ') : [args.files_or_folder]

    let existing_file_paths: string[] = []

    if (files.length == 1 && fs.lstatSync(files[0]).isDirectory()) {
      const found_file_paths = await utilities.listFolderFiles(files[0])
      existing_file_paths = found_file_paths.filter((path: string) => path.includes('.json'))
    } else {
      files.every((file) => utilities.fileExists(file))
      existing_file_paths = files
    }
    for (const file_path of existing_file_paths) {
      try {
        const file_contents = fs.readFileSync(file_path, 'utf8')
        const json_contents = JSON.parse(file_contents)
        // changes go here
        for (const key of flags.keys) {
          delete json_contents[key]
        }
        // to here
        const output = flags.output.startsWith('./') ? flags.output.substring(2) : flags.output
        if (existing_file_paths.length > 1) {
          try {
            fs.mkdirSync(output, {recursive: true})
          } catch (err) {
            console.log(err)
          }
        }
        utilities.saveFile(file_path, json_contents, output, flags.prepend || '')
        this.log(chalk.green('[Success]'), file_path)
      } catch (err: any) {
        this.log(chalk.red('[Error]'), `${err.message}`)
      }
    }
  }
}

function delete_key(json: object, path: Array<string | number>) {
  if (path.length === 0) return
  const path_arr = path
  const selected_key = path_arr.shift()

  for (const key of Object.keys(json)) {
    if (key === selected_key) {
      if (path.length !== 0) {
        delete_key(json[key], path_arr)
        return
      }
      delete json[selected_key]
      return
    }
  }
}

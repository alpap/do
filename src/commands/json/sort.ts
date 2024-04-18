import {Args, Command, Flags} from '@oclif/core'
import fs from 'fs'
import path from 'path'

export default class Json extends Command {
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
    output: Flags.string({char: 'o', description: 'Output to file', required: false}),
    prepend: Flags.string({char: 'p', description: 'Prepend to generated filenames', required: false}),
    verbose: Flags.string({char: 'v', description: 'Verbose mode', required: false}),
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Json)
    let files = args.files_or_folder.includes('') ? args.files_or_folder.split(' ') : [args.files_or_folder]

    let existing_file_paths: string[] = []

    if (files.length > 1) {
      files.every((file) => this.fileExists(file))
      existing_file_paths = files
    } else if (fs.lstatSync(files[0]).isDirectory()) {
      const found_file_paths = await this.listFolderFiles(files[0])
      existing_file_paths = found_file_paths.filter((path) => path.includes('.json'))
    }

    for (const file_path of existing_file_paths) {
      this.log(`Sorting ${file_path}`)
      this.fileExists(file_path)
      const file_contents = fs.readFileSync(file_path, 'utf8')
      const json_contents = JSON.parse(file_contents)
      const object_depth = this.getObjectDepth(json_contents)
      const soreted_contents = this.sortObjectKeys(json_contents, object_depth)
      this.saveFile(file_path, soreted_contents, flags.output, flags.prepend || '', existing_file_paths.length > 1)
    }
  }

  saveFile(file_path: string, contents: object, output: string = file_path, prepend: string | '', is_arr = false) {
    if (is_arr && !fs.existsSync(output)) {
      fs.mkdirSync(output, {recursive: true})
    }
    const filename = `${path.dirname(file_path)}/${prepend ? prepend + '-' : ''}${path.basename(file_path)}`
    fs.writeFileSync(JSON.stringify(contents, null, 2), filename, {encoding: 'utf8'})
  }

  fileExists(filePath: string): boolean {
    try {
      return fs.statSync(filePath).isFile()
    } catch (err) {
      throw this.error(`File ${filePath} does not exist`)
    }
  }

  getObjectDepth(obj: object): any {
    //@ts-ignore
    return Object(obj) === obj ? 1 + Math.max(-1, ...Object.values(obj).map(this.getObjectDepth)) : 0
  }

  sortObjectKeys(obj: any, level = 10): any {
    if (typeof obj !== 'object' || obj === null) return obj
    if (level == 0) return obj // avoid infinite loop
    const sortedObj: any = Array.isArray(obj) ? [] : {}
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sortedObj[key] = this.sortObjectKeys(obj[key], level - 1)
      })
    return sortedObj
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

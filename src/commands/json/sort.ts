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
  }

  async run(): Promise<void> {
    const {args, flags} = await this.parse(Json)
    let files = args.files_or_folder.includes('') ? args.files_or_folder.split(' ') : args.files_or_folder

    if (files.length > 1) {
    }

    this.log(`hello ${args.files_or_folder} from ${flags.from}! (./src/commands/hello/index.ts)`)
  }

  private fileExists(filePath: string): boolean {
    try {
      return fs.statSync(filePath).isFile()
    } catch (err) {
      return false
    }
  }

  private getObjectDepth(obj: object): any {
    //@ts-ignore
    return Object(obj) === obj ? 1 + Math.max(-1, ...Object.values(obj).map(this.getObjectDepth)) : 0
  }

  private sortObjectKeys(obj: any, level = 10): any {
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

  private async readJsonFile(filePath: string): Promise<object> {
    if (!this.fileExists(filePath)) {
      throw new Error(`File ${filePath} does not exist`)
    }
    const content = await fs.promises.readFile(filePath, 'utf8')
    return JSON.parse(content)
  }

  private async listFolderFiles(folderPath: string): Promise<string[]> {
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

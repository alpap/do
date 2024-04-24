import fs from 'fs'
import path from 'path'

function saveFile(file_path: string, contents: object, output: string = file_path, prepend: string | '') {
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

function fileExists(filePath: string): boolean {
  try {
    return fs.statSync(filePath).isFile()
  } catch (err) {
    throw Error(`File ${filePath} does not exist`)
  }
}

async function listFolderFiles(folderPath: string): Promise<string[]> {
  const files = await fs.promises.readdir(folderPath)
  const filesAndFolders = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(folderPath, file)
      const stats = await fs.promises.stat(filePath)
      return stats.isDirectory() ? listFolderFiles(filePath) : filePath
    }),
  )
  return filesAndFolders.flat()
}

export default {
  listFolderFiles,
  fileExists,
  saveFile,
}

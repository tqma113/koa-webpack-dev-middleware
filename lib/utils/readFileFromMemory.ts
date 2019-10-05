import path from 'path'
import MemoryFS from 'memory-fs'

const readFileFromMemory = (mfs: MemoryFS, filename: string, index: string = 'index.html') => {
  try {
    let stat = mfs.statSync(filename);

    if (!stat.isFile()) {
      if (stat.isDirectory()) {

        filename = path.posix.join(filename, index);
        stat = mfs.statSync(filename);

        if (!stat.isFile()) {
          throw new Error('next')
        }
      } else {
        throw new Error('next')
      }
    }

    let content = mfs.readFileSync(filename)

    return {
      content,
      filename
    }

  } catch (e) {
    return false
  }
}

export default readFileFromMemory
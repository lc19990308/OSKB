import { noop } from '@/utils'
import FileChunkMd5 from 'worker-loader!./worker/fileChunkMd5.js'
import FileMd5 from 'worker-loader!./worker/fileMd5.js'


export async function foundFileMd5(fileItem) {

  return new Promise((resolve, reject) => {

    fileItem.worker.file.worker = new FileMd5()

    fileItem.worker.file.stop = () => {
      fileItem.worker.file.worker.terminate()
      fileItem.worker.file.worker = null
      fileItem.worker.file.stop = noop
    }

    fileItem.worker.file.worker.onerror = (error) => {
      fileItem.worker.file.stop()
      reject(error)
    }

    fileItem.worker.file.worker.onmessage = (event) => {
      fileItem.worker.file.stop()
      fileItem.md5 = event.data
      resolve(event.data)
    }


    fileItem.worker.file.worker.postMessage([fileItem.file, fileItem.chunkSize])
  })
}

export async function foundFileChunkMd5(fileItem, blob) {
  return new Promise((resolve, reject) => {

    fileItem.worker.chunk.worker = new FileChunkMd5()

    fileItem.worker.chunk.stop = () => {
      fileItem.worker.chunk.worker.terminate()
      fileItem.worker.chunk.worker = null
      fileItem.worker.chunk.stop = noop
    }


    fileItem.worker.chunk.worker.onerror = (error) => {
      fileItem.worker.chunk.stop()
      reject(error)
    }

    fileItem.worker.chunk.worker.onmessage = (event) => {
      fileItem.worker.chunk.stop()
      resolve(event.data)
    }


    fileItem.worker.chunk.worker.postMessage(blob)
  })
}



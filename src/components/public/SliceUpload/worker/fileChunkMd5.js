import SparkMD5 from 'spark-md5'
self.addEventListener('message',  (event) => {
  getChunkMd5(event.data)
}, false);

function getChunkMd5(blob){
  var fileReader = new FileReader()
  let spark = new SparkMD5.ArrayBuffer(); //追加数组缓冲区。
  fileReader.readAsArrayBuffer(blob)
  // 文件读取完毕之后的处理
  fileReader.onload = (e) => {
    spark.append(e.target.result)
    const md5 = spark.end()
    postMessage(md5)
  }
}

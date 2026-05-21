import SparkMD5 from 'spark-md5'
self.addEventListener('message',  (event) => {

  const [file, chunkSize] = event.data
  let blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;

  let chunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;
  let spark = new SparkMD5.ArrayBuffer(); //追加数组缓冲区。
  let fileReader = new FileReader(); //读取文件
  fileReader.onload = function (e) {
    spark.append(e.target.result);
    currentChunk++;
    if (currentChunk < chunks) {
      loadNext();
    } else {
      postMessage(spark.end()) //完成md5的计算，返回十六进制结果。
    }
  };

  fileReader.onerror = function (e) {
    postMessage(e)
  };

  function loadNext() {
    let start = currentChunk * chunkSize;
    let end = start + chunkSize;
    (end > file.size) && (end = file.size);
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
  loadNext();
}, false);

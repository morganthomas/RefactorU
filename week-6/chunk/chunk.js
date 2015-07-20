function chunk(array, numChunks) {
  var chunks = [];
  var k = 0;

  for (var i = 0; i < numChunks; i++) {
    var chunkSize = Math.floor(array.length / numChunks) +
      (i < array.length % numChunks ? 1 : 0);
    var chunk = [];

    for (var j = 0; j < chunkSize; j++) {
      chunk.push(array[k]);
      k++;
    }

    chunks.push(chunk);
  }

  return chunks;
}

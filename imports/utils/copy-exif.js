/* global FileReader, File */
// Based on MinifyJpeg
// http://elicon.blog57.fc2.com/blog-entry-206.html
// https://stackoverflow.com/questions/18297120/html5-resize-image-and-keep-exif-in-resized-image

export default function copyExif (origImage, resizedImage, callback) {
  const reader = new FileReader()
  reader.addEventListener('loadend', (event) => {
    const origImageArr = Array.prototype.slice.call(new Uint8Array(event.target.result))
    const reader = new FileReader()
    reader.addEventListener('loadend', (event) => {
      const resizedImageArr = Array.prototype.slice.call(new Uint8Array(event.target.result))
      const segments = slice2Segments(origImageArr)
      const imageBuf = exifManipulation(resizedImageArr, segments)
      const image = new File([imageBuf], origImage.name, {
        type: resizedImage.type,
        lastModified: origImage.lastModified,
        lastModifiedDate: origImage.lastModifiedDate
      })
      callback(image)
    })
    reader.readAsArrayBuffer(resizedImage)
  })
  reader.readAsArrayBuffer(origImage)
}

const exifManipulation = (resizedImage, segments) => {
  var exifArray = getExifArray(segments)
  var newImageArray = insertExif(resizedImage, exifArray)
  var aBuffer = new Uint8Array(newImageArray)
  return aBuffer
}

const getExifArray = (segments) => {
  var seg
  for (var x = 0; x < segments.length; x++) {
    seg = segments[x]
    if (seg[0] === 255 && seg[1] === 225) { // (ff e1)
      return seg
    }
  }
  return []
}

const insertExif = (buf, exifArray) => {
  var separatePoint = buf.indexOf(255, 3)
  var mae = buf.slice(0, separatePoint)
  var ato = buf.slice(separatePoint)
  var array = mae
  array = array.concat(exifArray)
  array = array.concat(ato)
  return array
}

const slice2Segments = (rawImageArray) => {
  var head = 0
  var segments = []

  while (1) {
    if (rawImageArray[head] === 255 && rawImageArray[head + 1] === 218) break
    if (rawImageArray[head] === 255 && rawImageArray[head + 1] === 216) {
      head += 2
    } else {
      var length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3]
      var endPoint = head + length + 2
      var seg = rawImageArray.slice(head, endPoint)
      segments.push(seg)
      head = endPoint
    }
    if (head > rawImageArray.length) break
  }

  return segments
}

// var QRCode = require('qrcode')
import QRCode from 'qrcode'

var opts = {
    type: "svg",
    mode: 'alphanumeric',
    version: 3,
    errorCorrectionLevel: "M",
    margin: 4,
    color: {
        dark: "#000000ff",
        light: "#ffffffff",
    },
}

let canvas = document.getElementById('canvas')
let img = document.getElementById('img_qr')
let qrText = "https://zlab.dev"

// canvas
QRCode.toCanvas(canvas, qrText, function (error) {
    if (error) console.error(error)
    console.log('success');
})

// data:image/png;base64
QRCode.toDataURL(qrText, function (err, url) {
    img.setAttribute('src', url)
    console.log(url)
})

// svg file data
// QRCode.toString(qrText, opts, function (error, string) {
//     if (error) console.error(error)
//     console.log(string);
// })

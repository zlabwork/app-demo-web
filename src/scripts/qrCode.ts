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


// <canvas id="canvas"></canvas>
export function qrComponent(text) {
    var element = document.createElement('canvas');
    QRCode.toCanvas(element, text, function (error) {
        if (error) console.error(error)
    })
    return element;
}

## install
```shell
npm install --save qrcode
```

## usage
```js
// svg QR xml data
var QRCode = require('qrcode')

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
QRCode.toString('http://www.google.com', opts, function (error, string) {
    if (error) console.error(error)
    console.log(string);
})
```

## docs
https://www.npmjs.com/package/qrcode

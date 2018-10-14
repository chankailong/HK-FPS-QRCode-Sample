const QRCode = require('magic-qr-code');
const Canvas = require('canvas');
const fs = require('fs');
const crc = require('node-crc');

const payloadFormatIndicator = '000201';
const pointOfInitiationMethod = '010212';
const globallyUniqueId = '0012hk.com.hkicl';
const fpsAccount = '02078241945';
const hkPaymentInfo = `${globallyUniqueId}${fpsAccount}`;
const hkPaymentInfoLen = hkPaymentInfo.length.toString();
const hkPaymentCode = `26${hkPaymentInfoLen.padStart(2, '0')}`;
const merchantCategoryCode = '52040000';
const transactionCurrency = '5303344';
const transactionAmount = '54011';
const countryCode = '5802HK';
const merchantName = '5902NA';
const merchantCity = '6002HK';
const billNo = '010898756383';
const addInfoLen = billNo.length.toString().padStart(2, '0')
const additionalInfo = `62${addInfoLen}`
const crcValue = '6304';

function calCRC(data) {
    return crc.crc16ccitt(Buffer.from(data, 'utf8')).toString('hex')
}

function draw(data, size = 1024) {
    let marginSize = 1;
    let dataLength = data.length;
    let dataLengthWithMargin = dataLength + 2 * marginSize;
    let canvas = Canvas.createCanvas(size, size);
    let ctx = canvas.getContext('2d');
    let pointSize = Math.floor(size / dataLengthWithMargin);
    if (pointSize === 0) {
        throw new Error('cannot draw this QR Code');
    }
    let margin = Math.floor((size - (pointSize * dataLength)) / 2);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'black';
    for (let i = 0; i < dataLength; ++i) {
        for (let j = 0; j < dataLength; ++j) {
            if (data[i][j]) {
                let x = j * pointSize + margin;
                let y = i * pointSize + margin;
                ctx.fillRect(x, y, pointSize, pointSize);
            }
        }
    }
    return canvas;
}

function main() {
    const qrTempStr = `${payloadFormatIndicator}${pointOfInitiationMethod}${hkPaymentCode}${hkPaymentInfo}${merchantCategoryCode}${transactionCurrency}${transactionAmount}${countryCode}${merchantName}${merchantCity}${additionalInfo}${billNo}${crcValue}`
    const crcRes = calCRC(qrTempStr)
    const finalQRStr = `${qrTempStr}${crcRes}`
    const result = QRCode.encode(finalQRStr, QRCode.ECC_H);
    let canvas = draw(result);
    let pngBuffer = canvas.toBuffer();
    fs.writeFileSync('result.png', pngBuffer);
}

main();
 

 

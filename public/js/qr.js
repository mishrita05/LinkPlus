
function downloadQR() {

    const qrImage = document.getElementById("qrImage").src;

    const link = document.createElement("a");

    link.href = qrImage;

    link.download = "qrcode.png";

    link.click();

}

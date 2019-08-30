$('.textoacad').textfill({
    maxFontPixels: 40,
    innerTag: 'p',
    allowOverflow: true

});

$('.div-texto-alerta').textfill({
    maxFontPixels: 60,
    minFontPixels: 20,
    innerTag: 'p',
    allowOverflow: true

});

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txthorario').innerHTML =
        h + ":" + m;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}
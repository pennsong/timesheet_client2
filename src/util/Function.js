export const ppFormatDate = (date) => {
    const dateStrArr = date.split("/");
    const year = dateStrArr[0];
    const month = (Math.floor(dateStrArr[1] / 10) + "" + (dateStrArr[1] % 10));
    const day = (Math.floor(dateStrArr[2] / 10) + "" + (dateStrArr[2] % 10));

    return year + "-" + month + "-" + day;
}

export const ppFormatTime = (time) => {
    const timeStrArr = time.split(":");
    const hour = (Math.floor(timeStrArr[0] / 10) + "" + (timeStrArr[0] % 10));
    const minute = (Math.floor(timeStrArr[1] / 10) + "" + (timeStrArr[1] % 10));

    return hour + ":" + minute;
}

export const toDecimal2 = (x) => {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}
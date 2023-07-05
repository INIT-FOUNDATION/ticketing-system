exports.CONCAT = (o1, o2) => {
    if (o1) {
        for (let key in o2) {
            if (o2[key]) o1[key] = o2[key];
        }
    }
    return o1;
}

exports.capitalize = (input) => {

    if (!input) return '';

    const words = input.split(' ');
    let CapitalizedWords = [];
    words.forEach(element => {
        CapitalizedWords.push(element[0].toUpperCase() + element.slice(1, element.length));
    });
    return CapitalizedWords.join(' ');
}


exports.replaceAll = (str, mapObj) => {
    const re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str.replace(re, function (matched) {
        return mapObj[matched];
    });
}


exports.getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}

exports.groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

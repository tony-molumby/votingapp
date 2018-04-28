exports.e = function($, num, i){
    let text = $('p:nth-child(' + num + ')', 'div.col-md-4')
        .even()
        .eq(i)
        .text()
        .replace(/\t|\n/g, '');
    let j = text.indexOf(':');
    text = text.slice(j + 1).trim();
    return text;
}

exports.o = function($, num, i){
    let text = $('p:nth-child(' + num + ')', 'div.col-md-4')
        .odd()
        .eq(i)
        .text()
        .replace(/\t|\n/g, '');
    let j = text.indexOf(':');
    text = text.slice(j + 1).trim();
    return text;
}
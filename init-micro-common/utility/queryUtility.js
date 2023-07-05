function convertObjectIntoSelectQuery(object) {
    let finalQuery = "";
    if (object) {
        let specifiedFields = ""
        let selectQuery = "SELECT "
        for (const property in object) {
            let data = object[property]
            if (data) {
                if (typeof data == 'number') {
                    selectQuery += `${data} AS ${property},`
                }else if (typeof data == 'string') {
                    selectQuery += `'${data}' AS ${property},`
                }else if (property.indexOf('date') > -1) {
                    selectQuery += `NOW() AS ${property},`
                }else if (typeof data == 'object') {
                    selectQuery += `${data} AS ${property},`
                }
                
            } else {
                selectQuery += `NULL AS ${property},`
            }
            specifiedFields += `${property},`
        }
        let lastComma = selectQuery.lastIndexOf(',');
        selectQuery = selectQuery.substring(0, lastComma);
        lastComma = specifiedFields.lastIndexOf(',');
        specifiedFields = specifiedFields.substring(0, lastComma);
        finalQuery = `(${specifiedFields}) ${selectQuery}`;
    }
    return finalQuery;
}

function convertObjectIntoUpdateQuery(object) {
    let finalQuery = "";
    if (object) {
        let selectQuery = " "
        for (const property in object) {
            let data = object[property]
            if (data) {
                if (typeof data == 'number') {
                    selectQuery += `${property} = ${data}, `
                }else if (typeof data == 'string') {
                    selectQuery += `${property} = '${data}',`
                }else if (property.indexOf('date') > -1) {
                    selectQuery += `${property} = NOW(),`
                }else if (typeof data == 'object') {
                    selectQuery += `${property} = ${data},`
                }
                
            } else {
                selectQuery += `${property} = NULL,`
            }
        }
        let lastComma = selectQuery.lastIndexOf(',');
        selectQuery = selectQuery.substring(0, lastComma);
        finalQuery = `${selectQuery}`;
    }
    return finalQuery;
}

function escapeSQL (value) {
    let escapeString = "\'"
    value = replaceAll(value, escapeString);
    return value
}

function replaceAll (value, replaceString) {
    let replaceAllRegex = `/${replaceString}/ig`;
    value = value.replace(eval(replaceAllRegex), "''");
    return value;
}

module.exports.convertObjectIntoSelectQuery= convertObjectIntoSelectQuery;
module.exports.convertObjectIntoUpdateQuery= convertObjectIntoUpdateQuery;
module.exports.escapeSQL = escapeSQL;
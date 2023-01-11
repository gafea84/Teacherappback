const operators = [ '=', '>', '>=', '<', '<=', '<>', 'like' ];
const ascdes    = [ 'asc', 'desc' ];

const getWhereClause = (fields, searchConditions, idPrefix, moreConditions = '') => {
    let whereClause = (searchConditions == null) 
                        ? ''
                        : searchConditions.map(getSearchCondition(fields, idPrefix)).join(' and ');

    if ((moreConditions !== '') && (whereClause !== '')) {
        whereClause = moreConditions + ' and ' + whereClause;
    } else { // Alguno de los dos o los dos son la cadena vacía.
        whereClause = moreConditions + whereClause;
    }

    if (whereClause === '') {
        return '';
    }

    return ` where ${whereClause}`;
}

const getOrderByClause = (fields, orderByConditions, idPrefix) => {    
    const orderByClause = (orderByConditions == null)
                        ? ''
                        : orderByConditions.map(getOrderByCondition(fields, idPrefix)).join(', ');

    if (orderByClause === '') {
        return '';        
    }

    return ` order by ${orderByClause}`;
}

const getSearchCondition = (fields, idPrefix) => {
    return (
        ({ column, operator, value }) => {
            if (!fields.includes(column)) {
                return '';
            }
            
            if (!operators.includes(operator.toLowerCase())) {
                return '';
            }

            return '(' + getColumnName(column, idPrefix) + ' ' + operator + ' \'' + value.replaceAll('*', '%') + '\'' + ')';
        }
    );
}

const getOrderByCondition = (fields, idPrefix) => {    
    return (
        ({ column, order }) => {
            if (!fields.includes(column)) {
                return '';
            }

            if (!ascdes.includes(order.toLowerCase())) {
                return '';
            }

            return getColumnName(column, idPrefix) + ' ' + order;
        }
    )
}

const getColumnName = (column, idPrefix) => {
    return (column == 'id') ? (idPrefix + column) : column;
}

const getLimitClause = (limit, page) => {
    if (!page || !limit) {
        return '';
    }

    const iLimit  = parseInt(limit);
    const iOffset = (parseInt(page) - 1) * iLimit;
    return ` limit ${parseInt(iLimit)} offset ${iOffset}`;
}

module.exports = { getWhereClause, getOrderByClause, getLimitClause };
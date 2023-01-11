const getPagesCountClause = (limit) => {
    return `ceiling(count(*) / ${limit}) as pages`;
}

module.exports = { getPagesCountClause };
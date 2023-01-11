// El resultado de las consultas en un array con dos entradas:
// (Se hacen dos consultas, la primera recupera las filas, la
// segunda cuenta el número de páginas, y como son dos promesas
// se devuelve como una sola haciendo un PromiseAll -eso es lo
// que espera la parte de enrutamiento -):
//   Posición 0 --> filas resultado de la consulta
//   Posición 1 --> número de paginas
const formatSearchResult = (sentencesResult) => {
    return {
        rows:  sentencesResult[0],
        pages: parseInt(sentencesResult[1].pages)
    }
}

module.exports = { formatSearchResult };
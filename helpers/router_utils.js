const manageRouterError = (res, error) => {
    //console.log(error); // --> Habría que volcarlo a fichero de log.
    res.status(500)
       .json({ errorMessage: error.message });
}

module.exports = { manageRouterError };
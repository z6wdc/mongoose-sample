const headers = require('./headers')

const handleError = function (res, error) {
    res.writeHead(400, headers)
    res.write(JSON.stringify({
        'status': false,
        'message': error.message
    }))
    res.end()
}

module.exports = handleError

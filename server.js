const http = require('http');
const app = require('./app');

/* renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne */
const normalizePort = val => {
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }
    if (port >= 0){
        return port;
    }
    return false;
}
//lance le serveur express et normalise le port
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES' :
            console.error(bind + 'require elevated privileges. ');
            process.exit(1);
            breack;
        case 'EADDRINUSE' : 
            process.exit(1);
            breack;
        default:
            throw error;
    }
};


const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
})

server.listen(port);
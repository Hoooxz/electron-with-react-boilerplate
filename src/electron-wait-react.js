const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 4000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('starting electron');
            startedElectron = true;
            const exec = require('child_process').exec;
            let childProcess = exec('npm run electron');
            childProcess.stdout.on('data', function (data) {
                console.log(data);  // console.log anything that the electron child process console.logs
            });
            childProcess.stderr.on('data', function (data) {
                console.log(data);  // console.error anything that the electron child process console.errors
            });
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});
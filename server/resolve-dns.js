const dns = require('dns');

const hostname = '_mongodb._tcp.cluster0.mj2g1mp.mongodb.net';

dns.resolveSrv(hostname, (err, addresses) => {
    if (err) {
        console.error('DNS Resolution Error:', err);
        return;
    }
    console.log('Addresses:', addresses);
});

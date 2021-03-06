#!/usr/bin/env node 

require('./proof')(3, function (step, say, ok, equal, execute, proxy) {
  var server = execute('integer/server', []), client, callback = step();
  ok(proxy, 'proxy');
  var other = step();
  server.on('error', function (error) { throw error });
  server.stderr.pipe(process.stderr);
  server.stdout.once('data', function (chunk) {
    proxy(9293, 9593, 9000, function (buffer) { return buffer });
    client = execute('integer/client', [ '127.0.0.1', 9293 ]);
    client.stderr.pipe(process.stderr);
    client.stdout.pipe(process.stdout);
    client.on('close', function (code) {
      equal(code, 0, 'client closed');
      server.kill();
      other();
    });
  });
  server.on('close', function (code, signal) {
    if (code != null) equal(code, 0, 'server closed');
    else equal(signal, 'SIGTERM', 'server closed');
    callback(null);
  });
});

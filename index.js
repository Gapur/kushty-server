const express = require('express');
const http = require('http');
const morgan = require('morgan');

const hostname = 'localhost';
const port = 3000;

const app = express();

const morganFormat = app.get('env') === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, {
  skip: (req, res) => res.statusCode < 400, stream: process.stderr,
}));
app.use(morgan(morganFormat, {
  skip: (req, res) => res.statusCode >= 400, stream: process.stdout,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next({ name: 'RouteNotFound', message: 'Not Found', status: 404 });
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

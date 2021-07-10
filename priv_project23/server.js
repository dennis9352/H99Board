const http = require('./app');
require('./socket');

http.listen(8080, () => {
  console.log('서버 ON');
});

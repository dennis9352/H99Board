const http = require('./app');
require('./socket');

http.listen(3000, () => {
  console.log('서버 ON');
});

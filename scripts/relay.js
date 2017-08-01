import getit from 'getit';
import fs from 'fs';
import config from '../config';
getit(config.checkRelayPath, function(err, data) {
  if (err) {
    console.log(err);
  }
  else {
    fs.writeFileSync('src/relay/schema.json', data);
  }
});

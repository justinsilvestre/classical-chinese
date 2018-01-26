const { lstatSync } = require('fs')
const { walkSync } = require('fs-walk')
const { join } = require('path')

module.exports = function eachFile(path, fn) {
  if (lstatSync(path).isDirectory()) {
    walkSync(path, (basedir, filename) =>
      eachFile(join(basedir, filename), fn)
    )
  } else {
    fn(path)
  }
};

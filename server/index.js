const path = require('path');

let env = process.env.NODE_ENV || 'development'

let settings = require('./config/settings')[env]

const app = require('express')()

require('./config/database')(settings)
require('./config/express')(app)
require('./config/routes')(app)
require('./config/passport')()

if (process.env.NODE_ENV === 'production') {
    
    app.use(express.static('app/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'app', 'build', 'index.html'));
    });
  }

app.listen(settings.port)
console.log(`Server listening on port ${settings.port}...`)

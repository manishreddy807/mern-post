const mongoose = require('mongoose')

function dbConnect (){ 
    mongoose.connect(process.env.MONGO_URL,{
            useUnifiedtopology : true,
            useNewUrlParser : true,
        }).then(
            () => console.log('DB connected..'.rainbow.bgWhite.bold)
        ).catch(err => console.log(`Error: ${err.message}`.red.bold))
}

module.exports = dbConnect


const mongoose = require("mongoose")
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
class Database {

    constructor() {
        this.connect();
    }

    connect() {
     
     mongoose.connect("mongodb://127.0.0.1:27017/myvirtualclassroomdemo")
        .then(() => {
            console.log("Database Connection Successful!");
        })
        .catch((err) => {
            console.log("Database Connection Failed!" + err);
        })
    }
}

module.exports = new Database();

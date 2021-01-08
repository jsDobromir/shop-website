import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

let _db;

export const mongoConnect = (callback) => {

    MongoClient.connect('mongodb+srv://dobrganch89:France123@cluster0.8b8r3.mongodb.net/shop?retryWrites=true&w=majority',{useUnifiedTopology : true})
    .then(client => {
        console.log(`Connected to mongodb!!!`);
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(`Error connecting to mongobd ${err}`);
        throw err;
    });
};

export const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No database found';
}




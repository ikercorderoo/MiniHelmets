const mongoose = require('mongoose');

async function debugData() {
    try {
        await mongoose.connect('mongodb://iker:1234@localhost:27057/ecommerce?authSource=admin');
        const db = mongoose.connection.db;
        
        console.log('--- USARIOS ---');
        const users = await db.collection('usuarios').find().toArray();
        console.log(users);
        
        console.log('--- PRODUCTS ---');
        const products = await db.collection('products').find().toArray();
        console.log(products);
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}
debugData();

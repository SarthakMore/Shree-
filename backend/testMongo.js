const mongoose = require('mongoose');

const usernames = ['shree', 'sarthak', 'admin', 'user', 'shreevenkateshwara', 'shree_admin'];
const password = 'hfFkmuqT7al8yEfH';
const cluster = 'cluster0.vipwzc6.mongodb.net';

async function testConnections() {
  for (const user of usernames) {
    const uri = `mongodb+srv://${user}:${password}@${cluster}/anandyatra_db?retryWrites=true&w=majority`;
    console.log(`Testing MongoDB Atlas connection with username: ${user}...`);
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`✅ SUCCESS! Connected to MongoDB Atlas with username: ${user}`);
      await mongoose.disconnect();
      return uri;
    } catch (err) {
      console.log(`❌ Failed with ${user}: ${err.message}`);
    }
  }
}

testConnections();

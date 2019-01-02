const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(publicPath));

// Listen to port 3000
app.listen(3000, function () {
    console.log(`Server is up on ${port}`);
});
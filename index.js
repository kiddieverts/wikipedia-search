const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', (request, response) => {
    const artist = 'The Lathums';
    const url = `https://en.wikipedia.org/w/index.php?search=${artist}&title=Special:Search&profile=advanced&fulltext=1&ns0=1`;
    axios.get(url).then(result => {
        console.log(result);
        response.send(result.data);
    })
    console.log('abba');
});

app.listen(5000);


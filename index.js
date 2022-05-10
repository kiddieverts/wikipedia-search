// const url = `https://en.wikipedia.org/w/index.php?search=${artist}&title=Special:Search&profile=advanced&fulltext=1&ns0=1`;

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 7070;

const getOrigin = (htmlData) => {
  const arr = htmlData.split('</tr><tr><th scope="row" class="infobox-label">Origin</th>');
  if (arr.length < 2) {
    return 'Finnst ekki';
  }
  const a = arr[1];
  const b = a.split('</td>');
  const inside = b[0];

  const regex = /<[^>]*>/gi;
  const country = inside.replace(regex, '');
  return country;
}

// https://www.mediawiki.org/w/api.php

app.get('/', (request, response) => {
  const artist = encodeURI(request.query.q) + ' band';
  // const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${artist}&format=json`;
  const url = `https://en.wikipedia.org/w/index.php?search=${artist}+deepcat%3AArtist&title=Special:Search&profile=advanced&fulltext=1&advancedSearch-current=%7B%22fields%22%3A%7B%22deepcategory%22%3A%5B%22Artist%22%5D%7D%7D&ns0=1`

  console.log('URL', url);

  axios.get(url)
    .then(result => {
      const detailsUrl = result.data[3][0];
      response.send(result.data);


      if (!detailsUrl) {
        return response.send('Finnst allt ekki');
      } else {
        axios.get()
          .then(response => response.data)
          .then(htmlData => getOrigin(htmlData))
          .then(county => response.send(county))
          .catch(err => response.send('Önnur villa'));
      }
    });
})

app.listen(PORT);
console.log('Running...');


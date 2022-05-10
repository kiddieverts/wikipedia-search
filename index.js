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

app.get('/', (request, response) => {
  const artist = encodeURI(request.query.q);
  // const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${artist}&format=json`;
  const url = `https://en.wikipedia.org/w/index.php?search=${artist}+band+OR+music+OR+artist+OR+artists&title=Special:Search&profile=advanced&fulltext=1&advancedSearch-current=%7B%22fields%22%3A%7B%22or%22%3A%5B%22band%22%2C%22music%22%2C%22artist%22%2C%22artists%22%5D%7D%7D&ns0=1`
  axios.get(url)
    .then(result => {
      const detailsUrl = result.data[3][0];
      if (!detailsUrl) {
        return response.send('err1');
      } else {
        axios.get()
          .then(response => response.data)
          .then(htmlData => getOrigin(htmlData))
          .then(county => response.send(county))
          .catch(err => response.send('err2'));
      }
    })
    .catch(() => response.send('err 3'));
})

app.listen(PORT);
console.log('Running...');


// const url = `https://en.wikipedia.org/w/index.php?search=${artist}&title=Special:Search&profile=advanced&fulltext=1&ns0=1`;

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 7070;

const getOrigin = (htmlData) => {
  const arr = htmlData.split('</tr><tr><th scope="row" class="infobox-label">Origin</th>');
  if (arr.length < 2) {
    return 'Fann ekki 3';
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
  const listUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${artist}%20artist`;

  axios.get(listUrl)
    .then(result => {
      const { data } = result;
      if (!data || !data.query || !data.query.search) {
        response.send('Fann ekki 1');
      }
      const { search } = data.query;

      if (search.length === 0) {
        response.send('Fann ekki 2');
      }

      axios.get('https://en.wikipedia.org/?curid=' + search[0].pageid)
        .then(x => getOrigin(x.data))
        .then(x => response.send(x))
        .catch(() => response.send('Villa'));
    });
})

app.listen(PORT);
console.log('Running...');


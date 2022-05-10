// const url = `https://en.wikipedia.org/w/index.php?search=${artist}&title=Special:Search&profile=advanced&fulltext=1&ns0=1`;

const express = require('express');
const axios = require('axios');
const app = express();

const getDetailsHtml = (httpResponse) => {
  const htmlData = httpResponse.data;
  return htmlData;
}

const getOrigin = (htmlData) => {
  const arr = htmlData.split('</tr><tr><th scope="row" class="infobox-label">Origin</th>');
  if (arr.length === 0) {
    return 'finnst ekki'
  }
  const end = arr[1];
  const ending = end.split('</td>');
  const x = ending[0];
  const regex = /<[^>]*>/gi
  const country = x.replace(regex, '');
  return country;
}

app.get('/', (request, response) => {
  const artist = request.query.q;
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${artist}&format=json`

  axios.get(url).then(result => {
    const detailsUrl = result.data[3][0];
    axios.get(detailsUrl)
      .then(getDetailsHtml)
      .then(htmlData => getOrigin(htmlData))
      .then(county => response.send(county));
  });
});

app.listen(7070);


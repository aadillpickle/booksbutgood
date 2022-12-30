const options = {
  method: 'POST',
  headers: {
    Authorization: 'igblu081041y2h9lv6s8s3fa05yem41p2sko',
    'Operand-Index-ID': '2g2i2p14ddly',
    'Content-Type': 'application/json'
  },
  body: '{"query":"what does peter thiel think of capitalism","limit":2}'
};

async function searchWithin() {
  console.log('hello')
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'igblu081041y2h9lv6s8s3fa05yem41p2sko',
      'Operand-Index-ID': '2g2i2p14ddly',
      'Content-Type': 'application/json'
    },
    body: '{"query":"what does peter thiel think of capitalism","limit":2}'
  };

  const resp = await fetch('https://api.operand.ai/operand.v1.ObjectService/SearchWithin', options);
  const body = await resp.json();


  console.log(body.matches.map((m) => m.content));
  return body;
}

searchWithin()

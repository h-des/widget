export const fetchData = (url, key) =>
  fetch(`${url}/api/v1/widget`, {headers: {Authorization: `API_KEY ${key}`}});

export const submitData = (url, key, body) =>
  fetch(`${url}/api/v1/widget`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Authorization: `API_KEY ${key}`,
      'Content-Type': 'application/json',
    },
  });

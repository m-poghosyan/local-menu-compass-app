import { fetch } from 'whatwg-fetch'

async function fetchToken(url, { username, password }) {
  const basicAuthToken = `Basic ${btoa(`${username}:${password}`)}`

  const response = await fetch(url, {
    headers: {
      Authorization: basicAuthToken,
      'X-CSRF-Token': 'Fetch',
    },
  })
  console.log(response)
  return response.headers.get('x-csrf-token')
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

const request = async ({
  url,
  baseUrl,
  method,
  body,
  headers,
  credentials,
  json = true,
  csrf = false,
  requireAuth = false,
  auth,
}) => {
  const options = {
    method,
    body,
    credentials,
    headers: { ...headers },
  }

  if (json) {
    options.headers.accept = 'application/json'
    options.headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const { username, password } = auth
    const basicAuthToken = `Basic ${btoa(`${username}:${password}`)}`

    if (requireAuth) {
      options.headers.Authorization = basicAuthToken
    }

    if (csrf) {
      const csrfToken = await fetchToken(baseUrl, auth)
      options.headers['X-CSRF-Token'] = csrfToken
      // console.log(csrfToken)
    }

    // Default Headers
    options.headers['X-Requested-With'] = 'X' // Add this if we bypass CSRF Token
  }

  return fetch(url, options)
    .then(handleErrors)
    .then(response => {
      if (response.OK || response.ok) {
        if (json && response.status !== 204) {
          return response.json()
        }
        return response
      }
    })
    .then(data => data)
    .catch(error => {
      console.log('Fetch Error: ', error)
    })
}

export default request

# Marvel API Node Cient

| Data provided by Marvel. © 2014 Marvel

First of all, I want to thank [Marvel](https://marvel.com) for providing a fantastic [Developer API](https://developer.marvel.com) to expose their rich data sets for us. This project is an attempt to make this API more accessible to those accessing it via [Node.js](https://nodejs.org) while helping the applications operate within the guidelines of the API.

### Features

* **ETag Support:** fully cached response keyed by URL+params replayed on 304 status codes.
* **Export/Import Cache:** allows application to perisist cache as desired
* **Readable API:** logical method signature follows the endpoint pattern

## Installation

Install this module via your package manager.

```sh
# via npm
$ npm install --save @guahanweb/node-marvel-api

# via yarn
$ yarn add @guahanweb/node-marvel-api

```

## Usage

In order to use this, you must configure a Developer account on the [Marvel API](https://developer.marvel.com) website. Once you have generated an access key pair, you will need to use them to initialize the API client.

```javascript
// Initialize your client with your tokens
const Marvel = require('@guahanweb/marvel-api').init({
	public_key: PUBLIC_KEY,
	private_key: PRIVATE_KEY
});
```

Once initialized, the client may be used to retrieve data:

```javascript
// Retrieve list of Characters
//   Endpoint: /characters
Marvel.characters().execute()
	.then(handleResults)
	.catch(console.error);
	
// Retrieve a single character's creators
//   Endpoint: /characters/{characterId}/creators
Marvel.characters().id(characterId).creators()
	.execute()
	.then(handleResults)
	.catch(console.error);
```

### Query Object

When specifying your query, a query object is returned that can be used to chain subsequent requests. It is the `execute()` method on the Query object that returns a promise that will be resolved with the Response from the API.

If you want to paginate through all the results of a particular query, you might want to use the `.next` iterator on the Query.

```javascript
let query = Marvel.comics({ dateDescriptor: 'thisMonth' });
query.execute().then(handlePage);

function handlePage(res) {
	console.log(`Processing ${res.data.count}/${res.data.total} results`);
	query = query.next;
	if (query !== null) {
		query.execute().then(handlePage);
	} else {
		console.log('done');
	}
}
```

This code will output something like this:

```
Processing 20/142 results
Processing 20/142 results
Processing 20/142 results
Processing 20/142 results
Processing 20/142 results
Processing 20/142 results
Processing 20/142 results
Processing 2/142 results
done
```

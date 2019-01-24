# Marvel API Node Cient

This project is meant to provide a Node.js client to the [Marvel API](https://developer.marvel.com).
Once you have registered for an access token, you may use this library to help aid your data retrieval.

## Example Usage

```javascript
const Marvel = require('./api');
Marvel.init({
  public_key: YOUR_PUBLIC_KEY,
  private_key: YOUR_PRIVATE_KEY
});

// Retrieve characters named "spider*"
Marvel.characters.list({ nameStartsWith: 'spider' })
  .then(({ data }) => {
    data.results.forEach(spider => console.log(spider.name));
  })
  .catch(console.error);
```

Results:
```
Spider-dok
Spider-Girl (Anya Corazon)
Spider-Girl (May Parker)
Spider-Ham (Larval Earth)
Spider-Man
Spider-Man (1602)
Spider-Man (2099)
Spider-Man (Ai Apaec)
Spider-Man (Ben Reilly)
Spider-Man (House of M)
Spider-Man (LEGO Marvel Super Heroes)
Spider-Man (Marvel Zombies)
Spider-Man (Marvel: Avengers Alliance)
Spider-Man (Miles Morales)
Spider-Man (Noir)
Spider-Man (Takuya Yamashiro)
Spider-Man (Ultimate)
Spider-Woman (Charlotte Witter)
Spider-Woman (Jessica Drew)
Spider-Woman (Mattie Franklin)
```

## Features

* Build in ETag support for replaying API requests

| Data provided by Marvel. © 2014 Marvel

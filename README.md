# Image Search Abstraction Layer

The fourth project in API section on [freeCodeCamp](https://www.freecodecamp.org/challenges/image-search-abstraction-layer).

### The user stories are:

* I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
* I can paginate through the responses by adding a `?offset=2` parameter to the URL.
* I can get a list of the most recently submitted search strings.

### Examples of usage:

#### Images search:

Input
```
curl -X GET 'https://fcc-image-search-bf.glitch.me/search/cats'
```

Output
```
[
  {
    "text": "Imgur needs more pics of fat cats",
    "page": "https://imgur.com/a/uVfzAL9",
    "image": "https://i.imgur.com/c9TkcsQ.jpg"
  },
  ...
]
```

You can provide an additional query parameter for pagination: `?offset=`

#### Recent searches:

Input
```
curl -X GET 'https://fcc-image-search-bf.glitch.me/recent'
```

Output
```
[
  {
    "query": "cats",
    "timestamp": 1525717078149
  },
  {
    "query": "dogs",
    "timestamp": 1525687334818
  },
  ...
]
```

You can also choose the amount of recent queries with optional parameter:
```
curl -X GET 'https://fcc-image-search-bf.glitch.me/recent/42'
```

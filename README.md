# URL Shortnener
## Implemented in Node.js using mongoDB

This project is usable locally, with Docker, and on my personal [domain](https://johnodonnell.dev).

### Usage
Use docker-compose to build images of webapp and local mongoDB server, then create containers off the images.

```
docker-compose -f /path/to/docker-compose.yml build
docker-compose -f /path/to/docker-compose.yml up -d
```

The URL Shortener can be used through a browser or in the command line.

***Browser:***
[Visit Localhost](localhost:80/)

***Command Line:***
All commands can either use
```
localhost:80
```
or
```
www.johnodonnell.dev
```

Shorten a URL:
```
curl localhost:80/shrt \
-X POST \
-H "Content-Type: application/json" \
-d '{"longurl":"<insert_url>"}'
```

Get list of all shortened URLs:
```
curl localhost:80/shrt/all
```

Get a particular shortened URL by database index:
```
curl localhost:80/shrt/<insert_idx>
```

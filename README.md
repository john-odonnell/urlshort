# URL Shortnener
## Implemented in Node.js using mongoDB

This project is usable locally, with Docker, and on my personal [domain](https://jod.dev).

### Local Usage
Use docker-compose to build images of webapp and local mongoDB server, then create containers off the images.

```
docker-compose -f /path/to/docker-compose.yml build
docker-compose -f /path/to/docker-compose.yml up -d
```

The URL Shortener can be used through a browser or in the command line.

***Browser:***
Visit [localhost](localhost:80/) after the containers have been started.

***Command Line:***
All commands can either use either the local address at localhost:80/ or the hosted domain, www.jod.dev/.

Pasting URLs into Zsh can be problematic, as it inserts forward slashes in front of filename expansion characters, such as ? and =.

Shorten a URL:
```
curl localhost:80/ \
-X POST \
-H "Content-Type: application/json" \
-d '{"inputurl":"<insert_url>"}'
```

Get list of all shortened URLs:
```
curl localhost:80/shrt/all
```

Get a particular shortened URL by database index:
```
curl localhost:80/shrt/<insert_idx>
```

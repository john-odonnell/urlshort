# URL Shortnener
## Implemented in Node.js using mongoDB

### Usage
Build Docker image, and create container exposed on port 80

```
docker image build path/to/urlnode/.
docker container run -d -p 80:80 --name urlshrt urlshrt
```

The URL Shortener can be used through a browser or in the command line.

***Browser:***
[Visit Localhost](localhost:80/)

***Command Line:***

Shorten a URL:
```
curl localhost:80/shrt \
-X POST \
-H "Content-Type: application.json" \
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

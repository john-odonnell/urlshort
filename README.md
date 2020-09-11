# URL Shortnener
## Implemented in Node.js using mongoDB

A browser and command-line tool for shortening URLs.

---
### Hosted Usage

Visit [jod.dev](https://jod.dev) to use the service, hosted on Heroku.

---
### Local Usage
Clone the repository, and cd into the repo directory.

Use docker-compose to build images of the web app and a local mongoDB server, then run containers off the images.

```
docker-compose build
docker-compose up -d
```

Visit [localhost](localhost:80/) on port 80 after the containers have been started.

---
### Command Line Use

All commands can either use either the local address at localhost:80/ or the hosted domain, https://www.jod.dev/.

Pasting URLs into zsh can be problematic, as it inserts forward slashes in front of filename expansion characters, such as ? and =.

**Shorten a URL:**
```
curl localhost:80/ \
-X POST \
-H "Content-Type: application/json" \
-d '{"inputurl":"<insert_url>"}'
```

**Get list of all shortened URLs:**
```
curl localhost:80/shrt/all
```

**Get a particular shortened URL by database index:**
```
curl localhost:80/shrt/<insert_idx>
```

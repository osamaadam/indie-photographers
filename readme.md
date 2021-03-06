# Indie Photographers

Indie Photographers is a passion project of mine that I hope could go commercial at a future point in time.

But for now if you'd like to test drive it on your machine you'll have to fill in the .env file at root directory as follows.

First you'd have to clone the app

```sh
-$ git clone https://github.com/osamaadam/indie-photographers.git
-$ cd indie-photographers
```

Now create a .env file at the root directory with your own details.

```env
MONGO_URI=<your mongo connection string>
jwtSecret=<any arbitrary secret>
```

It is recommended that you use docker-compose to run the container without any extra setup.

```sh
-$ docker-compose up
```

However, you may run it locally by running the following. (You'll have to set up the MongoDB server yourself.)

```sh
-$ yarn
-$ yarn dev
```

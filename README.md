## Description

This repository show an example on how to implement revocable JWT on NestJS.

While JWT provide you an stateless session and works very well with API, but for security perspective the JWT might be stolen. And if it's stolen, we need a way to make the compromised JWT cannot be used again even if it's still active (not expired). 

So to achive this, we gonna use the `jti` (JWT ID, [see here](https://tools.ietf.org/html/rfc7519#page-10)) to identify the JWT token, and use `redis` to store the token and use the expiration so the expired token will be removed from the store automatically.

## Installation

- Open `auth.module.ts`
- Edit the `redis` configuration
- Install dependencies

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## License

[MIT licensed](LICENSE).

# Elixeum JS SDK

Welcome to the official JavaScript SDK for the Elixeum Platform! Our SDK provides a comprehensive suite of tools, resources, and documentation to facilitate seamless integration with Elixeum using **JavaScript**.

> [!WARNING]
> The SDK is Work-In-Progress and unstable.

## Features

- Easy-to-use API for interacting with the Elixeum Platform
- Supports both browser and Node.js environments

## Dependencies

For development following libraries are used:

- Node.JS (v20 and higher tested)
- Rollup with ESLint and Terser plugins

For use on website, just include the minified bundle and you are good to go.
No external libraries are required. The library is aiming ES5 compatibility for wider use in older browsers.

## Getting Started

We've included detailed installation and usage instructions in the following sections to help you get started with the **Elixeum JS SDK.** If you have any questions, feel free to reach out to us through the [Issues](https://github.com/elixeum/elixeum-js-sdk/issues) section of this repository.

We're excited to see what you'll create with the Elixeum JS SDK! Happy coding :star_struck:

### Include pre-built SDK

Use simple `<script>` tag to include pre-built SDK from Github, or import it using `import` statement.

```html
<script src="https://github.com/Elixeum/elixeum-js-sdk/releases/download/v0.1.0-alpha/elx-sdk.min.js"></script>
```

### Generate Application Token

In your tenant settings, generate application token with permissions which you will be using.
Please keep in mind, the token is technically visible to anyone who will open your page, so try to limit the permissions to the minimum required.
Also do not forget to set the token expiration time to reasonable value and allowed domain list to only your domain.

Include the generated token in `ElixeumClient` initialization as `token` parameter.

```javascript
let elixeum = new ElixeumClient({
  token: appToken,
  api: "https://portal.elixeum.cloud",
  debug: true,
});
```

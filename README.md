

Install the dependencies:

```bash
npm install
```

Create a `.env` file by copying the `.env.example`.

```bash
cp .env.example .env
```

### Credentials

You will need your Twilio Account SID, available in your [Twilio console](https://www.twilio.com/console). Add it to the `.env` file.

You will also need an API key and secret, you can create these under the [Programmable Video Tools in your console](https://www.twilio.com/console/video/project/api-keys). Create a key pair and add them to the `.env` file too.

## Running the application

Once you have completed the above you can run the application with:

```bash
npm run dev
```

This will open in your browser at [localhost:3000](http://localhost:3000).

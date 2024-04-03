
# MintedWaves
This repository is a MintedWaves Dapp

## Getting Started

In order for this template to work, you have to set all the needed variable inside .env file.

If you are using Filebase, here is where you can find the given variables:

- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` can be found here:

![screenshot](/sample.png "Filebase console sample")

You then have to create three different buckets, one for the NFT's images, one for the NFT's audio files, and one for the metadatas and set the proper variables inside the .env file.

## CORS

You might be facing CORS issues. If you have to create specific CORS for your bucket. Here is the [documentation](https://docs.filebase.com/api-documentation/cross-origin-resource-sharing-cors/create-and-apply-a-cors-rule-to-a-filebase-bucket)


## Run the sample
switch to next example directory and install the dependencies:
```bash
cd <next example folder>

npm install
# or
yarn install
```
run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

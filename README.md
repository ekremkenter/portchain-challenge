# Portchain Coding challenge - Import and analyse port calls
[Demo Site](https://portchain-challenge.mek.app/)
[Demo API Endpoint](https://i76e6lckle.execute-api.us-east-1.amazonaws.com/demo/data)


## :wrench: Quick start

### API
1. **Open API folder** `cd api`
2. **Install Dependencies**  Run `npm install` or `yarn`
3. **Run tests to ensure everything is working** Run `npm run test` or `yarn test`
4. **Start API Server** Run `npm run develop` or `yarn develop`

### Web
1. **Open web folder** `cd web`
2. **Install Dependencies**  Run `npm install` or `yarn`
3. **Run tests to ensure everything is working** Run `npm run test` or `yarn test`
4. **Start Web** Run `npm run develop` or `yarn develop`

## :rocket: Deploy
### Serverless on AWS
1. **Follow instructions on [Serverless AWS Credential Guide](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/) to add credentials on your host
2. **Deploy API** 
  * Navigate to `api` directory.
  * Run `serverless deploy`
  * Copy the *endpoint* on logged console. It should be something like *https://someRandomID.execute-api.us-east-1.amazonaws.com/dev*
  * Navigate to that endpoint to make sure it is deployed successfully. You should see 
  ```json
{
"success": true,
  "data": {
    "hello": "world!"
  }
}
  ```
3. **Deploy Web**
  * Navigate to `web` directory
  * Create a new `.env` file for your custom stage like `.env.test` or just edit `.env` file. Add/Edit base url with endpoint you copied earlier.
  ```
  REACT_APP_BASE_URL=https://someRandomID.execute-api.us-east-1.amazonaws.com/dev
  ```
  * Run `serverless deploy` if you just edited `.env` file, or `serverless deploy --stage test` for `.env.test`
  * Copy url logged on console. It should be something like *https://someRandomID.cloudfront.net* Since our API has cors protection we need to add this url to safe domain list once. Change `allowedOrigins` variable in `/api/src/app.ts` to include your deployment url and *redeploy API*
  
  


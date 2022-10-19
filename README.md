# Introduction

In order to assess our candidates competencies, we ask that they complete this coding test and submit us the results. 

If you've stumbled accross this repository and would like to apply for a role in the Io Finnet test team, then please reach out to `hr@iofinnet.com` with your completed submission and CV. 

# Expectations

1. Show your experience with implementing a basic testing framework from scratch
2. Implement either integration tests, or end-2-end tests for testing that the lambdas correctly pass information from the API to the database.

## How to use

You can deploy this stack either locally or on AWS directly. Everything in this test can be run for within the Free tier of AWS

### Deployment to AWS

** Everything in this test can be run for within the Free tier of AWS **

1. We hope you'll already have an AWS account. If not, you can open one for free. We assume you have administration rights so we have not provided a list of IAM permissions needed to deploy all the resources of this test.

2. Fork and clone this repository and install the dependencies locally.

3. Deploy the stack with serverless to AWS. Ensure you have AWS API credentials saved locally or inject them as a CLI variables. To deploy, simply type `npx sls deploy --stage test`. 
This will create the following resources:
  - Custom Eventbridge (to not use the default)
  - HTTP V2 API Gateway
  - 3 Lambdas
    - POST /events API to create events
    - GET /events API to retrieve a list of events
    - A lambda attached to the EventBridge listening to events added to the bridge

### Running it locally

1. Fork and clone this repository and install the dependencies locally.
2. Initiate the dynamodb install `npx sls dynamodb install`
3. Run the stack with `npx sls offline start`
4. Note this will run Dynamodb in memory mode. This will reset the data on each restart.


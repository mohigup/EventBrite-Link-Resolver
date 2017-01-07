# Eventbrite Link Preview for Mixmax

This is an open source Mixmax Link Resolver. See <http://developer.mixmax.com/docs/overview-link-resolvers> for more information about how to use this example code in Mixmax.

## Running locally

1. Install using `npm install`
2. Run using `npm start`

To simulate locally how Mixmax calls the resolver URL (to return HTML that goes into the email), run:

```
curl http://localhost:9146/resolver?url=https://www.eventbrite.com/e/mit-sloan-sports-analytics-conference-2017-tickets-5414123790
```
## Running locally with Mixmax Dashboard

1. Open up the Mixmax Dashboard, click Settings, click Integrations, and click Add Link Resolver
2. Enter the following for the parameters:

Input name:	 Eventbrite (eventbrite.com/e/*)
Regular Expression: eventbrite.com/e/[^\/]+-[^\/]+$
Resolver URL: http://localhost:9146/resolver



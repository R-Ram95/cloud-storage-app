#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { APIStack } from "../lib/stacks/api-stack";
import { AuthStack } from "../lib/stacks/auth-stack";
import { DnsStack } from "../lib/stacks/dns-stack";
import { StorageStack } from "../lib/stacks/storage-stack";

const APP_NAME = "rDrive";
const ROOT_DOMAIN = "rohineshram.com";

const app = new cdk.App();

const authStack = new AuthStack(app, `${APP_NAME}-AuthStack`, {
  appName: APP_NAME,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const dnsStack = new DnsStack(app, `${APP_NAME}-DnsStack`, {
  appName: APP_NAME,
  rootDomain: ROOT_DOMAIN,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const storageStack = new StorageStack(app, `${APP_NAME}-StorageStack`, {
  appName: APP_NAME,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const apiStack = new APIStack(app, `${APP_NAME}-BackendStack`, {
  appName: APP_NAME,
  userPool: authStack.userPool,
  appClient: authStack.appClient,
  gatewayDomain: dnsStack.domainName,
  metaDataTable: storageStack.metaDataTable,
  assetStorage: storageStack.assetBucket,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();

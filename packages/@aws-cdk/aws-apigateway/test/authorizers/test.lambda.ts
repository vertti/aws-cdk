import { expect, haveResource } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { Test } from "nodeunit";
import apigateway = require('../../lib');

export = {
  'default token authorizer'(test: Test) {
    const stack = new cdk.Stack();
    const restApi = new apigateway.RestApi(stack, 'myrestapi');

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    new apigateway.LambdaTokenAuthorizer(stack, 'myauthorizer', {
      restApi,
      headerName: 'whoami',
      function: func
    });

    expect(stack).to(haveResource('AWS::ApiGateway::Authorizer', {
      Type: 'TOKEN'
    }));

    test.done();
  }
};

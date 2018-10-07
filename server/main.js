import Agent from 'meteor/kschingiz:meteor-elastic-apm';

// more configuration here: https://www.elastic.co/guide/en/apm/agent/nodejs/current/advanced-setup.html#configuring-the-agent
Agent.start({
  serviceName: "meteor-demo-app"
});

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

Meteor.startup(() => {
  // showcase of outgoing HTTP request
  HTTP.get("https://google.com", function(){
    console.log(done);
  });
});

const TestCollection = new Meteor.Collection('testCollection');

Meteor.methods({
  testExceptionHandling: function(){
    throw new Error("TestExceptionHandling");
  },
  testRequestsUsingHTTP: function(){
    const res = HTTP.get("https://google.com");
    return res;
  },
  testCollectionInsert: function(){
    TestCollection.insert({
      value: Math.random()
    });

    // TODO: Catch meteor calls inside meteor calls
    Meteor.call("testRequestsUsingHTTP", function(){
      console.log("testRequestsUsingHTTP");
    });
  },
  testCollectionInsertAsync: function(){
    const Future = require('fibers/future');
    const future = new Future();

    Meteor.setTimeout(() => {
      TestCollection.insert({
        value: Math.random()
      });

      future.return();
    }, 250);

    future.wait();
  },
  testCollectionRemove: function(){
    const docToRemove = TestCollection.findOne();

    if(docToRemove){
      TestCollection.remove({ _id: docToRemove._id });
    }
  },
  testCustomAPMEvents: function(){
    const transaction = Agent.startTransaction('myCustomTransaction', 'custom');
    const span = Agent.startSpan('mySpan', 'custom');

    // Pretending some work
    Meteor.setTimeout(() => {
      span.end();
      transaction.end();
    });
  }
});

Meteor.publish('testPublication', () => {
  return TestCollection.find({});
});

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './main.html';

Meteor.subscribe('testPublication');

Template.buttons.events({
  'click button'(event, instance) {
    const methodName = event.currentTarget.className;
    Meteor.call(methodName, function(err, res){
      console.log(methodName, " done with ", err, res);
    });
  },
});

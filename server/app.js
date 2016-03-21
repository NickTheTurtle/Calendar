Meteor.startup(function() {
    Meteor.users.deny({
        insert: function() {
            return false;
        },
        update: function() {
            return false;
        },
        remove: function() {
            return false;
        }
    });
    Meteor.methods({
        "addEvent": function(eventStart, allDay) {
            check(eventStart, Date);
            if (this.userId) {
                var events = Meteor.users.findOne({
                    _id: this.userId
                }).events || [];
                events.push({
                    _id: Meteor.uuid(),
                    title: "New Event",
                    start: eventStart,
                    end: allDay ? moment(eventStart).add(1, "day").toDate() : eventStart,
                    allDay: allDay
                });
                if (events.length <= 100) {
                    Meteor.users.update({
                        _id: this.userId
                    }, {
                        $set: {
                            events: events
                        }
                    });
                }
                else {
                    throw new Meteor.Error("event-amount-exceeded");
                }
            }
        },
        "dropEvent": function(eventId, eventName, eventStart, eventEnd, allDay) {
            check(eventId, String);
            check(eventName, String);
            check(eventStart, Date);
            check(eventEnd || new Date(), Date);
            if (this.userId) {
                var events = Meteor.users.findOne({
                    _id: this.userId
                }).events || [];
                var eventIndex = events.findIndex(function(a) {
                    return a._id === eventId;
                });
                if (eventIndex !== -1) {
                    events[eventIndex].title = eventName;
                    events[eventIndex].start = eventStart;
                    events[eventIndex].end = eventEnd || eventStart;
                    events[eventIndex].allDay = allDay;
                    Meteor.users.update({
                        _id: this.userId
                    }, {
                        $set: {
                            events: events
                        }
                    });
                }
                else {
                    throw new Meteor.Error("event-not-found");
                }
            }
        },
        "deleteEvent": function (eventId) {
            check(eventId, String);
            if (this.userId) {
                var events = Meteor.users.findOne({
                    _id: this.userId
                }).events || [];
                var eventIndex = events.findIndex(function(a) {
                    return a._id === eventId;
                });
                if (eventIndex !== -1) {
                    events.splice(eventIndex, 1);
                    Meteor.users.update({
                        _id: this.userId
                    }, {
                        $set: {
                            events: events
                        }
                    });
                }
                else {
                    throw new Meteor.Error("event-not-found");
                }
            }
        }
    });
    Meteor.publish(null, function() {
        if (this.userId) {
            return Meteor.users.find({
                _id: this.userId
            }, {
                fields: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    events: 1
                }
            });
        }
    });
});

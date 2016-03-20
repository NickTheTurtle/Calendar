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
        "dropEvent": function(eventId, eventStart, eventEnd, allDay) {
            check(eventId, String);
            check(eventStart, Date);
            check(eventEnd, Date);
            if (this.userId) {
                var events = Meteor.users.findOne({
                    _id: this.userId
                }).events || [];
                var eventIndex = events.findIndex(function(a) {
                    return a._id === eventId;
                });
                if (eventIndex !== -1) {
                    events[eventIndex].start = eventStart;
                    if (eventEnd) {
                        events[eventIndex].end = eventEnd;
                    } else {
                        delete events[eventIndex].end
                    }
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

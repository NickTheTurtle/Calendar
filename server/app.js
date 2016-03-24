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
        "addAllDayEvent": function(eventStart) {
            check(eventStart, Date);
            eventStart = moment(eventStart).stripTime().toDate();
            if (this.userId) {
                var events = Meteor.users.findOne({
                    _id: this.userId
                }).events || [];
                var randomId = Meteor.uuid();
                events.push({
                    _id: randomId,
                    title: "New Event",
                    start: eventStart,
                    end: moment(eventStart).add(1, "day").toDate(),
                    allDay: true
                });
                if (events.length <= 100) {
                    Meteor.users.update({
                        _id: this.userId
                    }, {
                        $set: {
                            events: events
                        }
                    });
                    return randomId;
                }
                else {
                    throw new Meteor.Error("event-amount-exceeded");
                }
            } else {
                throw new Meteor.Error("not-logged-in");
            }
        },
        addNonAllDayEvent: function (eventStart) {
            check(eventStart, Date);
            if (this.userId) {
                var events = Meteor.users.findOne({
                    _id: this.userId
                }).events || [];
                var randomId = Meteor.uuid();
                events.push({
                    _id: randomId,
                    title: "New Event",
                    start: eventStart,
                    end: moment(eventStart).add(1, "hour").toDate(),
                    allDay: false
                });
                if (events.length <= 100) {
                    Meteor.users.update({
                        _id: this.userId
                    }, {
                        $set: {
                            events: events
                        }
                    });
                    return randomId;
                }
                else {
                    throw new Meteor.Error("event-amount-exceeded");
                }
            } else {
                throw new Meteor.Error("not-logged-in");
            }
        },
        "dropToAllDayEvent": function(eventId, eventName, eventStart, eventEnd) {
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
                    events[eventIndex].end = eventEnd || moment(eventStart).add(1, "day").toDate();
                    events[eventIndex].allDay = true;
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
            } else {
                throw new Meteor.Error("not-logged-in");
            }
        },
        "dropToNonAllDayEvent": function(eventId, eventName, eventStart, eventEnd) {
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
                    events[eventIndex].end = eventEnd || moment(eventStart).add(1, "hour").toDate();
                    events[eventIndex].allDay = false;
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
            } else {
                throw new Meteor.Error("not-logged-in");
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

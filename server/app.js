/* globals moment LZString */
Meteor.startup(() => {
    Accounts.onCreateUser((options, user) => {
        user.events = LZString.compressToUTF16("[]");
        return user;
    });
    Meteor.users.deny({
        insert() {
                return false;
            },
            update() {
                return false;
            },
            remove() {
                return false;
            }
    });
    Meteor.methods({
        addAllDayEvent(eventStart) {
                check(eventStart, Date);
                if (this.userId) {
                    var events = JSON.parse(LZString.decompressFromUTF16(Meteor.users.findOne({
                        _id: this.userId
                    }).events) || "[]");
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
                                events: LZString.compressToUTF16(JSON.stringify(events))
                            }
                        });
                        return randomId;
                    }
                    else {
                        throw new Meteor.Error("event-amount-exceeded");
                    }
                }
                else {
                    throw new Meteor.Error("not-logged-in");
                }
            },
            addNonAllDayEvent(eventStart) {
                check(eventStart, Date);
                if (this.userId) {
                    var events = JSON.parse(LZString.decompressFromUTF16(Meteor.users.findOne({
                        _id: this.userId
                    }).events) || "[]");
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
                                events: LZString.compressToUTF16(JSON.stringify(events))
                            }
                        });
                        return randomId;
                    }
                    else {
                        throw new Meteor.Error("event-amount-exceeded");
                    }
                }
                else {
                    throw new Meteor.Error("not-logged-in");
                }
            },
            dropToAllDayEvent(eventId, eventName, eventStart, eventEnd) {
                check(eventId, String);
                check(eventName, String);
                if (eventName.length > 50) {
                    throw new Meteor.Error("event-name-length");
                }
                check(eventStart, Date);
                check(eventEnd || new Date(), Date);
                if (this.userId) {
                    var events = JSON.parse(LZString.decompressFromUTF16(Meteor.users.findOne({
                        _id: this.userId
                    }).events) || "[]");
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
                                events: LZString.compressToUTF16(JSON.stringify(events))
                            }
                        });
                    }
                    else {
                        throw new Meteor.Error("event-not-found");
                    }
                }
                else {
                    throw new Meteor.Error("not-logged-in");
                }
            },
            dropToNonAllDayEvent(eventId, eventName, eventStart, eventEnd) {
                check(eventId, String);
                check(eventName, String);
                if (eventName.length > 50) {
                    throw new Meteor.Error("event-name-length");
                }
                check(eventStart, Date);
                check(eventEnd || new Date(), Date);
                if (this.userId) {
                    var events = JSON.parse(LZString.decompressFromUTF16(Meteor.users.findOne({
                        _id: this.userId
                    }).events) || "[]");
                    var eventIndex = events.findIndex((a) => a._id === eventId);
                    if (eventIndex !== -1) {
                        events[eventIndex].title = eventName;
                        events[eventIndex].start = eventStart;
                        events[eventIndex].end = eventEnd || moment(eventStart).add(1, "hour").toDate();
                        events[eventIndex].allDay = false;
                        Meteor.users.update({
                            _id: this.userId
                        }, {
                            $set: {
                                events: LZString.compressToUTF16(JSON.stringify(events))
                            }
                        });
                    }
                    else {
                        throw new Meteor.Error("event-not-found");
                    }
                }
                else {
                    throw new Meteor.Error("not-logged-in");
                }
            },
            deleteEvent(eventId) {
                check(eventId, String);
                if (this.userId) {
                    var events = JSON.parse(LZString.decompressFromUTF16(Meteor.users.findOne({
                        _id: this.userId
                    }).events) || "[]");
                    var eventIndex = events.findIndex((a) => a._id === eventId);
                    if (eventIndex !== -1) {
                        events.splice(eventIndex, 1);
                        Meteor.users.update({
                            _id: this.userId
                        }, {
                            $set: {
                                events: LZString.compressToUTF16(JSON.stringify(events))
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
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                services: 0
            }
        });
    });
});
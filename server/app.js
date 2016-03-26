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
        addEvent(eventStart, allDay) {
                check(eventStart, Date);
                if (moment(eventStart).isBefore([1500, 0, 1]) || moment(eventStart).isAfter([2500, 11, 31])) {
                    throw new Meteor.Error("date-out-of-range");
                }
                if (this.userId) {
                    var events = JSON.parse(LZString.decompressFromUTF16(Meteor.users.findOne({
                        _id: this.userId
                    }).events) || "[]");
                    var randomId = Meteor.uuid().slice(0, 13);
                    events.push({
                        _id: randomId,
                        title: "New Event",
                        start: eventStart,
                        end: allDay ? moment(eventStart).add(1, "day").toDate() : moment(eventStart).add(1, "hour").toDate(),
                        allDay: allDay
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
            dropEvent(eventId, eventName, eventStart, eventEnd, allDay, repeat) {
                check(eventId, String);
                check(eventName, String);
                check(allDay, Boolean);
                check(eventStart, Date);
                check(eventEnd || new Date(), Date);
                if (moment(eventStart).isBefore([1500, 0, 1]) || moment(eventStart).isAfter([2500, 11, 31])) {
                    throw new Meteor.Error("date-out-of-range");
                }
                if (moment(eventEnd).isBefore([1500, 0, 1]) || moment(eventEnd).isAfter([2500, 11, 31])) {
                    throw new Meteor.Error("date-out-of-range");
                }
                if (repeat) {
                    check(repeat.type, String);
                    check(repeat.skip, Match.Integer);
                    check(repeat.skip, Match.Where((a) => a >= 0));
                    check(repeat.start, Date);
                    check(repeat.end, Date);
                    if (moment(repeat.start).isBefore([1500, 0, 1]) || moment(repeat.start).isAfter([2500, 11, 31])) {
                        throw new Meteor.Error("date-out-of-range");
                    }
                    if (moment(repeat.end).isBefore([1500, 0, 1]) || moment(repeat.end).isAfter([2500, 11, 31])) {
                        throw new Meteor.Error("date-out-of-range");
                    }
                    if (repeat.type === 0) { //daily
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: repeat.start,
                            end: repeat.end
                        };
                    }
                    else if (repeat.type === 1) { //weekly
                        check(repeat.weekDays, [Match.Integer]);
                        if (repeat.weekDays.length > 7) {
                            throw new Meteor.Error("day-of-week-length");
                        }
                        repeat.weekDays.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: repeat.start,
                            end: repeat.end,
                            weekDays: repeat.weekDays
                        };
                    }
                    else if (repeat.type === 2) { //same day each month
                        check(repeat.monthDays, [Match.Integer]);
                        if (repeat.monthDays.length > 31) {
                            throw new Meteor.Error("day-of-month-length");
                        }
                        repeat.monthDays.forEach((a) => {
                            if (a < 1 || a > 31) {
                                throw new Meteor.Error("day-of-month-out-of-range");
                            }
                        });
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: repeat.start,
                            end: repeat.end,
                            monthDays: repeat.monthDays
                        };
                    }
                    else if (repeat.type === 3) { //same week each month
                        check(repeat.weekDays, [Match.Integer]);
                        if (repeat.weekDays.length > 7) {
                            throw new Meteor.Error("day-of-week-length");
                        }
                        repeat.weekDays.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        check(repeat.weekNumber, Match.Integer);
                        if (repeat.weekNumber.length < 1 || repeat.weekNumber.length > 5) {
                            throw new Meteor.Error("number-of-week-out-of-range");
                        }
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: repeat.start,
                            end: repeat.end,
                            weekDays: repeat.weekDays,
                            weekNumber: repeat.weekNumber
                        };
                    }
                    else if (repeat.type === 4) { //same day each year
                        check(repeat.month, Match.Integer);
                        if (repeat.month < 1 && repeat.month > 12) {
                            throw new Meteor.Error("month-out-of-range");
                        }
                        check(repeat.date, Match.Integer);
                        if (repeat.date < 1 && repeat.month > 31) {
                            throw new Meteor.Error("date-out-of-range");
                        }
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: repeat.start,
                            end: repeat.end,
                            month: repeat.month,
                            date: repeat.date
                        };
                    }
                    else if (repeat.type === 5) { //same week each year
                        check(repeat.weekDays, Match.Integer);
                        if (repeat.weekDays < 0 || repeat.weekDays > 6) {
                            throw new Meteor.Error("day-of-week-out-of-range");
                        }
                        check(repeat.weekNumber, Match.Integer);
                        if (repeat.weekNumber.length < 1 || repeat.weekNumber.length > 5) {
                            throw new Meteor.Error("number-of-week-out-of-range");
                        }
                        check(repeat.month, Match.Integer);
                        if (repeat.month < 1 && repeat.month > 12) {
                            throw new Meteor.Error("month-out-of-range");
                        }
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: repeat.start,
                            end: repeat.end,
                            weekDays: repeat.weekDays,
                            weekNumber: repeat.weekNumber,
                            month: repeat.month
                        };
                    }
                    else {
                        throw new Meteor.Error("unknown-repeat-type");
                    }
                }
                if (eventName.length > 50) {
                    throw new Meteor.Error("event-name-length");
                }
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
                        events[eventIndex].end = eventEnd || (allDay ? moment(eventStart).add(1, "day").toDate() : moment(eventStart).add(1, "hour").toDate());
                        events[eventIndex].allDay = allDay;
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
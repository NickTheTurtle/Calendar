/* globals moment CalEvents */
Meteor.startup(() => {
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
                if (eventStart !== moment(eventStart).toISOString()) {
                    throw new Meteor.Error("expected-ISO-string");
                }
                if (moment(eventStart).isBefore([1500, 0, 1]) || moment(eventStart).isAfter([2500, 11, 31])) {
                    throw new Meteor.Error("date-out-of-range");
                }
                if (this.userId) {
                    if (CalEvents.find({
                            owner: this.userId
                        }).count() <= 100) {
                        return CalEvents.insert({
                            title: "New Event",
                            owner: this.userId,
                            start: moment(eventStart).toISOString(),
                            end: allDay ? moment(eventStart).add(1, "day").toISOString() : moment(eventStart).toISOString(),
                            allDay: allDay
                        });
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
                if (eventStart !== moment(eventStart).toISOString()) {
                    throw new Meteor.Error("expected-ISO-string");
                }
                if (eventEnd && eventEnd !== moment(eventEnd).toISOString()) {
                    throw new Meteor.Error("expected-ISO-string");
                }
                if (eventEnd && moment(eventStart).isBefore([1500, 0, 1]) || moment(eventStart).isAfter([2500, 11, 31])) {
                    throw new Meteor.Error("date-out-of-range");
                }
                if (eventEnd && moment(eventEnd).isBefore([1500, 0, 1]) || moment(eventEnd).isAfter([2500, 11, 31])) {
                    throw new Meteor.Error("date-out-of-range");
                }
                if (eventEnd && moment(eventStart).isAfter(eventEnd)) {
                    throw new Meteor.Error("start-date-after-end");
                }
                if (repeat) {
                    check(repeat.type, Match.Integer);
                    check(repeat.skip, Match.Integer);
                    check(repeat.skip, Match.Where((a) => a >= 0));
                    if (repeat.start !== moment(repeat.start).toISOString()) {
                        throw new Meteor.Error("expected-ISO-string");
                    }
                    if (repeat.end !== moment(repeat.end).toISOString()) {
                        throw new Meteor.Error("expected-ISO-string");
                    }
                    if (moment(repeat.start).isBefore([1500, 0, 1]) || moment(repeat.start).isAfter([2500, 11, 31])) {
                        throw new Meteor.Error("date-out-of-range");
                    }
                    if (moment(repeat.end).isBefore([1500, 0, 1]) || moment(repeat.end).isAfter([2500, 11, 31])) {
                        throw new Meteor.Error("date-out-of-range");
                    }
                    if (moment(repeat.start).isAfter(repeat.end)) {
                        throw new Meteor.Error("repeat-start-date-after-end");
                    }
                    if (repeat.type === 0) { //daily
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: moment(repeat.start).toISOString(),
                            end: moment(repeat.end).toISOString()
                        };
                    }
                    else if (repeat.type === 1) { //weekly
                        check(repeat.weekDays, [Match.Integer]);
                        if (repeat.weekDays.length < 1 || repeat.weekDays.length > 7) {
                            throw new Meteor.Error("day-of-week-length");
                        }
                        repeat.weekDays.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        repeat.weekDays.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: moment(repeat.start).toISOString(),
                            end: moment(repeat.end).toISOString(),
                            weekDays: repeat.weekDays
                        };
                    }
                    else if (repeat.type === 2) { //same day each month
                        check(repeat.date, Match.Integer);
                        if (repeat.date < 1 || repeat.date > 31) {
                            throw new Meteor.Error("day-of-month-out-of-range");
                        }
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: moment(repeat.start).toISOString(),
                            end: moment(repeat.end).toISOString(),
                            date: repeat.date
                        };
                    }
                    else if (repeat.type === 3) { //same week each month
                        check(repeat.weekNumber, Match.Integer);
                        if (repeat.weekNumber < 1 || repeat.weekNumber > 5) {
                            throw new Meteor.Error("number-of-week-out-of-range");
                        }
                        check(repeat.weekDays, [Match.Integer]);
                        if (repeat.weekDays.length < 1 || repeat.weekDays.length > 7) {
                            throw new Meteor.Error("day-of-week-range");
                        }
                        repeat.weekDays.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: moment(repeat.start).toISOString(),
                            end: moment(repeat.end).toISOString(),
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
                            start: moment(repeat.start).toISOString(),
                            end: moment(repeat.end).toISOString(),
                            month: repeat.month,
                            date: repeat.date
                        };
                    }
                    else if (repeat.type === 5) { //same week each year
                        check(repeat.weekNumber, Match.Integer);
                        if (repeat.weekNumber < 1 || repeat.weekNumber > 5) {
                            throw new Meteor.Error("number-of-week-out-of-range");
                        }
                        check(repeat.weekDays, [Match.Integer]);
                        if (repeat.weekDays.length < 1 || repeat.weekDays.length > 7) {
                            throw new Meteor.Error("day-of-week-length");
                        }
                        repeat.weekDays.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        check(repeat.month, Match.Integer);
                        if (repeat.month < 1 && repeat.month > 12) {
                            throw new Meteor.Error("month-out-of-range");
                        }
                        repeat = {
                            type: repeat.type,
                            skip: repeat.skip,
                            start: moment(repeat.start).toISOString(),
                            end: moment(repeat.end).toISOString(),
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
                if (this.userId && CalEvents.findOne({
                        _id: eventId
                    }) && CalEvents.findOne({
                        _id: eventId
                    }).owner === this.userId) {
                    CalEvents.update({
                        _id: eventId
                    }, {
                        $set: {
                            title: eventName,
                            start: moment(eventStart).toISOString(),
                            end: eventEnd ? moment(eventEnd).toISOString() : (allDay ? moment(eventStart).add(1, "day").toISOString() : moment(eventStart).toISOString()),
                            allDay: allDay,
                            repeat: repeat
                        }
                    });
                }
                else {
                    throw new Meteor.Error("not-logged-in");
                }
            },
            deleteEvent(eventId) {
                check(eventId, String);
                if (this.userId && CalEvents.findOne({
                        _id: eventId
                    }) && CalEvents.findOne({
                        _id: eventId
                    }).owner === this.userId) {
                    CalEvents.remove({
                        _id: eventId
                    });
                }
                else {
                    throw new Meteor.Error("event-not-found");
                }
            }
    });
    Meteor.publish(null, function() {
        return [Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                services: 0
            }
        }), CalEvents.find({
            owner: this.userId
        })];
    });
});
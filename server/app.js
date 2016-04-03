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
                            o: this.userId
                        }).count() <= 500) {
                        return CalEvents.insert({
                            t: "New Event",
                            o: this.userId,
                            s: moment(eventStart).toISOString(),
                            e: allDay ? moment(eventStart).add(1, "day").toISOString() : moment(eventStart).toISOString(),
                            a: allDay
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
                    check(repeat.t, Match.Integer);
                    check(repeat.k, Number);
                    if (repeat.k < 0) {
                        throw new Meteor.Error("skip-less-than-zero");
                    }
                    if (repeat.s !== moment(repeat.s).toISOString()) {
                        throw new Meteor.Error("expected-ISO-string");
                    }
                    if (repeat.e !== moment(repeat.e).toISOString()) {
                        throw new Meteor.Error("expected-ISO-string");
                    }
                    if (moment(repeat.s).isBefore([1500, 0, 1]) || moment(repeat.s).isAfter([2500, 11, 31])) {
                        throw new Meteor.Error("date-out-of-range");
                    }
                    if (moment(repeat.e).isBefore([1500, 0, 1]) || moment(repeat.e).isAfter([2500, 11, 31])) {
                        throw new Meteor.Error("date-out-of-range");
                    }
                    if (moment(repeat.s).isAfter(repeat.e)) {
                        throw new Meteor.Error("repeat-start-date-after-end");
                    }
                    if (repeat.t === 0) { //daily
                        repeat = {
                            t: repeat.t,
                            k: parseInt(repeat.k, 10),
                            s: moment(repeat.s).toISOString(),
                            e: moment(repeat.e).toISOString()
                        };
                    }
                    else if (repeat.t === 1) { //weekly
                        check(repeat.w, [Match.Integer]);
                        if (repeat.w.length < 1 || repeat.w.length > 7) {
                            throw new Meteor.Error("day-of-week-length");
                        }
                        repeat.w.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        repeat = {
                            t: repeat.t,
                            k: parseInt(repeat.k, 10),
                            s: moment(repeat.s).toISOString(),
                            e: moment(repeat.e).toISOString(),
                            w: repeat.w
                        };
                    }
                    else if (repeat.t === 2) { //same day each month
                        check(repeat.d, Match.Integer);
                        if (repeat.d < 1 || repeat.d > 31) {
                            throw new Meteor.Error("day-of-month-out-of-range");
                        }
                        repeat = {
                            t: repeat.t,
                            k: parseInt(repeat.k, 10),
                            s: moment(repeat.s).toISOString(),
                            e: moment(repeat.e).toISOString(),
                            d: repeat.d
                        };
                    }
                    else if (repeat.t === 3) { //same week each month
                        check(repeat.n, Match.Integer);
                        if (repeat.n < 1 || repeat.n > 5) {
                            throw new Meteor.Error("number-of-week-out-of-range");
                        }
                        check(repeat.w, [Match.Integer]);
                        if (repeat.w.length < 1 || repeat.w.length > 7) {
                            throw new Meteor.Error("day-of-week-range");
                        }
                        repeat.w.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        repeat = {
                            t: repeat.t,
                            k: parseInt(repeat.k, 10),
                            s: moment(repeat.s).toISOString(),
                            e: moment(repeat.e).toISOString(),
                            w: repeat.w,
                            n: repeat.n
                        };
                    }
                    else if (repeat.t === 4) { //same day each year
                        check(repeat.m, Match.Integer);
                        if (repeat.m < 1 && repeat.m > 12) {
                            throw new Meteor.Error("month-out-of-range");
                        }
                        check(repeat.d, Match.Integer);
                        if (repeat.d < 1 && repeat.m > 31) {
                            throw new Meteor.Error("day-of-month-out-of-range");
                        }
                        repeat = {
                            t: repeat.t,
                            k: parseInt(repeat.k, 10),
                            s: moment(repeat.s).toISOString(),
                            e: moment(repeat.e).toISOString(),
                            m: repeat.m,
                            d: repeat.d
                        };
                    }
                    else if (repeat.t === 5) { //same week each year
                        check(repeat.n, Match.Integer);
                        if (repeat.n < 1 || repeat.n > 5) {
                            throw new Meteor.Error("number-of-week-out-of-range");
                        }
                        check(repeat.w, [Match.Integer]);
                        if (repeat.w.length < 1 || repeat.w.length > 7) {
                            throw new Meteor.Error("day-of-week-length");
                        }
                        repeat.w.forEach((a) => {
                            if (a < 0 || a > 6) {
                                throw new Meteor.Error("day-of-week-out-of-range");
                            }
                        });
                        check(repeat.m, Match.Integer);
                        if (repeat.m < 1 && repeat.m > 12) {
                            throw new Meteor.Error("month-out-of-range");
                        }
                        repeat = {
                            t: repeat.t,
                            k: parseInt(repeat.k, 10),
                            s: moment(repeat.s).toISOString(),
                            e: moment(repeat.e).toISOString(),
                            w: repeat.w,
                            n: repeat.n,
                            m: repeat.m
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
                    }).o === this.userId) {
                    CalEvents.update({
                        _id: eventId
                    }, {
                        $set: {
                            t: eventName,
                            s: moment(eventStart).toISOString(),
                            e: eventEnd ? moment(eventEnd).toISOString() : (allDay ? moment(eventStart).add(1, "day").toISOString() : moment(eventStart).toISOString()),
                            a: allDay,
                            r: repeat
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
                    }).o === this.userId) {
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
            o: this.userId
        })];
    });
    Accounts.config({
        loginExpirationInDays: null
    });
});
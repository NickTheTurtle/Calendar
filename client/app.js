/* global moment bootbox $ Deps Router CalEvents */
Meteor.startup(() => {
    let startDate;
    let startTime;
    let endDate;
    let endTime;
    let repeatStart;
    let repeatEnd;
    let calendar;
    let loadEvents = (newEvents) => {
        let events = [];
        if (newEvents !== 0) {
            newEvents.forEach((a) => {
                if (a.r) {
                    var currentLength = events.length;
                    if (a.r.t === 0) {
                        for (let i = moment(a.r.s); i.isBefore(moment(a.r.e)) || i.isSame(moment(a.r.e)); i.add(a.r.k + 1, "days")) {
                            if (a.a) {
                                events.push({
                                    _id: a._id,
                                    title: a.t + " (Repeat)",
                                    start: moment(i).toISOString(),
                                    end: moment(i).add(moment(a.e).diff(moment(a.s))).toISOString(),
                                    allDay: true,
                                    repeat: a.r.t
                                });
                            }
                            else {
                                events.push({
                                    _id: a._id,
                                    title: a.t + " (Repeat)",
                                    start: moment(i).utc().hours(moment(a.s).utc().hours()).minutes(moment(a.s).utc().minutes()).toISOString(),
                                    end: moment(i).utc().hours(moment(a.e).utc().hours()).minutes(moment(a.e).utc().minutes()).toISOString(),
                                    allDay: false,
                                    repeat: a.r.t
                                });
                            }
                        }
                    }
                    else if (a.r.t === 1) {
                        for (let i = moment(a.r.s); i.isBefore(moment(a.r.e)) || i.isSame(moment(a.r.e)); i.add(a.r.k + 1, "weeks")) {
                            for (let j of a.r.w) {
                                let t = moment(i).day() <= j ? j : j + 7;
                                if ((moment(i).day(t).isBefore(moment(a.r.e)) || moment(i).day(t).isSame(moment(a.r.e)))) {
                                    if (a.a) {
                                        events.push({
                                            _id: a._id,
                                            title: a.t + " (Repeat)",
                                            start: moment(i).day(t).toISOString(),
                                            end: moment(i).day(t).add(moment(a.e).diff(moment(a.s))).toISOString(),
                                            allDay: true,
                                            repeat: a.r.t
                                        });
                                    }
                                    else {
                                        events.push({
                                            _id: a._id,
                                            title: a.t + " (Repeat)",
                                            start: moment(i).day(t).utc().hours(moment(a.s).utc().hours()).minutes(moment(a.s).utc().minutes()).toISOString(),
                                            end: moment(i).day(t).utc().hours(moment(a.e).utc().hours()).minutes(moment(a.e).utc().minutes()).toISOString(),
                                            allDay: false,
                                            repeat: a.r.t
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else if (a.r.t === 2) {
                        for (let i = moment(a.r.s); i.isBefore(moment(a.r.e)) || i.isSame(moment(a.r.e)); i.add(a.r.k + 1, "months")) {
                            let t = moment(i).date() <= a.r.d ? (a.r.d <= moment(i).daysInMonth() ? a.r.d : moment(i).daysInMonth()) : a.r.d + moment(i).daysInMonth();
                            if ((moment(i).date(t).isBefore(moment(a.r.e)) || moment(i).date(t).isSame(moment(a.r.e)))) {
                                if (a.a) {
                                    events.push({
                                        _id: a._id,
                                        title: a.t + " (Repeat)",
                                        start: moment(i).date(t).toISOString(),
                                        end: moment(i).date(t).add(moment(a.e).diff(moment(a.s))).toISOString(),
                                        allDay: true,
                                        repeat: a.r.t
                                    });
                                }
                                else {
                                    events.push({
                                        _id: a._id,
                                        title: a.t + " (Repeat)",
                                        start: moment(i).date(t).utc().hours(moment(a.s).utc().hours()).minutes(moment(a.s).utc().minutes()).toISOString(),
                                        end: moment(i).date(t).utc().hours(moment(a.e).utc().hours()).minutes(moment(a.e).utc().minutes()).toISOString(),
                                        allDay: false,
                                        repeat: a.r.t
                                    });
                                }
                            }
                        }
                    }
                    else if (a.r.t === 3) {
                        for (let i = moment(a.r.s); i.isBefore(moment(a.r.e)) || i.isSame(moment(a.r.e)); i.add(a.r.k + 1, "months")) {
                            let weeksInMonth = [
                                [],
                                [],
                                [],
                                [],
                                [],
                                [],
                                []
                            ];
                            for (let j = 1; j <= moment(i).daysInMonth(); j++) {
                                weeksInMonth[moment(i).date(j).day()].push(j);
                            }
                            for (let j of a.r.w) {
                                let t = a.r.n === 5 ? weeksInMonth[j][weeksInMonth[j].length - 1] : weeksInMonth[j][a.r.n - 1];
                                if ((moment(i).date(t).isBefore(moment(a.r.e)) || moment(i).date(t).isSame(moment(a.r.e)))) {
                                    if (a.a) {
                                        events.push({
                                            _id: a._id,
                                            title: a.t + " (Repeat)",
                                            start: moment(i).date(t).toISOString(),
                                            end: moment(i).date(t).add(moment(a.e).diff(moment(a.s))).toISOString(),
                                            allDay: true,
                                            repeat: a.r.t
                                        });
                                    }
                                    else {
                                        events.push({
                                            _id: a._id,
                                            title: a.t + " (Repeat)",
                                            start: moment(i).date(t).utc().hours(moment(a.s).utc().hours()).minutes(moment(a.s).utc().minutes()).toISOString(),
                                            end: moment(i).date(t).utc().hours(moment(a.e).utc().hours()).minutes(moment(a.e).utc().minutes()).toISOString(),
                                            allDay: false,
                                            repeat: a.r.t
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else if (a.r.t === 4) {
                        for (let i = moment(a.r.s); i.isBefore(moment(a.r.e)) || i.isSame(moment(a.r.e)); i.add(a.r.k + 1, "years")) {
                            let t = moment(i).month(a.r.m - 1).date(a.r.d <= moment(i).month(a.r.m - 1).daysInMonth() ? a.r.d : moment(i).month(a.r.m - 1).daysInMonth());
                            if (moment(t).isBefore(moment(a.r.e)) || moment(t).isSame(moment(a.r.e))) {
                                if (a.a) {
                                    events.push({
                                        _id: a._id,
                                        title: a.t + " (Repeat)",
                                        start: moment(t).toISOString(),
                                        end: moment(t).add(moment(a.e).diff(moment(a.s))).subtract(1, "day").toISOString(),
                                        allDay: true,
                                        repeat: a.r.t
                                    });
                                }
                                else {
                                    events.push({
                                        _id: a._id,
                                        title: a.t + " (Repeat)",
                                        start: moment(t).utc().hours(moment(a.s).utc().hours()).minutes(moment(a.s).utc().minutes()).toISOString(),
                                        end: moment(t).utc().hours(moment(a.e).utc().hours()).minutes(moment(a.e).utc().minutes()).toISOString(),
                                        allDay: false,
                                        repeat: a.r.t
                                    });
                                }
                            }
                        }
                    }
                    else if (a.r.t === 5) {
                        for (let i = moment(a.r.s); i.isBefore(moment(a.r.e)) || i.isSame(moment(a.r.e)); i.add(a.r.k + 1, "years")) {
                            let weeksInMonth = [
                                [],
                                [],
                                [],
                                [],
                                [],
                                [],
                                []
                            ];
                            for (let j = 1; j <= moment(i).month(a.r.m - 1).daysInMonth(); j++) {
                                weeksInMonth[moment(i).month(a.r.m - 1).date(j).day()].push(j);
                            }
                            for (let j of a.r.w) {
                                let t = a.r.n === 5 ? weeksInMonth[j][weeksInMonth[j].length - 1] : weeksInMonth[j][a.r.n - 1];
                                if ((moment(i).month(a.r.m - 1).date(t).isBefore(moment(a.r.e)) || moment(i).month(a.r.m - 1).date(t).isSame(moment(a.r.e)))) {
                                    if (a.a) {
                                        events.push({
                                            _id: a._id,
                                            title: a.t + " (Repeat)",
                                            start: moment(i).month(a.r.m - 1).date(t).toISOString(),
                                            end: moment(i).month(a.r.m - 1).date(t).add(moment(a.e).diff(moment(a.s))).toISOString(),
                                            allDay: true,
                                            repeat: a.r.t
                                        });
                                    }
                                    else {
                                        events.push({
                                            _id: a._id,
                                            title: a.t + " (Repeat)",
                                            start: moment(i).month(a.r.m - 1).date(t).utc().hours(moment(a.s).utc().hours()).minutes(moment(a.s).utc().minutes()).toISOString(),
                                            end: moment(i).month(a.r.m - 1).date(t).utc().hours(moment(a.e).utc().hours()).minutes(moment(a.e).utc().minutes()).toISOString(),
                                            allDay: false,
                                            repeat: a.r.t
                                        });
                                    }
                                }
                            }
                        }
                    }
                    if (events.length === currentLength) {
                        Meteor.call("deleteEvent", a._id, function() {});
                    }
                }
                else {
                    events.push({
                        _id: a._id,
                        title: a.t,
                        start: a.s,
                        end: a.e,
                        allDay: a.a
                    });
                }
            });
        }
        return events;
    };
    let showModal = (modal, state) => {
        $("#" + modal).modal(state);
        let event = CalEvents.find().fetch().find((a) => Session.equals("selectedEvent", a._id)) || {
            t: "",
            s: "",
            e: "",
            a: "",
            r: false
        };
        $("#eventName").val(event.t);
        $("#repeatType").val(0);
        if (event.a) {
            $("#startDate").prop("disabled", false);
            $("#endDate").prop("disabled", false);
            $("#startTime").prop("disabled", true);
            $("#endTime").prop("disabled", true);
            $("#allDay").prop("checked", true);
            startDate.data("DateTimePicker").date(moment(event.s).utc());
            endDate.data("DateTimePicker").date(moment(event.e).subtract(1, "day").utc());
            startTime.data("DateTimePicker").date(null);
            endTime.data("DateTimePicker").date(null);
        }
        else {
            $("#startDate").prop("disabled", false);
            $("#endDate").prop("disabled", true);
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#allDay").prop("checked", false);
            startDate.data("DateTimePicker").date(moment(event.s).utc());
            endDate.data("DateTimePicker").date(moment(event.s).utc());
            startTime.data("DateTimePicker").date(moment(event.s).utc());
            endTime.data("DateTimePicker").date(moment(event.e).utc());
        }
        if (event.r) {
            $("#repeatType").prop("disabled", false);
            $("#repeatStart").prop("disabled", false);
            $("#repeatEnd").prop("disabled", false);
            $("#repeatSkip").prop("disabled", false);
            $("#repeatWeekNumber").prop("disabled", false);
            $("#repeatWeekDay").prop("disabled", false);
            $("#repeatMonth").prop("disabled", false);
            $("#repeatDate").prop("disabled", false);
            $("#repeatType").val(event.r.t);
            $("#repeat").prop("checked", true);
            repeatStart.data("DateTimePicker").date(moment(event.r.s).utc());
            repeatEnd.data("DateTimePicker").date(moment(event.r.e).utc());
            $("#repeatSkip").val(event.r.k);
            $("#repeatWeekNumber").val(event.r.n || 1);
            $("#repeatWeekDay").val(event.r.w || []);
            $("#repeatMonth").val(event.r.m || 1);
            $("#repeatDate").val(event.r.d || 1);
        }
        else {
            $("#repeatType").prop("disabled", true);
            $("#repeatStart").prop("disabled", true);
            $("#repeatEnd").prop("disabled", true);
            $("#repeatSkip").prop("disabled", true);
            $("#repeatWeekNumber").prop("disabled", true);
            $("#repeatWeekDay").prop("disabled", true);
            $("#repeatMonth").prop("disabled", true);
            $("#repeatDate").prop("disabled", true);
            $("#repeatType").val(0);
            $("#repeat").prop("checked", false);
            repeatStart.data("DateTimePicker").date(moment(event.s).utc().stripTime());
            repeatEnd.data("DateTimePicker").date(moment(event.s).utc().stripTime());
            $("#repeatSkip").val(0);
            $("#repeatWeekNumber").val(1);
            $("#repeatWeekDay").val(0);
            $("#repeatMonth").val(1);
            $("#repeatDate").val(1);
        }
    };
    Session.set("selectedDate", false);
    Session.set("repeatType", -1);
    Session.set("allEvents", []);
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL",
        forceEmailLowercase: true,
        forceUsernameLowercase: true
    });
    Accounts.onLogin(() => {
        Session.set("allEvents", loadEvents(CalEvents.find().fetch()));
    });
    CalEvents.find().observe({
        added(doc) {
                Session.set("allEvents", Session.get("allEvents").concat(loadEvents([doc])));
            },
            changed(doc) {
                let events = Session.get("allEvents");
                events = events.filter((a) => {
                    return a._id !== doc._id;
                });
                Session.set("allEvents", events.concat(loadEvents([doc])));
            },
            removed(doc) {
                Session.set("allEvents", Session.get("allEvents").filter((a) => {
                    return a._id !== doc._id;
                }));
            }
    });
    Template.main.onRendered(() => {
        startDate = $("#startDate").datetimepicker({
            format: "LL",
            minDate: moment([1500, 0, 1]),
            maxDate: moment([2500, 11, 31])
        });
        startTime = $("#startTime").datetimepicker({
            format: "LT",
            minDate: moment([1500, 0, 1]),
            maxDate: moment([2500, 11, 31])
        });
        endDate = $("#endDate").datetimepicker({
            format: "LL",
            minDate: moment([1500, 0, 1]),
            maxDate: moment([2500, 11, 31])
        });
        endTime = $("#endTime").datetimepicker({
            format: "LT",
            minDate: moment([1500, 0, 1]),
            maxDate: moment([2500, 11, 31])
        });
        repeatStart = $("#repeatStart").datetimepicker({
            format: "LL",
            minDate: moment([1500, 0, 1]),
            maxDate: moment([2500, 11, 31])
        });
        repeatEnd = $("#repeatEnd").datetimepicker({
            format: "LL",
            minDate: moment([1500, 0, 1]),
            maxDate: moment([2500, 11, 31])
        });
    });
    Template.calendar.onRendered(() => {
        calendar = $("#calendar").fullCalendar({
            dayClick(date) {
                    let wait = bootbox.dialog({
                        message: "Please wait while a new event is being added.",
                        title: "Adding Event"
                    });
                    Meteor.call("addEvent", moment(date).toISOString(), !date.hasTime(), (error, result) => {
                        wait.modal("hide");
                        if (error) {
                            console.log(error.error);
                            if (error.error === "event-amount-exceeded") {
                                bootbox.alert({
                                    title: "Error",
                                    message: "Your total amount of events has exceeded 500. To continue to add more events, please delete some events."
                                });
                            }
                            else if (error.error === "not-logged-in") {
                                bootbox.alert({
                                    title: "Error",
                                    message: "You are not logged in."
                                });
                            }
                            else if (error.error === "date-out-of-range") {
                                bootbox.alert({
                                    title: "Error",
                                    message: "Either the start or end date is out of range. Please make sure that both dates are between 1500 and 2500."
                                });
                            }
                            else {
                                bootbox.alert({
                                    title: "Error",
                                    message: `An error occurred. Please try again later.
                                    Error string: <code>${error.error}</code>.`
                                });
                            }
                        }
                    });
                },
                eventClick(event) {
                    event = CalEvents.findOne({
                        _id: event._id
                    });
                    if (event) {
                        Session.set("selectedEvent", event._id);
                        Session.set("repeatType", event.r ? event.r.t : 0);
                        showModal("editEvent", "show");
                    }
                },
                eventDrop(event, delta, revert, jsEvent) {
                    let wait = bootbox.dialog({
                        message: "Please wait while the event is being moved to a new time.",
                        title: "Moving Event"
                    });
                    if (CalEvents.findOne({
                            _id: event._id
                        }).r) {
                        wait.modal("hide");
                        bootbox.alert({
                            title: "Error",
                            message: "Dragging repeated events are currently not supported."
                        });
                        revert();
                    }
                    else {
                        if (jsEvent.ctrlKey || jsEvent.metaKey) {
                            Meteor.call("addEvent", moment(event.start).toISOString(), !(!event.start.hasTime()), (error, result) => {
                                if (error) {
                                    console.log(error.error);
                                }
                                if (!error) {
                                    Meteor.call("dropEvent", result, event.title, moment(event.start).toISOString(), event.end ? moment(event.end).toISOString() : null, !event.start.hasTime(), (error, result) => {
                                        wait.modal("hide");
                                        if (error) {
                                            console.log(error.error);
                                            bootbox.alert({
                                                title: "Error",
                                                message: `An error occurred. Please try again later.
                                    Error string: <code>${error.error}</code>.`
                                            });
                                            revert();
                                        }
                                    });
                                }
                                else if (error.error === "event-amount-exceeded") {
                                    bootbox.alert({
                                        title: "Error",
                                        message: "Your total amount of events has exceeded 500. To continue to add more events, please delete some events."
                                    });
                                }
                                else if (error.error === "not-logged-in") {
                                    bootbox.alert({
                                        title: "Error",
                                        message: "You are not logged in."
                                    });
                                }
                                else if (error.error === "date-out-of-range") {
                                    bootbox.alert({
                                        title: "Error",
                                        message: "Either the start or end date is out of range. Please make sure that both dates are between 1500 and 2500."
                                    });
                                }
                                else {
                                    bootbox.alert({
                                        title: "Error",
                                        message: `An error occurred. Please try again later.
                                    Error string: <code>${error.error}</code>.`
                                    });
                                }
                            });
                        }
                        else {
                            Meteor.call("dropEvent", event._id, event.title, moment(event.start).toISOString(), event.end ? moment(event.end).toISOString() : null, !event.start.hasTime(), CalEvents.findOne({
                                _id: event._id
                            }).r, (error, result) => {
                                wait.modal("hide");
                                if (error) {
                                    console.log(error.error);
                                    bootbox.alert({
                                        title: "Error",
                                        message: `An error occurred. Please try again later.
                                    Error string: <code>${error.error}</code>.`
                                    });
                                    revert();
                                }
                            });
                        }
                    }
                },
                eventResize(event, delta, revert) {
                    let wait = bootbox.dialog({
                        message: "Please wait while the event is being resized.",
                        title: "Resizing Event"
                    });
                    Meteor.call("dropEvent", event._id, CalEvents.findOne({
                        _id: event._id
                    }).t, moment(event.start).toISOString(), event.end ? moment(event.end).toISOString() : null, !event.start.hasTime(), CalEvents.findOne({
                        _id: event._id
                    }).r, (error, result) => {
                        wait.modal("hide");
                        if (error) {
                            console.log(error.error);
                            bootbox.alert({
                                title: "Error",
                                message: `An error occurred. Please try again later.
                                    Error string: <code>${error.error}</code>.`
                            });
                            revert();
                        }
                    });
                },
                header: {
                    left: "today prevYear,prev next,nextYear",
                    center: "title",
                    right: "month,agendaWeek,agendaDay"
                },
                events(start, end, timezone, callback) {
                    if (Meteor.user() && CalEvents.find().count() !== 0) {
                        callback(Session.get("allEvents").filter((a) => (moment(a.start).isBefore(end) && moment(a.start).isAfter(start) || moment(a.start).isSame(start) || moment(a.start).isSame(end)) || (moment(a.end).isBefore(end) && moment(a.end).isAfter(start) || moment(a.end).isSame(start) || moment(a.end).isSame(end))));
                    }
                    else {
                        callback([]);
                    }
                },
                eventLimit: 5,
                selectable: true,
                editable: true,
                nowIndicator: true
        }).data().fullCalendar;
        Deps.autorun(() => {
            Session.get("allEvents");
            calendar.refetchEvents();
        });
    });
    Template.main.helpers({
        active(tab) {
                return Router.current().route.getName() === tab ? "active" : "";
            },
            repeatSkip() {
                switch (Session.get("repeatType")) {
                    case 0:
                        return "Days";
                    case 1:
                        return "Weeks";
                    case 2:
                    case 3:
                        return "Months";
                    case 4:
                    case 5:
                        return "Years";
                    default:
                        return "Days";
                }
            },
            repeatWeekNumber() {
                return Session.equals("repeatType", 3) || Session.equals("repeatType", 5) ? "block" : "none";
            },
            repeatWeekDay() {
                return Session.equals("repeatType", 1) || Session.equals("repeatType", 3) || Session.equals("repeatType", 5) ? "block" : "none";
            },
            repeatMonth() {
                return Session.equals("repeatType", 4) || Session.equals("repeatType", 5) ? "block" : "none";
            },
            repeatDate() {
                return Session.equals("repeatType", 2) || Session.equals("repeatType", 4) ? "block" : "none";
            }
    });
    Template.list.helpers({
        disabledPrevious() {
                return Router.current().params.p === "1" ? "disabled" : "";
            },
            pages() {
                let pages = [];
                for (let i = 1; i <= Math.ceil(Session.get("allEvents").length / 15); i++) {
                    pages.push({
                        num: i
                    });
                }
                return pages;
            },
            active(num) {
                return num === parseInt(Router.current().params.p, 10) ? "active" : "";
            },
            disabledNext() {
                return parseInt(Router.current().params.p, 10) * 15 >= Session.get("allEvents").length ? "disabled" : "";
            },
            events() {
                return Session.get("allEvents").sort((a, b) => new Date(a.start) - new Date(b.start) || a.title.toLowerCase().charCodeAt() - b.title.toLowerCase().charCodeAt()).slice(parseInt(Router.current().params.p, 10) * 15 - 15, parseInt(Router.current().params.p, 10) * 15).map((a) => {
                    a.id = a._id;
                    delete a._id;
                    if (a.a) {
                        a.start = moment(a.start).utc().format("LL");
                        a.end = moment(a.end).subtract(1, "day").utc().format("LL");
                    }
                    else {
                        a.start = moment(a.start).utc().format("LLL");
                        a.end = moment(a.end).utc().format("LLL");
                    }
                    return a;
                });
            }
    });
    Template.main.events({
        "click #deleteEvent" () {
            bootbox.confirm({
                title: "Delete Event",
                message: "Are you sure you want to delete this event? For repeated events, all occurrences will be deleted. This action cannot be undone.",
                callback(result) {
                    if (result) {
                        let wait = bootbox.dialog({
                            message: "Please wait while the event is being deleted.",
                            title: "Deleting Event"
                        });
                        Meteor.call("deleteEvent", Session.get("selectedEvent"), (error) => {
                            wait.modal("hide");
                            if (error) {
                                console.log(error.error);
                                bootbox.alert({
                                    title: "Error",
                                    message: `An error occurred. Please try again later.
                                    Error string: <code>${error.error}</code>.`
                                });
                            }
                        });
                    }
                }
            });
        },
        "click #updateEvent" () {
            let wait = bootbox.dialog({
                message: "Please wait while the event is being updated.",
                title: "Updating Event"
            });
            let repeat = false;
            if ($("#repeat").prop("checked")) {
                repeat = {
                    t: parseFloat($("#repeatType").val()),
                    s: moment(repeatStart.data("DateTimePicker").date().stripTime()).toISOString(),
                    e: moment(repeatEnd.data("DateTimePicker").date().stripTime()).toISOString(),
                    k: parseFloat($("#repeatSkip").val())
                };
                switch (parseFloat($("#repeatType").val())) {
                    case 0:
                        break;
                    case 1:
                        repeat.w = $("#repeatWeekDay").val() ? $("#repeatWeekDay").val().map((a) => parseFloat(a)) : [];
                        break;
                    case 2:
                        repeat.d = parseFloat($("#repeatDate").val());
                        break;
                    case 3:
                        repeat.w = $("#repeatWeekDay").val() ? $("#repeatWeekDay").val().map((a) => parseFloat(a)) : [];
                        repeat.n = parseFloat($("#repeatWeekNumber").val());
                        break;
                    case 4:
                        repeat.m = parseFloat($("#repeatMonth").val());
                        repeat.d = parseFloat($("#repeatDate").val());
                        break;
                    case 5:
                        repeat.w = $("#repeatWeekDay").val() ? $("#repeatWeekDay").val().map((a) => parseFloat(a)) : [];
                        repeat.n = parseFloat($("#repeatWeekNumber").val());
                        repeat.m = parseFloat($("#repeatMonth").val());
                        break;
                }
            }
            if (loadEvents([{
                    _id: Meteor.uuid(),
                    s: $("#allDay").prop("checked") ? moment(startDate.data("DateTimePicker").date().stripTime()).toISOString() : moment(startDate.data("DateTimePicker").date().stripTime().add(startTime.data("DateTimePicker").date().hours(), "hours").add(startTime.data("DateTimePicker").date().minutes(), "minutes")).toISOString(),
                    e: $("#allDay").prop("checked") ? moment(endDate.data("DateTimePicker").date().add(1, "day").stripTime()).toISOString() : moment(startDate.data("DateTimePicker").date().stripTime().add(endTime.data("DateTimePicker").date().hours(), "hours").add(endTime.data("DateTimePicker").date().minutes(), "minutes")).toISOString(),
                    a: $("#allDay").prop("checked"),
                    r: repeat
                }]).length === 0) {
                bootbox.confirm({
                    title: "Warning",
                    message: "This event cannot be shown on the calendar. If you proceed, this event would be automatically deleted.",
                    callback(result) {
                        if (!result) {
                            wait.modal("hide");
                        }
                        else {
                            Meteor.call("dropEvent", Session.get("selectedEvent"), $("#eventName").val(), $("#allDay").prop("checked") ? moment(startDate.data("DateTimePicker").date().stripTime()).toISOString() : moment(startDate.data("DateTimePicker").date().stripTime().add(startTime.data("DateTimePicker").date().hours(), "hours").add(startTime.data("DateTimePicker").date().minutes(), "minutes")).toISOString(), $("#allDay").prop("checked") ? moment(endDate.data("DateTimePicker").date().add(1, "day").stripTime()).toISOString() : moment(startDate.data("DateTimePicker").date().stripTime().add(endTime.data("DateTimePicker").date().hours(), "hours").add(endTime.data("DateTimePicker").date().minutes(), "minutes")).toISOString(), $("#allDay").prop("checked"), repeat, (error) => {
                                wait.modal("hide");
                                if (error) {
                                    console.log(error.error);
                                    if (error.error === "event-name-length") {
                                        bootbox.alert({
                                            title: "Error",
                                            message: "The name given to the event is too long. Please make sure that it is under 50 characters."
                                        });
                                    }
                                    else if (error.error === "skip-less-than-zero") {
                                        bootbox.alert({
                                            title: "Error",
                                            message: "The number of time to skip for repeats is less than zero."
                                        });
                                    }
                                    else if (error.error === "day-of-week-length") {
                                        bootbox.alert({
                                            title: "Error",
                                            message: "Please select one or more days of the week."
                                        });
                                    }
                                    else if (error.error === "day-of-month-out-of-range") {
                                        bootbox.alert({
                                            title: "Error",
                                            message: "Please make sure that the date of month is between 1 and 31."
                                        });
                                    }
                                    else if (error.error === "start-date-after-end") {
                                        bootbox.alert({
                                            title: "Error",
                                            message: "Please make sure that the start date is not later than the end date."
                                        });
                                    }
                                    else if (error.error === "repeat-start-date-after-end") {
                                        bootbox.alert({
                                            title: "Error",
                                            message: "Please make sure that the repeat start date is not later than the end date."
                                        });
                                    }
                                    else {
                                        bootbox.alert({
                                            title: "Error",
                                            message: `An error occurred. Please try again later.
                                    Error string: <code>${error.error}</code>.`
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
            else {
                Meteor.call("dropEvent", Session.get("selectedEvent"), $("#eventName").val(), $("#allDay").prop("checked") ? moment(startDate.data("DateTimePicker").date().stripTime()).toISOString() : moment(startDate.data("DateTimePicker").date().stripTime().add(startTime.data("DateTimePicker").date().hours(), "hours").add(startTime.data("DateTimePicker").date().minutes(), "minutes")).toISOString(), $("#allDay").prop("checked") ? moment(endDate.data("DateTimePicker").date().add(1, "day").stripTime()).toISOString() : moment(startDate.data("DateTimePicker").date().stripTime().add(endTime.data("DateTimePicker").date().hours(), "hours").add(endTime.data("DateTimePicker").date().minutes(), "minutes")).toISOString(), $("#allDay").prop("checked"), repeat, (error) => {
                    wait.modal("hide");
                    if (error) {
                        console.log(error.error);
                        if (error.error === "event-name-length") {
                            bootbox.alert({
                                title: "Error",
                                message: "The name given to the event is too long. Please make sure that it is under 50 characters."
                            });
                        }
                        else if (error.error === "skip-less-than-zero") {
                            bootbox.alert({
                                title: "Error",
                                message: "The number of time to skip for repeats is less than zero."
                            });
                        }
                        else if (error.error === "day-of-week-length") {
                            bootbox.alert({
                                title: "Error",
                                message: "Please select one or more days of the week."
                            });
                        }
                        else if (error.error === "day-of-month-out-of-range") {
                            bootbox.alert({
                                title: "Error",
                                message: "Please make sure that the date of month is between 1 and 31."
                            });
                        }
                        else if (error.error === "start-date-after-end") {
                            bootbox.alert({
                                title: "Error",
                                message: "Please make sure that the start date is not later than the end date."
                            });
                        }
                        else if (error.error === "repeat-start-date-after-end") {
                            bootbox.alert({
                                title: "Error",
                                message: "Please make sure that the repeat start date is not later than the end date."
                            });
                        }
                        else {
                            bootbox.alert({
                                title: "Error",
                                message: `An error occurred. Please try again later.
                                    Error string: <code>${error.error}</code>.`
                            });
                        }
                    }
                });
            }
        },
        "change #allDay" () {
            let event = CalEvents.findOne({
                _id: Session.get("selectedEvent")
            }) || {
                t: "",
                s: "",
                e: "",
                a: ""
            };
            if ($("#allDay").prop("checked")) {
                $("#startDate").prop("disabled", false);
                $("#endDate").prop("disabled", false);
                $("#startTime").prop("disabled", true);
                $("#endTime").prop("disabled", true);
                startDate.data("DateTimePicker").date(moment(event.s).utc());
                endDate.data("DateTimePicker").date(moment(event.e).subtract(1, "day").utc());
                startTime.data("DateTimePicker").date(null);
                endTime.data("DateTimePicker").date(null);
            }
            else {
                $("#startDate").prop("disabled", false);
                $("#endDate").prop("disabled", true);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                startDate.data("DateTimePicker").date(moment(event.s).utc());
                endDate.data("DateTimePicker").date(moment(event.s).utc());
                startTime.data("DateTimePicker").date(moment(event.s).utc());
                endTime.data("DateTimePicker").date(moment(event.e).utc());
            }
        },
        "change #repeatType" () {
            Session.set("repeatType", parseFloat($("#repeatType").val()));
        },
        "change #repeat" () {
            let event = CalEvents.findOne({
                _id: Session.get("selectedEvent")
            }) || {
                t: "",
                s: "",
                e: "",
                a: "",
                r: false
            };
            if ($("#repeat").prop("checked")) {
                Session.set("repeatType", event.r ? event.r.t : 0);
                $("#repeatType").prop("disabled", false);
                $("#repeatStart").prop("disabled", false);
                $("#repeatEnd").prop("disabled", false);
                $("#repeatSkip").prop("disabled", false);
                $("#repeatWeekNumber").prop("disabled", false);
                $("#repeatWeekDay").prop("disabled", false);
                $("#repeatMonth").prop("disabled", false);
                $("#repeatDate").prop("disabled", false);
                $("#repeatType").val(event.r ? event.r.t : 0);
                repeatStart.data("DateTimePicker").date(event.r ? moment(event.r.s).utc() : moment(event.s).utc());
                repeatEnd.data("DateTimePicker").date(event.r ? moment(event.r.e).utc() : moment(event.s).utc());
                $("#repeatSkip").val(event.r ? event.r.k : 0);
                $("#repeatWeekNumber").val(event.r ? event.r.n : 1);
                $("#repeatWeekDay").val(event.r ? event.r.w : []);
                $("#repeatMonth").val(event.r ? event.r.m : 1);
                $("#repeatDate").val(event.r ? event.r.d : 1);
            }
            else {
                Session.set("repeatType", 0);
                $("#repeatType").prop("disabled", true);
                $("#repeatStart").prop("disabled", true);
                $("#repeatEnd").prop("disabled", true);
                $("#repeatSkip").prop("disabled", true);
                $("#repeatWeekNumber").prop("disabled", true);
                $("#repeatWeekDay").prop("disabled", true);
                $("#repeatMonth").prop("disabled", true);
                $("#repeatDate").prop("disabled", true);
                $("#repeatType").val(0);
                repeatStart.data("DateTimePicker").date(moment(event.s).utc().stripTime());
                repeatEnd.data("DateTimePicker").date(moment(event.s).utc().stripTime());
                $("#repeatSkip").val(0);
                $("#repeatWeekNumber").val(1);
                $("#repeatWeekDay").val(0);
                $("#repeatMonth").val(1);
                $("#repeatDate").val(1);
            }
        }
    });
    Template.list.events({
        "click #previousLink" (event) {
            event.preventDefault();
            if (Router.current().params.p !== "1") {
                Router.go("/list/" + (parseInt(Router.current().params.p, 10) - 1));
            }
        },
        "click #nextLink" (event) {
            event.preventDefault();
            if (parseInt(Router.current().params.p, 10) * 15 < Session.get("allEvents").length) {
                Router.go("/list/" + (parseInt(Router.current().params.p, 10) + 1));
            }
        },
        "click tr" () {
            let event = CalEvents.findOne({
                _id: this.id
            });
            if (event) {
                Session.set("selectedEvent", event._id);
                Session.set("repeatType", event.r ? event.r.t : 0);
                showModal("editEvent", "show");
            }
        }
    });
    Router.configure({
        layoutTemplate: "main"
    });
    Router.route("/", function() {
        this.redirect("/calendar");
    });
    Router.route("/calendar", function() {
        this.render("calendar");
    });
    Router.route("/list/:p", function() {
        this.render("list");
    });
});
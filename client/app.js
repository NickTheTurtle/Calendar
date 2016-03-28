/* global moment bootbox LZString Deps Router CalEvents */
Meteor.startup(() => {
    let startDate;
    let startTime;
    let endDate;
    let endTime;
    let repeatStart;
    let repeatEnd;
    let calendar;
    let loadEvents = () => {
        let events = [];
        if (Meteor.user() && CalEvents.find().count() !== 0) {
            CalEvents.find().forEach((a) => {
                if (a.repeat) {
                    if (a.repeat.type === 0) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "days")) {
                            if (a.allDay) {
                                events.push({
                                    _id: a._id,
                                    title: a.title + " (Repeat)",
                                    start: moment(i).toISOString(),
                                    end: moment(i).add(moment(a.end).diff(moment(a.start))).toISOString(),
                                    allDay: true,
                                    repeat: a.repeat.type
                                });
                            }
                            else {
                                events.push({
                                    _id: a._id,
                                    title: a.title + " (Repeat)",
                                    start: $.fullCalendar.moment(i).time(moment(a.start)).toISOString(),
                                    end: $.fullCalendar.moment(i).time(moment(a.end)).toISOString(),
                                    allDay: false,
                                    repeat: a.repeat.type
                                });
                            }
                        }
                    }
                    else if (a.repeat.type === 1) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "weeks")) {
                            for (let j of a.repeat.weekDays) {
                                let t = moment(i).day() <= j ? j : j + 7;
                                if ((moment(i).day(t).isBefore(moment(a.repeat.end)) || moment(i).day(t).isSame(moment(a.repeat.end)))) {
                                    if (a.allDay) {
                                        events.push({
                                            _id: a._id,
                                            title: a.title + " (Repeat)",
                                            start: moment(i).day(t).toISOString(),
                                            end: moment(i).day(t).add(moment(a.end).diff(moment(a.start))).toISOString(),
                                            allDay: true,
                                            repeat: a.repeat.type
                                        });
                                    }
                                    else {
                                        events.push({
                                            _id: a._id,
                                            title: a.title + " (Repeat)",
                                            start: $.fullCalendar.moment(i).day(t).time(moment(a.start)).toISOString(),
                                            end: $.fullCalendar.moment(i).day(t).time(moment(a.end)).toISOString(),
                                            allDay: false,
                                            repeat: a.repeat.type
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else if (a.repeat.type === 2) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "months")) {
                            let t = moment(i).date() <= a.repeat.date ? (a.repeat.date <= moment(i).daysInMonth() ? a.repeat.date : moment(i).daysInMonth()) : a.repeat.date + moment(i).daysInMonth();
                            if ((moment(i).date(t).isBefore(moment(a.repeat.end)) || moment(i).date(t).isSame(moment(a.repeat.end)))) {
                                if (a.allDay) {
                                    events.push({
                                        _id: a._id,
                                        title: a.title + " (Repeat)",
                                        start: moment(i).date(t).toISOString(),
                                        end: moment(i).date(t).add(moment(a.end).diff(moment(a.start))).toISOString(),
                                        allDay: true,
                                        repeat: a.repeat.type
                                    });
                                }
                                else {
                                    events.push({
                                        _id: a._id,
                                        title: a.title + " (Repeat)",
                                        start: $.fullCalendar.moment(i).date(t).time(moment(a.start)).toISOString(),
                                        end: $.fullCalendar.moment(i).date(t).time(moment(a.end)).toISOString(),
                                        allDay: false,
                                        repeat: a.repeat.type
                                    });
                                }
                            }
                        }
                    }
                    else if (a.repeat.type === 3) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "months")) {
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
                            for (let j of a.repeat.weekDays) {
                                let t = a.repeat.weekNumber === 5 ? weeksInMonth[j][weeksInMonth[j].length - 1] : weeksInMonth[j][a.repeat.weekNumber - 1];
                                if ((moment(i).date(t).isBefore(moment(a.repeat.end)) || moment(i).date(t).isSame(moment(a.repeat.end)))) {
                                    if (a.allDay) {
                                        events.push({
                                            _id: a._id,
                                            title: a.title + " (Repeat)",
                                            start: moment(i).date(t).toISOString(),
                                            end: moment(i).date(t).add(moment(a.end).diff(moment(a.start))).toISOString(),
                                            allDay: true,
                                            repeat: a.repeat.type
                                        });
                                    }
                                    else {
                                        events.push({
                                            _id: a._id,
                                            title: a.title + " (Repeat)",
                                            start: $.fullCalendar.moment(i).date(t).time(moment(a.start)).toISOString(),
                                            end: $.fullCalendar.moment(i).date(t).time(moment(a.end)).toISOString(),
                                            allDay: false,
                                            repeat: a.repeat.type
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else if (a.repeat.type === 4) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "years")) {
                            let t = moment(i).month(a.repeat.month - 1).date(a.repeat.date <= moment(i).month(a.repeat.month - 1).daysInMonth() ? a.repeat.date : moment(i).month(a.repeat.month - 1).daysInMonth());
                            if (moment(t).isBefore(moment(a.repeat.end)) || moment(t).isSame(moment(a.repeat.end))) {
                                if (a.allDay) {
                                    events.push({
                                        _id: a._id,
                                        title: a.title + " (Repeat)",
                                        start: moment(t).toISOString(),
                                        end: moment(t).add(moment(a.end).diff(moment(a.start))).subtract(1, "day").toISOString(),
                                        allDay: true,
                                        repeat: a.repeat.type
                                    });
                                }
                                else {
                                    events.push({
                                        _id: a._id,
                                        title: a.title + " (Repeat)",
                                        start: $.fullCalendar.moment(t).time(moment(a.start)).toISOString(),
                                        end: $.fullCalendar.moment(t).time(moment(a.end)).toISOString(),
                                        allDay: false,
                                        repeat: a.repeat.type
                                    });
                                }
                            }
                        }
                    }
                }
                else {
                    events.push(a);
                }
            });
        }
        Session.set("allEvents", events);
    };
    let showModal = (modal, state) => {
        $("#" + modal).modal(state);
        let event = CalEvents.find().fetch().find((a) => Session.equals("selectedEvent", a._id)) || {
            title: "",
            start: "",
            end: "",
            allDay: "",
            repeat: false
        };
        $("#eventName").val(event.title);
        $("#repeatType").val(0);
        if (event.allDay) {
            $("#startDate").prop("disabled", false);
            $("#endDate").prop("disabled", false);
            $("#startTime").prop("disabled", true);
            $("#endTime").prop("disabled", true);
            $("#allDay").prop("checked", true);
            startDate.data("DateTimePicker").date(moment(event.start).utc());
            endDate.data("DateTimePicker").date(moment(event.end).subtract(1, "day").utc());
            startTime.data("DateTimePicker").date(null);
            endTime.data("DateTimePicker").date(null);
        }
        else {
            $("#startDate").prop("disabled", false);
            $("#endDate").prop("disabled", true);
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#allDay").prop("checked", false);
            startDate.data("DateTimePicker").date(moment(event.start).utc());
            endDate.data("DateTimePicker").date(moment(event.start).utc());
            startTime.data("DateTimePicker").date(moment(event.start).utc());
            endTime.data("DateTimePicker").date(moment(event.end).utc());
        }
        if (event.repeat) {
            $("#repeatType").prop("disabled", false);
            $("#repeatStart").prop("disabled", false);
            $("#repeatEnd").prop("disabled", false);
            $("#repeatSkip").prop("disabled", false);
            $("#repeatWeekNumber").prop("disabled", false);
            $("#repeatWeekDay").prop("disabled", false);
            $("#repeatMonth").prop("disabled", false);
            $("#repeatDate").prop("disabled", false);
            $("#repeatType").val(event.repeat.type);
            $("#repeat").prop("checked", true);
            repeatStart.data("DateTimePicker").date(moment(event.repeat.start).utc());
            repeatEnd.data("DateTimePicker").date(moment(event.repeat.end).utc());
            $("#repeatSkip").val(event.repeat.skip);
            $("#repeatWeekNumber").val(event.repeat.weekNumber || 1);
            $("#repeatWeekDay").val(event.repeat.weekDays || []);
            $("#repeatMonth").val(event.repeat.month || 1);
            $("#repeatDate").val(event.repeat.date || 1);
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
            repeatStart.data("DateTimePicker").date(moment(event.start).utc().stripTime());
            repeatEnd.data("DateTimePicker").date(moment(event.start).utc().stripTime());
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
        loadEvents();
    });
    CalEvents.find().observeChanges({
        added() {
                loadEvents();
            },
            changed() {
                loadEvents();
            },
            removed() {
                loadEvents();
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
                                    message: "Your total amount of events has exceeded 100. To continue to add more events, please delete some events."
                                });
                            }
                            else if (error.error === "not-logged-in") {
                                bootbox.alert({
                                    title: "Error",
                                    message: "You are not logged in."
                                });
                            }
                            else {
                                bootbox.alert({
                                    title: "Error",
                                    message: "An error occurred. Please try again later."
                                });
                            }
                        }
                    });
                },
                eventClick(event) {
                    event = CalEvents.find().fetch().find((a) => a._id === event._id);
                    if (event) {
                        Session.set("selectedEvent", event._id);
                        Session.set("repeatType", event.repeat ? event.repeat.type : 0);
                        showModal("editEvent", "show");
                    }
                },
                eventDrop(event, delta, revert, jsEvent) {
                    let wait = bootbox.dialog({
                        message: "Please wait while the event is being moved to a new time.",
                        title: "Moving Event"
                    });
                    if (jsEvent.ctrlKey || jsEvent.metaKey) {
                        Meteor.call("addEvent", moment(event.start).toISOString(), !(!event.start.hasTime()), (error, result) => {
                            if (!error) {
                                Meteor.call("dropEvent", result, event.title, moment(event.start).toISOString(), event.end ? moment(event.end).toISOString() : null, !event.start.hasTime(), (error, result) => {
                                    wait.modal("hide");
                                    if (error) {
                                        console.log(error.error);
                                        if (error.error === "event-name-length") {
                                            bootbox.alert({
                                                title: "Error",
                                                message: "The name given to the event is too long. Please make sure that it is under 50 characters."
                                            });
                                        }
                                        else {
                                            bootbox.alert({
                                                title: "Error",
                                                message: "An error occurred. Please try again later."
                                            });
                                        }
                                        revert();
                                    }
                                });
                            }
                        });
                    }
                    else {
                        Meteor.call("dropEvent", event._id, event.title, moment(event.start).toISOString(), event.end ? moment(event.end).toISOString() : null, !event.start.hasTime(), (error, result) => {
                            wait.modal("hide");
                            if (error) {
                                console.log(error.error);
                                if (error.error === "event-name-length") {
                                    bootbox.alert({
                                        title: "Error",
                                        message: "The name given to the event is too long. Please make sure that it is under 50 characters."
                                    });
                                }
                                else {
                                    bootbox.alert({
                                        title: "Error",
                                        message: "An error occurred. Please try again later."
                                    });
                                }
                                revert();
                            }
                        });
                    }
                },
                eventResize(event, delta, revert) {
                    let wait = bootbox.dialog({
                        message: "Please wait while the event is being resized.",
                        title: "Resizing Event"
                    });
                    Meteor.call("dropEvent", event._id, event.title, moment(event.start).toISOString(), event.end ? moment(event.end).toISOString() : null, !event.start.hasTime(), (error, result) => {
                        wait.modal("hide");
                        if (error) {
                            console.log(error.error);
                            if (error.error === "event-name-length") {
                                bootbox.alert({
                                    title: "Error",
                                    message: "The name given to the event is too long. Please make sure that it is under 50 characters."
                                });
                            }
                            else {
                                bootbox.alert({
                                    title: "Error",
                                    message: "An error occurred. Please try again later."
                                });
                            }
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
                        callback(Session.get("allEvents"));
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
        events() {
            let events = [];
            CalEvents.find().fetch().forEach((a) => {
                if (a.repeat) {
                    if (a.repeat.type === 0) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "days")) {
                            if (a.allDay) {
                                events.push({
                                    _id: a._id,
                                    title: a.title + " (Repeat)",
                                    start: moment(i).utc().format("LL"),
                                    end: moment(i).add(moment(a.end).diff(moment(a.start))).subtract(1, "day").utc().format("LL"),
                                    allDay: true,
                                    repeat: a.repeat.type
                                });
                            }
                            else {
                                events.push({
                                    _id: a._id,
                                    title: a.title + " (Repeat)",
                                    start: $.fullCalendar.moment(i).time(moment(a.start)).utc().format("LLL"),
                                    end: $.fullCalendar.moment(i).time(moment(a.end)).utc().format("LLL"),
                                    allDay: false,
                                    repeat: a.repeat.type
                                });
                            }
                        }
                    }
                    else if (a.repeat.type === 1) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "weeks")) {
                            for (let j of a.repeat.weekDays) {
                                let t = moment(i).day() <= j ? j : j + 7;
                                if ((moment(i).day(t).isBefore(moment(a.repeat.end)) || moment(i).day(t).isSame(moment(a.repeat.end)))) {
                                    if (a.allDay) {
                                        events.push({
                                            _id: a._id,
                                            title: a.title + " (Repeat)",
                                            start: moment(i).day(t).utc().format("LL"),
                                            end: moment(i).day(t).add(moment(a.end).diff(moment(a.start))).subtract(1, "day").utc().format("LL"),
                                            allDay: true,
                                            repeat: a.repeat.type
                                        });
                                    }
                                    else {
                                        events.push({
                                            _id: a._id,
                                            title: a.title + " (Repeat)",
                                            start: $.fullCalendar.moment(i).day(t).time(moment(a.start)).utc().format("LLL"),
                                            end: $.fullCalendar.moment(i).day(t).time(moment(a.end)).utc().format("LLL"),
                                            allDay: false,
                                            repeat: a.repeat.type
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else if (a.repeat.type === 2) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "months")) {
                            let t = moment(i).date() <= a.repeat.date ? (a.repeat.date <= moment(i).daysInMonth() ? a.repeat.date : moment(i).daysInMonth()) : a.repeat.date + moment(i).daysInMonth();
                            if ((moment(i).date(t).isBefore(moment(a.repeat.end)) || moment(i).date(t).isSame(moment(a.repeat.end)))) {
                                if (a.allDay) {
                                    events.push({
                                        _id: a._id,
                                        title: a.title + " (Repeat)",
                                        start: moment(i).date(t).utc().format("LL"),
                                        end: moment(i).date(t).add(moment(a.end).diff(moment(a.start))).subtract(1, "day").utc().format("LL"),
                                        allDay: true,
                                        repeat: a.repeat.type
                                    });
                                }
                                else {
                                    events.push({
                                        _id: a._id,
                                        title: a.title + " (Repeat)",
                                        start: $.fullCalendar.moment(i).date(t).time(moment(a.start)).utc().format("LLL"),
                                        end: $.fullCalendar.moment(i).date(t).time(moment(a.end)).utc().format("LLL"),
                                        allDay: false,
                                        repeat: a.repeat.type
                                    });
                                }
                            }
                        }
                    }
                    else if (a.repeat.type === 3) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "months")) {
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
                            for (let j of a.repeat.weekDays) {
                                let t = a.repeat.weekNumber === 5 ? weeksInMonth[j][weeksInMonth[j].length - 1] : weeksInMonth[j][a.repeat.weekNumber - 1];
                                if ((moment(i).date(t).isBefore(moment(a.repeat.end)) || moment(i).date(t).isSame(moment(a.repeat.end)))) {
                                    if (a.allDay) {
                                        events.push({
                                            _id: a._id,
                                            title: a.title + " (Repeat)",
                                            start: moment(i).date(t).utc().format("LL"),
                                            end: moment(i).date(t).add(moment(a.end).diff(moment(a.start))).subtract(1, "day").utc().format("LL"),
                                            allDay: true,
                                            repeat: a.repeat.type
                                        });
                                    }
                                    else {
                                        events.push({
                                            _id: a._id,
                                            title: a.title + " (Repeat)",
                                            start: $.fullCalendar.moment(i).date(t).time(moment(a.start)).utc().format("LLL"),
                                            end: $.fullCalendar.moment(i).date(t).time(moment(a.end)).utc().format("LLL"),
                                            allDay: false,
                                            repeat: a.repeat.type
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else if (a.repeat.type === 4) {
                        for (let i = moment(a.repeat.start); i.isBefore(moment(a.repeat.end)) || i.isSame(moment(a.repeat.end)); i.add(a.repeat.skip + 1, "years")) {
                            let t = moment(i).month(a.repeat.month - 1).date(a.repeat.date <= moment(i).month(a.repeat.month - 1).daysInMonth() ? a.repeat.date : moment(i).month(a.repeat.month - 1).daysInMonth());
                            if (moment(t).isBefore(moment(a.repeat.end)) || moment(t).isSame(moment(a.repeat.end))) {
                                if (a.allDay) {
                                    events.push({
                                        _id: a._id,
                                        title: a.title + " (Repeat)",
                                        start: moment(t).utc().format("LL"),
                                        end: moment(t).add(moment(a.end).diff(moment(a.start))).subtract(1, "day").utc().format("LL"),
                                        allDay: true,
                                        repeat: a.repeat.type
                                    });
                                }
                                else {
                                    events.push({
                                        _id: a._id,
                                        title: a.title + " (Repeat)",
                                        start: $.fullCalendar.moment(t).time(moment(a.start)).utc().format("LLL"),
                                        end: $.fullCalendar.moment(t).time(moment(a.end)).utc().format("LLL"),
                                        allDay: false,
                                        repeat: a.repeat.type
                                    });
                                }
                            }
                        }
                    }
                }
                else {
                    if (a.allDay) {
                        events.push({
                            _id: a._id,
                            title: a.title,
                            start: moment(a.start).utc().format("LL"),
                            end: moment(a.end).subtract(1, "day").utc().format("LL"),
                            allDay: true
                        });
                    }
                    else {
                        events.push({
                            _id: a._id,
                            title: a.title,
                            start: moment(a.start).utc().format("LLL"),
                            end: moment(a.end).utc().format("LLL"),
                            allDay: false
                        });
                    }
                }
            });
            return events.sort((a, b) => new Date(a.start) - new Date(b.start) || a.title.toLowerCase().charCodeAt() - b.title.toLowerCase().charCodeAt());
        }
    });
    Template.main.events({
        "click #deleteEvent" () {
            bootbox.confirm({
                title: "Delete Event",
                message: "Are you sure you want to delete this event? It cannot be undone.",
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
                                    message: "An error occurred. Please try again later."
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
                    type: parseFloat($("#repeatType").val()),
                    start: moment(repeatStart.data("DateTimePicker").date().stripTime()).toISOString(),
                    end: moment(repeatEnd.data("DateTimePicker").date().stripTime()).toISOString(),
                    skip: parseFloat($("#repeatSkip").val())
                };
                switch (parseFloat($("#repeatType").val())) {
                    case 0:
                        break;
                    case 1:
                        repeat.weekDays = $("#repeatWeekDay").val() ? $("#repeatWeekDay").val().map((a) => parseFloat(a)) : [];
                        break;
                    case 2:
                        repeat.date = parseFloat($("#repeatDate").val());
                        break;
                    case 3:
                        repeat.weekDays = $("#repeatWeekDay").val() ? $("#repeatWeekDay").val().map((a) => parseFloat(a)) : [];
                        repeat.weekNumber = parseFloat($("#repeatWeekNumber").val());
                        break;
                    case 4:
                        repeat.month = parseFloat($("#repeatMonth").val());
                        repeat.date = parseFloat($("#repeatDate").val());
                        break;
                    case 5:
                        repeat.weekDays = $("#repeatWeekDay").val() ? $("#repeatWeekDay").val().map((a) => parseFloat(a)) : [];
                        repeat.weekNumber = parseFloat($("#repeatWeekNumber").val());
                        repeat.month = parseFloat($("#repeatMonth").val());
                        break;
                }
            }
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
                    else if (error.error === "day-of-week-length") {
                        bootbox.alert({
                            title: "Error",
                            message: "Please select one or more days of the week."
                        });
                    }
                    else if (error.error === "date-out-of-range") {
                        bootbox.alert({
                            title: "Error",
                            message: "Please make sure that the date is between 1 and 31."
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
                            message: "An error occurred. Please try again later."
                        });
                    }
                }
            });
        },
        "change #allDay" () {
            let event = CalEvents.find().fetch().find((a) => Session.equals("selectedEvent", a._id)) || {
                title: "",
                start: "",
                end: "",
                allDay: ""
            };
            if ($("#allDay").prop("checked")) {
                $("#startDate").prop("disabled", false);
                $("#endDate").prop("disabled", false);
                $("#startTime").prop("disabled", true);
                $("#endTime").prop("disabled", true);
                startDate.data("DateTimePicker").date(moment(event.start).utc());
                endDate.data("DateTimePicker").date(moment(event.end).subtract(1, "day").utc());
                startTime.data("DateTimePicker").date(null);
                endTime.data("DateTimePicker").date(null);
            }
            else {
                $("#startDate").prop("disabled", false);
                $("#endDate").prop("disabled", true);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                startDate.data("DateTimePicker").date(moment(event.start).utc());
                endDate.data("DateTimePicker").date(moment(event.start).utc());
                startTime.data("DateTimePicker").date(moment(event.start).utc());
                endTime.data("DateTimePicker").date(moment(event.end).utc());
            }
        },
        "change #repeatType" () {
            Session.set("repeatType", parseFloat($("#repeatType").val()));
        },
        "change #repeat" () {
            let event = CalEvents.find().fetch().find((a) => Session.equals("selectedEvent", a._id)) || {
                title: "",
                start: "",
                end: "",
                allDay: "",
                repeat: false
            };
            if ($("#repeat").prop("checked")) {
                Session.set("repeatType", event.repeat ? event.repeat.type : 0);
                $("#repeatType").prop("disabled", false);
                $("#repeatStart").prop("disabled", false);
                $("#repeatEnd").prop("disabled", false);
                $("#repeatSkip").prop("disabled", false);
                $("#repeatWeekNumber").prop("disabled", false);
                $("#repeatWeekDay").prop("disabled", false);
                $("#repeatMonth").prop("disabled", false);
                $("#repeatDate").prop("disabled", false);
                $("#repeatType").val(event.repeat ? event.repeat.type : 0);
                repeatStart.data("DateTimePicker").date(event.repeat ? moment(event.repeat.start).utc() : moment(event.start).utc());
                repeatEnd.data("DateTimePicker").date(event.repeat ? moment(event.repeat.end).utc() : moment(event.start).utc());
                $("#repeatSkip").val(event.repeat ? event.repeat.skip : 0);
                $("#repeatWeekNumber").val(event.repeat ? event.repeat.weekNumber : 1);
                $("#repeatWeekDay").val(event.repeat ? event.repeat.weekDays : []);
                $("#repeatMonth").val(event.repeat ? event.repeat.month : 1);
                $("#repeatDate").val(event.repeat ? event.repeat.weekNumber : 1);
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
                repeatStart.data("DateTimePicker").date(moment(event.start).utc().stripTime());
                repeatEnd.data("DateTimePicker").date(moment(event.start).utc().stripTime());
                $("#repeatSkip").val(0);
                $("#repeatWeekNumber").val(1);
                $("#repeatWeekDay").val(0);
                $("#repeatMonth").val(1);
                $("#repeatDate").val(1);
            }
        }
    });
    Template.list.events({
        "click tr" () {
            let event = CalEvents.find().fetch().find((a) => a._id === this._id);
            if (event) {
                Session.set("selectedEvent", this._id);
                Session.set("repeatType", this.repeat ? this.repeat.type : 0);
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
    Router.route("/list", function() {
        this.render("list");
    });
});
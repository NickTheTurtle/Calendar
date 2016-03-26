/* global moment bootbox LZString Deps Router */
Meteor.startup(() => {
    var startDate;
    var startTime;
    var endDate;
    var endTime;
    var repeatStart;
    var repeatEnd;
    var calendar;
    Session.set("selectedDate", false);
    Session.set("repeatType", -1);
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL",
        forceEmailLowercase: true,
        forceUsernameLowercase: true
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
                    var wait = bootbox.dialog({
                        message: "Please wait while a new event is being added.",
                        title: "Adding Event"
                    });
                    Meteor.call("addEvent", !date.hasTime() ? moment(date.toDate()).stripTime().toDate() : moment(date.toDate()).toDate(), !date.hasTime(), (error, result) => {
                        wait.modal("hide");
                        if (error) {
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
                    if (JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).findIndex((a) => a._id === event._id) !== -1) {
                        Session.set("selectedEvent", event._id);
                        Session.set("repeatType", event.repeat ? event.repeat.type : -1);
                        showModal("editEvent", "show");
                    }
                },
                eventDrop(event, delta, revert, jsEvent) {
                    var wait = bootbox.dialog({
                        message: "Please wait while the event is being moved to a new time.",
                        title: "Moving Event"
                    });
                    if (jsEvent.ctrlKey || jsEvent.metaKey) {
                        Meteor.call("addEvent", !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0) ? moment(event.start).toDate() : moment(event.start).toDate(), !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0), (error, result) => {
                            if (!error) {
                                Meteor.call("dropEvent", result, event.title, !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0) ? moment(event.start).toDate() : moment(event.start).stripTime().toDate(), !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0) ? (moment(event.end).stripTime().toDate() || null) : (moment(event.end).stripTime().toDate() || null), !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0), (error, result) => {
                                    wait.modal("hide");
                                    if (error) {
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
                        Meteor.call("dropEvent", event._id, event.title, !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0) ? moment(event.start).toDate() : moment(event.start).stripTime().toDate(), !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0) ? (moment(event.end).toDate() || null) : (moment(event.end).toDate() || null), moment(event.start).hours() === 0 && moment(event.start).minutes() === 0, (error, result) => {
                            wait.modal("hide");
                            if (error) {
                                if (error) {
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
                                revert();
                            }
                        });
                    }
                },
                eventResize(event, delta, revert) {
                    var wait = bootbox.dialog({
                        message: "Please wait while the event is being resized.",
                        title: "Resizing Event"
                    });
                    Meteor.call("dropEvent", event._id, event.title, !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0) ? moment(event.start).toDate() : moment(event.start).stripTime().toDate(), !(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0) ? (moment(event.end).toDate() || null) : (moment(event.end).toDate() || null), moment(event.start).hours() === 0 && moment(event.start).minutes() === 0, (error, result) => {
                        wait.modal("hide");
                        if (error) {
                            if (error) {
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
                    if (Meteor.user() && Meteor.user().events) {
                        callback(JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).sort());
                    }
                    else {
                        callback([]);
                    }
                },
                eventLimit: 5,
                selectable: true,
                editable: true
        }).data().fullCalendar;
        Deps.autorun(() => {
            Meteor.user();
            calendar.refetchEvents();
        });
    });
    Template.main.helpers({
        active(tab) {
                return Router.current().route.getName() === tab ? "active" : "";
            },
            repeatWeekNumber() {
                return !$("#repeatType").prop("disabled") && Session.equals("repeatType", 3) || Session.equals("repeatType", 5);
            },
            repeatWeekDay() {
                return !$("#repeatType").prop("disabled") && Session.equals("repeatType", 1) || Session.equals("repeatType", 3) || Session.equals("repeatType", 5);
            },
            repeatMonth() {
                return !$("#repeatType").prop("disabled") && Session.equals("repeatType", 4) || Session.equals("repeatType", 5);
            },
            repeatDate() {
                return !$("#repeatType").prop("disabled") && Session.equals("repeatType", 2) || Session.equals("repeatType", 4);
            }
    });
    Template.list.helpers({
        events() {
            var events = JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)) || {
                title: "",
                start: "",
                end: "",
                allDay: ""
            };
            return events.map((a) => {
                if (a.allDay) {
                    a.start = moment(a.start).utc().format("LL");
                    a.end = moment(a.end).utc().subtract(1, "day").format("LL");
                }
                else {
                    a.start = moment(a.start).utc().format("LLL");
                    a.end = moment(a.end).utc().format("LLL");
                }
                return a;
            }).sort((a, b) => new Date(a.start) - new Date(b.start) || a.title.toLowerCase().charCodeAt() - b.title.toLowerCase().charCodeAt());
        }
    });
    Template.main.events({
        "key #eventName" (event) {
            if (event.keyCode === 13) {
                $("#updateEvent").click();
            }
        },
        "click #deleteEvent" () {
            bootbox.confirm({
                title: "Delete Event",
                message: "Are you sure you want to delete this event? It cannot be undone.",
                callback(result) {
                    if (result) {
                        var wait = bootbox.dialog({
                            message: "Please wait while the event is being deleted.",
                            title: "Deleting Event"
                        });
                        Meteor.call("deleteEvent", Session.get("selectedEvent"), (error) => {
                            wait.modal("hide");
                            if (error) {
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
            var wait = bootbox.dialog({
                message: "Please wait while the event is being updated.",
                title: "Updating Event"
            });
            var event = JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).find((a) => Session.equals("selectedEvent", a._id)) || {
                title: "",
                start: "",
                end: "",
                allDay: ""
            };
            Meteor.call("dropEvent", Session.get("selectedEvent"), $("#eventName").val(), $("#allDay").prop("checked") ? (startDate.data("DateTimePicker").date().toDate ? moment(startDate.data("DateTimePicker").date()).toDate() : moment(event.start)) : (startDate.data("DateTimePicker").date().toDate ? startDate.data("DateTimePicker").date().stripTime().add(startTime.data("DateTimePicker").date().hours(), "hours").add(startTime.data("DateTimePicker").date().minutes(), "minutes").toDate() : moment(event.start)), $("#allDay").prop("checked") ? (endDate.data("DateTimePicker").date().toDate ? endDate.data("DateTimePicker").date().add(1, "day").stripTime().toDate() : moment(event.end)) : (endDate.data("DateTimePicker").date().toDate ? startDate.data("DateTimePicker").date().stripTime().add(endTime.data("DateTimePicker").date().hours(), "hours").add(endTime.data("DateTimePicker").date().minutes(), "minutes").toDate() : moment(event.end)), $("#allDay").prop("checked"), (error) => {
                wait.modal("hide");
                if (error) {
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
                }
            });
        },
        "change #allDay" () {
            var event = JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).find((a) => Session.equals("selectedEvent", a._id)) || {
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
                endDate.data("DateTimePicker").date(event.end !== "1970-01-01T00:00:00.000Z" ? moment(event.end).utc().subtract(1, "day") : moment(event.start).utc());
                startTime.data("DateTimePicker").date(null);
                endTime.data("DateTimePicker").date(null);
            }
            else {
                $("#startDate").prop("disabled", false);
                $("#endDate").prop("disabled", true);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                startDate.data("DateTimePicker").date(moment(event.start).utc().stripTime());
                endDate.data("DateTimePicker").date(moment(event.start).utc().stripTime());
                startTime.data("DateTimePicker").date(moment(event.start).utc());
                endTime.data("DateTimePicker").date(moment(event.end).utc());
            }
        },
        "change #repeatType" () {
            Session.set("repeatType", parseFloat($("#repeatType").val()));
        },
        "change #repeat" () {
            var event = JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).find((a) => Session.equals("selectedEvent", a._id)) || {
                title: "",
                start: "",
                end: "",
                allDay: "",
                repeat: false
            };
            if ($("#repeat").prop("checked")) {
                $("#repeatType").prop("disabled", false);
                $("#repeatStart").prop("disabled", false);
                $("#repeatEnd").prop("disabled", false);
                $("#repeatSkip").prop("disabled", false);
                $("#repeatWeekNumber").prop("disabled", false);
                $("#repeatWeekDay").prop("disabled", false);
                $("#repeatMonth").prop("disabled", false);
                $("#repeatDay").prop("disabled", false);
                $("#repeatType").val(event.repeat.type);
                repeatStart.data("DateTimePicker").date(moment(event.repeat.start).utc().stripTime());
                repeatEnd.data("DateTimePicker").date(moment(event.repeat.end).utc().stripTime());
                $("#repeatSkip").val(event.repeat.skip);
                $("#repeatWeekNumber").val(1);
                $("#repeatWeekDay").val(0);
                $("#repeatMonth").val(1);
                $("#repeatDay").val(1);
            }
            else {
                $("#repeatType").prop("disabled", true);
                $("#repeatStart").prop("disabled", true);
                $("#repeatEnd").prop("disabled", true);
                $("#repeatSkip").prop("disabled", true);
                $("#repeatWeekNumber").prop("disabled", true);
                $("#repeatWeekDay").prop("disabled", true);
                $("#repeatMonth").prop("disabled", true);
                $("#repeatDay").prop("disabled", true);
                $("#repeatType").val(0);
                repeatStart.data("DateTimePicker").date(null);
                repeatEnd.data("DateTimePicker").date(null);
                $("#repeatSkip").val(0);
                $("#repeatWeekNumber").val(1);
                $("#repeatWeekDay").val(0);
                $("#repeatMonth").val(1);
                $("#repeatDay").val(1);
            }
        }
    });
    Template.list.events({
        "click tr" () {
            if (JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).findIndex((a) => a._id === this._id) !== -1) {
                Session.set("selectedEvent", this._id);
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

    var showModal = (modal, state) => {
        $("#" + modal).modal(state);
        var event = JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).find((a) => Session.equals("selectedEvent", a._id)) || {
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
            endDate.data("DateTimePicker").date(event.end !== "1970-01-01T00:00:00.000Z" ? moment(event.end).utc().subtract(1, "day") : moment(event.start).utc());
            startTime.data("DateTimePicker").date(null);
            endTime.data("DateTimePicker").date(null);
        }
        else {
            $("#startDate").prop("disabled", false);
            $("#endDate").prop("disabled", true);
            $("#startTime").prop("disabled", false);
            $("#endTime").prop("disabled", false);
            $("#allDay").prop("checked", false);
            startDate.data("DateTimePicker").date(moment(event.start).utc().stripTime());
            endDate.data("DateTimePicker").date(moment(event.start).utc().stripTime());
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
            $("#repeatDay").prop("disabled", false);
            $("#repeatType").val(event.repeat.type);
            repeatStart.data("DateTimePicker").date(moment(event.repeat.start).utc().stripTime());
            repeatEnd.data("DateTimePicker").date(moment(event.repeat.end).utc().stripTime());
            $("#repeatSkip").val(event.repeat.skip);
            $("#repeatWeekNumber").val(1);
            $("#repeatWeekDay").val(0);
            $("#repeatMonth").val(1);
            $("#repeatDate").val(1);
        }
        else {
            $("#repeatType").prop("disabled", true);
            $("#repeatStart").prop("disabled", true);
            $("#repeatEnd").prop("disabled", true);
            $("#repeatSkip").prop("disabled", true);
            $("#repeatWeekNumber").prop("disabled", true);
            $("#repeatWeekDay").prop("disabled", true);
            $("#repeatMonth").prop("disabled", true);
            $("#repeatDay").prop("disabled", true);
            $("#repeatType").val(0);
            repeatStart.data("DateTimePicker").date(moment(event.start).utc().stripTime());
            repeatEnd.data("DateTimePicker").date(moment(event.start).utc().stripTime());
            $("#repeatSkip").val(0);
            $("#repeatWeekNumber").val(1);
            $("#repeatWeekDay").val(0);
            $("#repeatMonth").val(1);
            $("#repeatDate").val(1);
        }
    };
});

/* global moment bootbox LZString Deps Router */
Meteor.startup(() => {
    var startDate;
    var startTime;
    var endDate;
    var endTime;
    var calendar;
    Session.set("selectedDate", false);
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL",
        forceEmailLowercase: true,
        forceUsernameLowercase: true
    });
    Template.main.onRendered(() => {
        startDate = $("#startDate").datetimepicker({
            format: "LL"
        });
        startTime = $("#startTime").datetimepicker({
            format: "LT"
        });
        endDate = $("#endDate").datetimepicker({
            format: "LL"
        });
        endTime = $("#endTime").datetimepicker({
            format: "LT"
        });
    });
    Template.calendar.onRendered(() => {
        calendar = $("#calendar").fullCalendar({
            dayClick(date) {
                    var wait = bootbox.dialog({
                        message: "Please wait while a new event is being added.",
                        title: "Adding Event"
                    });
                    if (!date.hasTime()) {
                        Meteor.call("addAllDayEvent", moment(date.toDate()).stripTime().toDate(), (error, result) => {
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
                    }
                    else {
                        Meteor.call("addNonAllDayEvent", moment(date.toDate()).toDate(), (error, result) => {
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
                    }
                },
                eventClick(event) {
                    if (JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).findIndex((a) => a._id === event._id) !== -1) {
                        Session.set("selectedEvent", event._id);
                        showModal("editEvent", "show");
                    }
                },
                eventDrop(event, delta, revert, jsEvent) {
                    var wait = bootbox.dialog({
                        message: "Please wait while the event is being moved to a new time.",
                        title: "Moving Event"
                    });
                    if (jsEvent.ctrlKey || jsEvent.metaKey) {
                        if (!(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0)) {
                            Meteor.call("addNonAllDayEvent", moment(event.start).toDate(), (error, result) => {
                                if (!error) {
                                    Meteor.call("dropToNonAllDayEvent", result, event.title, moment(event.start).toDate(), moment(event.end).toDate() || null, (error, result) => {
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
                                else {
                                    wait.modal("hide");
                                    bootbox.alert({
                                        title: "Error",
                                        message: "An error occurred. Please try again later."
                                    });
                                    revert();
                                }
                            });
                        }
                        else {
                            Meteor.call("addAllDayEvent", moment(event.start).toDate(), (error, result) => {
                                if (!error) {
                                    Meteor.call("dropToAllDayEvent", result, event.title, moment(event.start).stripTime().toDate(), moment(event.end).stripTime().toDate() || null, (error, result) => {
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
                                else {
                                    wait.modal("hide");
                                    bootbox.alert({
                                        title: "Error",
                                        message: "An error occurred. Please try again later."
                                    });
                                    revert();
                                }
                            });
                        }
                    }
                    else {
                        if (!(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0)) {
                            Meteor.call("dropToNonAllDayEvent", event._id, event.title, moment(event.start).toDate(), moment(event.end).toDate() || null, (error, result) => {
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
                        else {
                            Meteor.call("dropToAllDayEvent", event._id, event.title, moment(event.start).stripTime().toDate(), moment(event.end).stripTime().toDate() || null, (error, result) => {
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
                    }
                },
                eventResize(event, delta, revert) {
                    var wait = bootbox.dialog({
                        message: "Please wait while the event is being resized.",
                        title: "Resizing Event"
                    });
                    if (!(moment(event.start).hours() === 0 && moment(event.start).minutes() === 0)) {
                        Meteor.call("dropToNonAllDayEvent", event._id, event.title, moment(event.start).toDate(), moment(event.end).toDate() || null, (error, result) => {
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
                    else {
                        Meteor.call("dropToAllDayEvent", event._id, event.title, moment(event.start).stripTime().toDate(), moment(event.end).stripTime().toDate() || null, (error, result) => {
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
            if ($("#allDay").prop("checked")) {
                Meteor.call("dropToAllDayEvent", Session.get("selectedEvent"), $("#eventName").val(), startDate.data("DateTimePicker").date().toDate ? moment(startDate.data("DateTimePicker").date()).toDate() : moment(event.start), endDate.data("DateTimePicker").date().toDate ? endDate.data("DateTimePicker").date().add(1, "day").stripTime().toDate() : moment(event.end), (error) => {
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
            }
            else {
                Meteor.call("dropToNonAllDayEvent", Session.get("selectedEvent"), $("#eventName").val(), startDate.data("DateTimePicker").date().toDate ? startDate.data("DateTimePicker").date().stripTime().add(startTime.data("DateTimePicker").date().hours(), "hours").add(startTime.data("DateTimePicker").date().minutes(), "minutes").toDate() : moment(event.start), endDate.data("DateTimePicker").date().toDate ? startDate.data("DateTimePicker").date().stripTime().add(endTime.data("DateTimePicker").date().hours(), "hours").add(endTime.data("DateTimePicker").date().minutes(), "minutes").toDate() : moment(event.end), (error) => {
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
            }
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
                endDate.data("DateTimePicker").date(moment(event.end).utc().subtract(1, "day"));
                startTime.data("DateTimePicker").date(null);
                endTime.data("DateTimePicker").date(null);
            }
            else {
                $("#startDate").prop("disabled", false);
                $("#endDate").prop("disabled", true);
                $("#startTime").prop("disabled", false);
                $("#endTime").prop("disabled", false);
                startDate.data("DateTimePicker").date(moment(event.start).utc().stripTime());
                endDate.data("DateTimePicker").date(moment(event.end).utc().stripTime());
                startTime.data("DateTimePicker").date(moment(event.start).utc());
                endTime.data("DateTimePicker").date(moment(event.end).utc());
            }
        }
    });
    Template.list.events({
        "click tr" (event) {
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
            allDay: ""
        };
        $("#eventName").val(event.title);
        if (event.allDay) {
            $("#startDate").prop("disabled", false);
            $("#endDate").prop("disabled", false);
            $("#startTime").prop("disabled", true);
            $("#endTime").prop("disabled", true);
            $("#allDay").prop("checked", true);
            startDate.data("DateTimePicker").date(moment(event.start).utc());
            endDate.data("DateTimePicker").date(moment(event.end).utc().subtract(1, "day"));
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
            endDate.data("DateTimePicker").date(moment(event.end).utc().stripTime());
            startTime.data("DateTimePicker").date(moment(event.start).utc());
            endTime.data("DateTimePicker").date(moment(event.end).utc());
        }
    };
});

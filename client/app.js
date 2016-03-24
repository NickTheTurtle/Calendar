/* global moment bootbox */
Meteor.startup(function() {
    var startDate = $("#startDate").datetimepicker({
        format: "LL"
    });
    var startTime = $("#startTime").datetimepicker({
        format: "LT"
    });
    var endDate = $("#endDate").datetimepicker({
        format: "LL"
    });
    var endTime = $("#endTime").datetimepicker({
        format: "LT"
    });
    Session.set("selectedDate", false);
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
    });
    var calendar = $("#calendar").fullCalendar({
        dayClick: function(date) {
            var wait = bootbox.dialog({
                message: "Please wait while a new event is being added.",
                title: "Adding Event"
            });
            if (date.hasTime()) {
                Meteor.call("addAllDayEvent", new Date(new Date(date._d).getTime() + (new Date).getTimezoneOffset() * 6e+4), function(error, result) {
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
                    }
                });
            }
            else {
                Meteor.call("addNonAllDayEvent", new Date(new Date(date._d).getTime() + (new Date).getTimezoneOffset() * 6e+4), function(error, result) {
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
                    }
                });
            }
        },
        eventClick: function(event) {
            Session.set("selectedEvent", event._id);
            showModal("editEvent", "show");
        },
        eventDrop: function(event, delta, revert, jsEvent) {
            var wait = bootbox.dialog({
                message: "Please wait while the event is being moved to a new time.",
                title: "Moving Event"
            });
            if (jsEvent.ctrlKey || jsEvent.metaKey) {
                if (event.start.hasTime()) {
                    Meteor.call("addNonAllDayEvent", new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), function(error, result) {
                        if (!error) {
                            Meteor.call("dropToNonAllDayEvent", result, event.title, new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), event.end ? new Date(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4) : null, function(error, result) {
                                wait.modal("hide");
                                if (error) {
                                    bootbox.alert({
                                        title: "Error",
                                        message: "An error occurred. Please try again later."
                                    });
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
                    Meteor.call("addAllDayEvent", new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), function(error, result) {
                        if (!error) {
                            Meteor.call("dropToAllDayEvent", result, event.title, moment(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4).stripTime().toDate(), event.end ? moment(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4).stripTime().toDate() : null, function(error, result) {
                                wait.modal("hide");
                                if (error) {
                                    bootbox.alert({
                                        title: "Error",
                                        message: "An error occurred. Please try again later."
                                    });
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
                if (event.start.hasTime()) {
                    Meteor.call("dropToNonAllDayEvent", event._id, event.title, new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), event.end ? new Date(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4) : null, function(error, result) {
                        wait.modal("hide");
                        if (error) {
                            bootbox.alert({
                                title: "Error",
                                message: "An error occurred. Please try again later."
                            });
                            revert();
                        }
                    });
                }
                else {
                    Meteor.call("dropToAllDayEvent", event._id, event.title, moment(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4).stripTime().toDate(), event.end ? moment(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4).stripTime().toDate() : null, function(error, result) {
                        wait.modal("hide");
                        if (error) {
                            bootbox.alert({
                                title: "Error",
                                message: "An error occurred. Please try again later."
                            });
                            revert();
                        }
                    });
                }
            }
        },
        eventResize: function(event, delta, revert) {
            var wait = bootbox.dialog({
                message: "Please wait while the event is being resized.",
                title: "Resizing Event"
            });
            Meteor.call("dropEvent", event._id, event.title, new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), event.end ? new Date(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4) : event.end, !moment(event.start).hasTime(), function(error, result) {
                wait.modal("hide");
                if (error) {
                    bootbox.alert({
                        title: "Error",
                        message: "An error occurred. Please try again later."
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
        events: function(start, end, timezone, callback) {
            if (Meteor.user() && Meteor.user().events) {
                callback(Meteor.user().events.sort());
            }
            else {
                callback([]);
            }
        },
        eventLimit: 5,
        selectable: true,
        editable: true
    }).data().fullCalendar;
    Deps.autorun(function() {
        Meteor.user();
        calendar.refetchEvents();
    });
    $("#eventName").keyup(function(event) {
        if (event.keyCode === 13) {
            $("#updateEvent").click();
        }
    });
    $("#deleteEvent").click(function() {
        bootbox.confirm({
            title: "Delete Event",
            message: "Are you sure you want to delete this event? It cannot be undone.",
            callback: function(result) {
                if (result) {
                    var wait = bootbox.dialog({
                        message: "Please wait while the event is being deleted.",
                        title: "Deleting Event"
                    });
                    Meteor.call("deleteEvent", Session.get("selectedEvent"), function(error) {
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
    });
    $("#updateEvent").click(function() {
        var wait = bootbox.dialog({
            message: "Please wait while the event is being updated.",
            title: "Updating Event"
        });
        var event = Meteor.user().events.find(function(a) {
            return Session.equals("selectedEvent", a._id);
        }) || {
            title: "",
            start: "",
            end: "",
            allDay: ""
        };
        if ($("#allDay").prop("checked")) {
            Meteor.call("dropAllDayEvent", Session.get("selectedEvent"), $("#eventName").val(), moment(startDate.data("DateTimePicker").date()).stripTime().toDate(), moment(endDate.data("DateTimePicker").date()).stripTime().toDate(), function(error) {
                wait.modal("hide");
                if (error) {
                    bootbox.alert({
                        title: "Error",
                        message: "An error occurred. Please try again later."
                    });
                }
            });
        }
        else {
            Meteor.call("dropNonAllDayEvent", Session.get("selectedEvent"), $("#eventName").val(), startTime.data("DateTimePicker").date(), endTime.data("DateTimePicker").date(), function(error) {
                wait.modal("hide");
                if (error) {
                    bootbox.alert({
                        title: "Error",
                        message: "An error occurred. Please try again later."
                    });
                }
            });
        }
    });
    $("#allDay").change(function() {
        var event = Meteor.user().events.find(function(a) {
            return Session.equals("selectedEvent", a._id);
        }) || {
            title: "",
            start: "",
            end: "",
            allDay: ""
        };
        if ($(this).prop("checked")) {
            $("#startDate").prop("readonly", false);
            $("#endDate").prop("readonly", false);
            $("#startTime").prop("readonly", true);
            $("#endTime").prop("readonly", true);
            startDate.data("DateTimePicker").date(moment(event.start).toDate());
            endDate.data("DateTimePicker").date(moment(event.end).subtract(1, "day").toDate());
            startTime.data("DateTimePicker").date(null);
            endTime.data("DateTimePicker").date(null);
        }
        else {
            $("#startDate").prop("readonly", true);
            $("#endDate").prop("readonly", true);
            $("#startTime").prop("readonly", false);
            $("#endTime").prop("readonly", false);
            $("#allDay").prop("checked", false);
            startDate.data("DateTimePicker").date(moment(event.start).stripTime().toDate());
            endDate.data("DateTimePicker").date(moment(event.start).stripTime().toDate());
            startTime.data("DateTimePicker").date(moment(event.start).toDate());
            endTime.data("DateTimePicker").date(moment(event.start).toDate());
        }
    });

    function showModal(modal, state) {
        $("#" + modal).modal(state);
        var event = Meteor.user().events.find(function(a) {
            return Session.equals("selectedEvent", a._id);
        }) || {
            title: "",
            start: "",
            end: "",
            allDay: ""
        };
        $("#eventName").val(event.title);
        if (event.allDay) {
            $("#startDate").prop("readonly", false);
            $("#endDate").prop("readonly", false);
            $("#startTime").prop("readonly", true);
            $("#endTime").prop("readonly", true);
            $("#allDay").prop("checked", true);
            startDate.data("DateTimePicker").date(moment(event.start).toDate());
            endDate.data("DateTimePicker").date(moment(event.end).subtract(1, "day").toDate());
            startTime.data("DateTimePicker").date(null);
            endTime.data("DateTimePicker").date(null);
        }
        else {
            $("#startDate").prop("readonly", true);
            $("#endDate").prop("readonly", true);
            $("#startTime").prop("readonly", false);
            $("#endTime").prop("readonly", false);
            $("#allDay").prop("checked", false);
            startDate.data("DateTimePicker").date(moment(event.start).stripTime().toDate());
            endDate.data("DateTimePicker").date(moment(event.start).stripTime().toDate());
            startTime.data("DateTimePicker").date(moment(event.start).toDate());
            endTime.data("DateTimePicker").date(moment(event.start).toDate());
        }
    }
});

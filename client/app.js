/* global moment bootbox LZString Deps */
Meteor.startup(() => {
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
                Session.set("selectedEvent", event._id);
                showModal("editEvent", "show");
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
    $("#eventName").keyup((event) => {
        if (event.keyCode === 13) {
            $("#updateEvent").click();
        }
    });
    $("#deleteEvent").click(() => {
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
    });
    $("#updateEvent").click(() => {
        var wait = bootbox.dialog({
            message: "Please wait while the event is being updated.",
            title: "Updating Event"
        });
        var event = JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).find((a) => {
            return Session.equals("selectedEvent", a._id);
        }) || {
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
    });
    $("#allDay").change(() => {
        var event = JSON.parse(LZString.decompressFromUTF16(Meteor.user().events)).find((a) => Session.equals("selectedEvent", a._id)) || {
            title: "",
            start: "",
            end: "",
            allDay: ""
        };
        if ($("#allDay").prop("checked")) {
            $("#startDate").prop("readonly", false);
            $("#endDate").prop("readonly", false);
            $("#startTime").prop("readonly", true);
            $("#endTime").prop("readonly", true);
            startDate.data("DateTimePicker").date(moment(event.start));
            endDate.data("DateTimePicker").date(moment(event.end).subtract(1, "day"));
            startTime.data("DateTimePicker").date(null);
            endTime.data("DateTimePicker").date(null);
        }
        else {
            $("#startDate").prop("readonly", false);
            $("#endDate").prop("readonly", true);
            $("#startTime").prop("readonly", false);
            $("#endTime").prop("readonly", false);
            startDate.data("DateTimePicker").date(moment(event.start).stripTime());
            endDate.data("DateTimePicker").date(moment(event.end).stripTime());
            startTime.data("DateTimePicker").date(moment(event.start).utc());
            endTime.data("DateTimePicker").date(moment(event.end).utc());
        }
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
            $("#startDate").prop("readonly", false);
            $("#endDate").prop("readonly", false);
            $("#startTime").prop("readonly", true);
            $("#endTime").prop("readonly", true);
            $("#allDay").prop("checked", true);
            startDate.data("DateTimePicker").date(moment(moment(event.start)));
            endDate.data("DateTimePicker").date(moment(moment(event.end)).subtract(1, "day"));
            startTime.data("DateTimePicker").date(null);
            endTime.data("DateTimePicker").date(null);
        }
        else {
            $("#startDate").prop("readonly", false);
            $("#endDate").prop("readonly", true);
            $("#startTime").prop("readonly", false);
            $("#endTime").prop("readonly", false);
            $("#allDay").prop("checked", false);
            startDate.data("DateTimePicker").date(moment(event.start).stripTime());
            endDate.data("DateTimePicker").date(moment(event.end).stripTime());
            startTime.data("DateTimePicker").date(moment(event.start).utc());
            endTime.data("DateTimePicker").date(moment(event.end).utc());
        }
    };
});

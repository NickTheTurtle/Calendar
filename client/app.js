Meteor.startup(function() {
    var startDate = $("#startDate").datetimepicker({
        format: "LL",
        sideBySide: true
    });
    var endDate = $("#endDate").datetimepicker({
        format: "LL",
        sideBySide: true
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
            Meteor.call("addEvent", new Date(new Date(date._d).getTime() + (new Date).getTimezoneOffset() * 6e+4), !date.hasTime(), function(error, result) {
                wait.modal("hide");
                if (error) {
                    if (error.error === "event-amount-exceeded") {
                        bootbox.alert({
                            title: "Error",
                            message: "Your total amount of events has exceeded 100. To continue to add more events, please delete some events."
                        });
                    }
                }
            });
        },
        eventClick: function(event) {
            Session.set("selectedEvent", event._id);
            showModal("editEvent", "show");
        },
        eventDrop: function(event, delta, revert) {
            var wait = bootbox.dialog({
                message: "Please wait while the event is being moved to a new time.",
                title: "Moving Event"
            });
            Meteor.call("dropEvent", event._id, event.title, new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), event.end ? new Date(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4) : event.end, !event.start.hasTime(), function(error, result) {
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
        eventResize: function(event, delta, revert) {
            var wait = bootbox.dialog({
                message: "Please wait while the event is being resized.",
                title: "Resizing Event",
                onEscape: false,
                closeButton: false
            });
            Meteor.call("dropEvent", event._id, event.title, new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), event.end ? new Date(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4) : event.end, !event.start.hasTime(), function(error, result) {
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
    $("#deleteEvent").click(function() {
        bootbox.confirm({
            title: "Delete Event",
            message: "Are you sure you want to delete this event? It cannot be undone.",
            callback: function(result) {
                if (result) {
                    var wait = bootbox.dialog({
                        message: "Please wait while the event is being deleted.",
                        title: "Deleting Event",
                        onEscape: false,
                        closeButton: false
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
    $("#editEvent").click(function() {
        var wait = bootbox.dialog({
            message: "Please wait while the event is being deleted.",
            title: "Deleting Event",
            onEscape: false,
            closeButton: false
        });
        Meteor.call("dropEvent", Session.get("selectedEvent"), $("#eventName").val(""), startDate.data("DateTimePicker").date, endDate.data("DateTimePicker").date, event.allDay, function(error) {
            wait.modal("hide");
            if (error) {
                bootbox.alert({
                    title: "Error",
                    message: "An error occurred. Please try again later."
                });
            }
        });
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
            startDate.data("DateTimePicker").format("LL");
            endDate.data("DateTimePicker").format("LL");
            startDate.data("DateTimePicker").date(event.start || null);
            endDate.data("DateTimePicker").date(moment(event.end).subtract(1, "day") || event.start || null);
        }
        else {
            startDate.data("DateTimePicker").format("LLL");
            endDate.data("DateTimePicker").format("LLL");
            startDate.data("DateTimePicker").date(event.start || null);
            endDate.data("DateTimePicker").date(event.end || null);
        }
    }
});

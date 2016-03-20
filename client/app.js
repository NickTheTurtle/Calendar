Meteor.startup(function() {
    Session.set("selectedDate", false);
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
    });
    var calendar = $("#calendar").fullCalendar({
        dayClick: function(date) {
            var wait = bootbox.dialog({
                message: "Please wait while a new event is being added.",
                title: "Adding Event",
                onEscape: false,
                closeButton: false
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
            showModal("editEvent", "show");
            Session.set("selectedEvent", event._id);
        },
        eventDrop: function(event, delta, revert) {
            var wait = bootbox.dialog({
                message: "Please wait while the event is being moved to a new time.",
                title: "Moving Event",
                onEscape: false,
                closeButton: false
            });
            Meteor.call("dropEvent", event._id, new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), new Date(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4), !event.start.hasTime(), function(error, result) {
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
            Meteor.call("dropEvent", event._id, new Date(new Date(event.start).getTime() + (new Date).getTimezoneOffset() * 6e+4), new Date(new Date(event.end).getTime() + (new Date).getTimezoneOffset() * 6e+4), !event.start.hasTime(), function(error, result) {
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
    Template.body.helpers({
        selectedEvent: function() {
            Session.get("selectedEvent");
            return Meteor.user().events.find(function(a) {
                return a._id === Session.get("selectedEvent");
            }) || {
                title: "",
                start: "",
                end: "",
                allDay: ""
            };
        }
    });

    function showModal(modal, state) {
        $("#" + modal).modal(state);
        $("#startDate").datetimepicker({
            sideBySide: true
        });
        $("#endDate").datetimepicker({
            sideBySide: true
        });
    }
});

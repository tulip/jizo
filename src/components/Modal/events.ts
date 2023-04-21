export const AlertDismissed = new CustomEvent("alertDismissed", {
  detail: {
    type: "alertDismissed",
    dismissed: true,
    action: 'dismiss',
  },
});

export const AlertAction = new CustomEvent("alertAction", {
  detail: {
    type: "alertAction",
    dismissed: false,
    action: null,
  },
});

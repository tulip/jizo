export const FilePickerChangedEvent = new CustomEvent("filePickerChanged", {
    detail: {
        type: "FilePickerChanged",
        files: null,
    },
});
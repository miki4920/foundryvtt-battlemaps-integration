Hooks.once('init', async function() {
    game.settings.register("foundryvtt-battlemaps-integration", "mapDirectory", {
        name: "Download Directory",
        hint: "Set a Directory for downloaded Battlemaps",
        scope: "world",
        config: true,
        type: String,
        filePicker: "folder",
        default: "",
    });
});


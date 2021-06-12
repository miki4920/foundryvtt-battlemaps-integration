Hooks.once('init', async function() {
    game.settings.register("foundryvtt-battlemaps-integration", "mapDirectory", {
        name: "Download Directory",
        hint: "Set a Directory for downloaded Battlemaps",
        scope: "client",
        config: true,
        type: String,
        filePicker: true,
        default: "",
    });
});


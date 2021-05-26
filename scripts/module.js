import DirectoryPicker from "./lib/directory_picker.js";

Hooks.once('init', async function() {
    game.settings.register("foundryvtt-battlemaps-integration", "mapDirectory", {
        name: "Download Directory",
        hint: "Set a Directory for downloaded Battlemaps",
        scope: "world",
        config: true,
        type: DirectoryPicker.Directory,
        default: "",
    });
});

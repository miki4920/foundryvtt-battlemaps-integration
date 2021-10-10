function fetch_data(method, url, response_type) {
    return new Promise(function (resolve, reject) {
        let xml_http = new XMLHttpRequest();
        xml_http.open(method, url);
        xml_http.responseType = response_type
        xml_http.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xml_http);
            } else {
                reject({
                    status: this.status,
                    statusText: xml_http.statusText
                });
            }
        };
        xml_http.onerror = function () {
            reject({
                status: this.status,
                statusText: xml_http.statusText
            });
        };
        xml_http.send();
    });
}

async function upload_image(image_path, image) {
    await FilePicker.upload("data", image_path, image);
}

function set_values(image, metadata, image_path) {
    image_path = image_path + "/" + metadata["name"] + "." + metadata["extension"];
    image_path = encodeURIComponent(image_path.trim());
    console.log(image_path)
    document.getElementsByName(`img`)[0].value = image_path;

    let width = document.getElementsByName(`width`)[0];
    let height = document.getElementsByName(`height`)[0];
    let img = new Image();
    img.src = window.URL.createObjectURL(image);
    img.onload = () => {
        width.value = img.naturalWidth;
        height.value = img.naturalHeight;
    }

    let grid_size = document.getElementsByName(`grid`)[0];
    grid_size.value = 70;
}

async function create_scene() {
    const image_path = game.settings.get("foundryvtt-battlemaps-integration", "mapDirectory");
    let metadata_link = document.getElementById("battlemap_fetch").value;
    if(metadata_link.length === 0) {
        ui.notifications.error(`You must provide a link to the map before fetching it`);
    }
    else {
        let metadata = await fetch_data("GET", metadata_link, "json");
        metadata = metadata.response;
        let filename = metadata["name"];
        let image_extension = metadata["extension"] === "jpg" ? "jpeg" : metadata["extension"]
        let image = await fetch_data("GET", "http://" + metadata_link.split("/")[2] + "/" +metadata["path"], "blob")
        image = image.response;
        image = new File([image], filename + "." + metadata["extension"], {type: "image/"+image_extension});
        await upload_image(image_path, image);
        set_values(image, metadata, image_path);
    }
}

Hooks.on("renderSceneConfig", (sheet, html) => {
    let position_element = html.find(`input[name="navName"]`).parent().parent()
    position_element.after(`
    <div class="form-group">
        <label>Battlemap Link</label>
        <div class="form-fields">
            <button type="button" class="file-picker" title="Fetch Data" tabindex="-1" onclick="create_scene()">
                <i class="fas fa-globe fa-fw"></i>
            </button>
            <input class="image" type="text" id="battlemap_fetch" placeholder="Link with Metadata" value="">
        </div>
    </div>`)
})
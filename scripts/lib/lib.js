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

function get_extension(file_name) {
    let image_extension = file_name.split(".");
    image_extension = image_extension[image_extension.length-1];
    image_extension = ((image_extension === "jpg") ? "jpeg" : image_extension);
    return image_extension;
}

async function upload_image(image_path, image) {
    await FilePicker.upload("data", image_path, image);
}

function set_values(image, metadata, image_path) {
    image_path = image_path + metadata["file_name"];
    image_path = encodeURIComponent(image_path.trim());
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
    console.log(metadata["grid_size"]);
    if(metadata["grid_size"] && metadata["grid_size"] >= 50) {
        grid_size.value = metadata["grid_size"];
    }
    else if (metadata["grid_size"]) {
        ui.notifications.error(`Grid Size of this map was smaller than 50px`);
        grid_size.value = 0;
    }
}

async function create_scene() {
    const image_path = "/maps/";
    let metadata_link = document.getElementById("battlemap_fetch").value;
    if(metadata_link.length === 0) {
        ui.notifications.error(`You must provide a link to the map before fetching it`);
    }
    else {
        let metadata = await fetch_data("GET", metadata_link, "json");
        metadata = metadata.response;
        let filename = metadata["file_name"];
        let image_extension = get_extension(filename)
        let image = await fetch_data("GET", metadata["file_link"], "blob")
        image = image.response;
        image = new File([image], filename, {type: "image/"+image_extension});
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
class DirectoryPicker extends FilePicker {
    constructor(options = {}) {
        super(options);
    }

    _onSubmit(event) {
        event.preventDefault();
        this.field.value = event.target.target.value;
        this.close();
    }

    static Directory(val) {
        return val == null ? '' : String(val);
    }

    static parse(inStr) {
        const str = inStr ?? ''
        return {
            activeSource: "data",
            bucket: null,
            current: str,
        };
    }

    static process_html(html) {
        $(html)
            .find(`input[data-dtype="Directory"]`)
            .each(function () {
                if (!$(this).next().length) {
                    console.log("Adding Picker Button");
                    let picker = new DirectoryPicker({
                        field: $(this)[0],
                        ...DirectoryPicker.parse(this.value),
                    });
                    let pickerButton = $(
                        '<button type="button" class="file-picker" data-type="imagevideo" data-target="img" title="Pick directory"><i class="fas fa-file-import fa-fw"></i></button>'
                    );
                    pickerButton.on("click", function () {
                        picker.render(true);
                    });
                    $(this).parent().append(pickerButton);
                }
            });
    }
}

Hooks.on("renderSettingsConfig", (app, html, user) => {
    DirectoryPicker.process_html(html);
});

export default DirectoryPicker;

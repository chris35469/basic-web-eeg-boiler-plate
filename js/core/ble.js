

export const BLE = class {
    constructor(callback, connect_button_id="bluetooth") {
        this.device = new Blue.BCIDevice(callback);

        // Connect Events
        document.getElementById(connect_button_id).onclick = function (e) {
            this.connect()
        }.bind(this);
    }

    connect() {
        this.device.connect()
    }

    get_device() {
        return this.device
    }
}
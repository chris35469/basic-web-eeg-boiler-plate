import { SessionLineGraph } from "./session.js"

export const Events = class {
    constructor(device, ble) {
        this.device = device
        this.ble = ble
        this.session_graph = {}

        // Local store
        this.create_event("start_local_store", this.start_local_store.bind(this))
    }

    create_event(id, _func) {
        document.getElementById(id).onclick = _func
    }   

    start_local_store() {
        this.device.toggle_local_recording()
        if(this.device.is_local_recording) {
            document.querySelector(`#status`).innerHTML = "recording"
            document.querySelector(`#graph`).style.display = "block"
            document.querySelector(`#session_graph`).style.display = "none"
            this.device.data.clear_data()
        } else {
            document.querySelector(`#status`).innerHTML = ""
            document.querySelector(`#graph`).style.display = "none"
            document.querySelector(`#session_graph`).style.display = "block"
            
            let data = this.device.data.get_data()
            document.querySelector(`#session_graph`).innerHTML = ""
            this.session_graph = new SessionLineGraph(data, window.innerWidth,  window.innerWidth * 0.6, "session_graph")
        }
    }

}
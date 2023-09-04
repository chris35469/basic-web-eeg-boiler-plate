import { BLE } from "./ble.js"
import { Signal } from "./signal.js"
import { Muse } from "./muse.js"
import { Events } from "./events.js"

let main = function(){
    let muse_visualizer = new Muse("graph", window.innerWidth, window.innerWidth * 0.6, 256 * 2, 1)
    let graph_handlers = {"muse": muse_visualizer}
    let signal_handler = new Signal(graph_handlers)
    let ble = new BLE(signal_handler.add_data.bind(signal_handler))
    let events = new Events(muse_visualizer, ble)
}

main()

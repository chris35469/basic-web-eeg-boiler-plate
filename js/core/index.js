import { BLE } from "./ble.js"
import { Signal } from "./signal.js"
import { Muse } from "./muse.js"


let main = function(){
    let muse_visualizer = new Muse("graph", window.innerWidth, 600, 256 * 2, 1)
    let graph_handlers = {"muse": muse_visualizer}
    let signal_handler = new Signal(graph_handlers)
    let ble = new BLE(signal_handler.add_data.bind(signal_handler))
}

main()


import { Data } from "./data.js";
import { MuseSeries } from "./series_muse.js";

export const Muse = class {
    constructor(div_id, width, height, max_data, time_interval=1) {
        this.width = width
        this.height = height
        this.sample_freq = 256
        this.graph = new Rickshaw.Graph({
            element: document.querySelector(`#${div_id}`), 
            width: width, 
            height: height, 
            renderer: 'line',
            series: MuseSeries(max_data, time_interval),
        });
        this.isChannelDataReady = {2: false, 16:false, 3: false, 17: false}
        this.recent_data_temp = {}
        this.is_active = true
        this.is_local_recording = false
        this.data = new Data("muse", {2: "TP9", 3: "TP10", 17:"AF8", 16:"AF7"}, this.sample_freq)
        //this.init_events()
    }

    toggle_local_recording() {
        this.is_local_recording = !this.is_local_recording
        //console.log(this.is_local_recording)
    }

    /*
    init_events() {
         // Start Local Store
         document.getElementById("start_local_store").onclick = function (e) {
            this.is_local_recording = !this.is_local_recording

            if(this.is_local_recording) {
                document.querySelector(`#status`).innerHTML = "recording"
                document.querySelector(`#graph`).style.display = "block"
                this.data.clear_data()
            } else {
                document.querySelector(`#status`).innerHTML = ""
                document.querySelector(`#graph`).style.display = "none"
                console.log(this.data.get_data())
            }

        }.bind(this);
    }
    */

    get_graph() {
        return this.graph
    }

    add_data(data, electrode) {
        this.recent_data_temp[electrode] = data
        this.isChannelDataReady[electrode] = true
        this.update_graph()
    }

    reset_channel_status() {
        this.isChannelDataReady = {2: false, 16:false, 3: false, 17: false}
    }

    // Checks to see if all channels have new data
    is_refresh_ready() {
        return this.isChannelDataReady[2] && this.isChannelDataReady[3] && this.isChannelDataReady[16] && this.isChannelDataReady[17]
    }

    get_formatted_data(i) {
        return {
            TP9: this.recent_data_temp[2][i] + (this.height * .1), 
            TP10: this.recent_data_temp[3][i]+ (this.height * .2), 
            AF8: this.recent_data_temp[17][i] + (this.height * .3), 
            AF7: this.recent_data_temp[16][i] + (this.height * .4)
        }
    }

    // Update graph visualizer if all channels hold new data
    update_graph() {
        if(this.is_refresh_ready() && this.is_active) {

            this.reset_channel_status()

            // Render recent data for all channels
            for (let i in this.recent_data_temp[2]) {
                this.graph.series.addData(this.get_formatted_data(i))
                this.graph.render()
            }

            // record data session
            if(this.is_local_recording) {
                this.data.add_data(this.recent_data_temp)
            }

            // Flush old data
            for (let i in this.recent_data_temp) {
                this.recent_data_temp[i] = []
            }
        }
    }
}
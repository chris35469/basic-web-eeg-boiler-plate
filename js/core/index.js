class BLECapture{
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

class PreProcess {
    constructor(low_freq=7, high_freq=30, filter_order=128, sample_rate=256) {

        firCalculator = new Fili.FirCoeffs();

        coeffs = firCalculator.bandpass({
          order: filter_order,
          Fs: sample_rate,
          F1: low_freq,
          F2: high_freq,
        });

        this.filter = new Fili.FirFilter(coeffs);
    }

    filter(raw_signal) {
        return this.filter.simulate(raw_signal);
    }
}

class MuseVisualizer {
    constructor(div_id, width, height, max_data, time_interval=1) {
        this.width = width
        this.height = height
        this.graph = new Rickshaw.Graph( {
            element: document.querySelector(`#${div_id}`), 
            width: width, 
            height: height, 
            renderer: 'line',
            series: new Rickshaw.Series.FixedDuration([
                { name: 'TP9', color: 'steelblue' }, 
                { name: 'TP10', color: 'lightblue' }, 
                { name: 'AF7', color: 'gold' }, 
                { name: 'AF8', color: 'red' }
            
            ], undefined, {
                timeInterval: time_interval,
                maxDataPoints: max_data,
                timeBase: new Date().getTime() / 1000
            }) 
        });
        this.isChannelDataReady = {2: false, 16:false, 3: false, 17: false}
        this.recent_data_temp = {}
        this.is_active = true
    }

    get_graph() {
        return this.graph
    }

    add_data(data, electrode) {
        // format data if required
        //console.log("muse vis", data)

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

            // Flush old data
            for (let i in this.recent_data_temp) {
                this.recent_data_temp[i] = []
            }
        }
    }
}

class SignalHandler{
    constructor(graph_handlers, buffer_size=256) {
        this.graph_handlers = graph_handlers
        this.channels = {}
        this.BUFFER_SIZE = buffer_size
    }

    add_data(sample) {
        let { electrode, data } = sample;
        if (!this.channels[electrode]) {
            this.channels[electrode] = [];
            //console.log(electrode)
        }

         // Add all samples to current array
        for (let i in data) {
            if (this.channels[electrode].length > this.BUFFER_SIZE - 1) {
                this.channels[electrode].shift();
            }
    
            this.channels[electrode].push(data[i]);
        }
        
        this.update_graph_handlers(data, electrode)
    }

    // Update all visualizers with new data
    update_graph_handlers(data, electrode) {
        for (let i in this.graph_handlers) {
            this.graph_handlers[i].add_data(data, electrode)
        }
    }

    get_data() {}
}

let main = function(){
    let muse_visualizer = new MuseVisualizer("graph", window.innerWidth, 600, 256 * 2, 1)
    let graph_handlers = {"muse": muse_visualizer}
    let signal_handler = new SignalHandler(graph_handlers)
    let BLE = new BLECapture(signal_handler.add_data.bind(signal_handler))
}

main()


/*
class person {
    constructor(name) {
        this.name = name;
    }
    // method to return the string
    toString() {
        return (`Name of person: ${this.name}`);
    }
}
class student extends person {
    constructor(name, id) {
        // super keyword for calling the above
        // class constructor
        super(name);
        this.id = id;
    }
    toString() {
        return (`${super.toString()},
        Student ID: ${this.id}`);
    }
}
let student1 = new student('Mukul', 22);
console.log(student1.toString());
*/
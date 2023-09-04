export const Muse = class {
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
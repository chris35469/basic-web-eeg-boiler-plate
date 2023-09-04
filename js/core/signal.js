
export const Signal = class {
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
/** Class used to manage physiological data
 * @class
 */

var Physio = function () {
  this.buffer = [];

  // Set up filter
  sampleRate = 250;
  lowFreq = 7;
  highFreq = 30;
  filterOrder = 128;
  firCalculator = new Fili.FirCoeffs();
  coeffs = firCalculator.bandpass({
    order: filterOrder,
    Fs: sampleRate,
    F1: lowFreq,
    F2: highFreq,
  });
  filter = new Fili.FirFilter(coeffs);

  channels = {};
  window.psd = {};
  window.bands = {};
  tempSeriesData = {};
  isChannelDataReady = { 2: false, 16: false, 3: false, 17: false };

  this.SECONDS = 4;
  window.channelSampleCount = {};
  this.BUFFER_SIZE = this.SECONDS * 256;
  this.isConnected = false;

  this.addData = (sample, channel) => {
    if (!channels[channel]) {
      channels[channel] = [];
      window.channelSampleCount[channel] = 0;
    }

    // Add all samples to current array
    for (i in sample) {
      if (channels[channel].length > this.BUFFER_SIZE - 1) {
        channels[channel].shift();
      }

      channels[channel].push(sample[i]);
      window.channelSampleCount[channel] =
        window.channelSampleCount[channel] + 1;
    }

    tempSeriesData[channel] = sample;
    isChannelDataReady[channel] = true;
  };

  this.getLenght = () => {
    return this.buffer.length;
  };

  this.getBuffer = () => {
    return this.buffer;
  };

  psdToPlotPSD = function (psd, max) {
    //console.log(psdToPlotPSD)
    out = [];
    for (i in psd) {
      //console.log(psd[i])
      out.push({ x: parseInt(i), y: psd[i] });
      if (i > max) {
        return out;
      }
    }
  };

  var getBandPower = (channel, band) => {
    if (!channels[channel]) return 0;

    if (channels[channel].length < this.BUFFER_SIZE) {
      return 0;
    }

    signal = filter.simulate(channels[channel]);
    let psd = window.bci.signal.getPSD(this.BUFFER_SIZE, channels[channel]);

    psd.shift();
    window.psd[channel] = psd;

    let bp = window.bci.signal.getBandPower(this.BUFFER_SIZE, psd, 256, band);

    return bp;
  };

  var getRelativeBandPower = (channel, band) => {
    var target = getBandPower(channel, band);
    var delta = getBandPower(channel, "delta");
    var theta = getBandPower(channel, "theta");
    var alpha = getBandPower(channel, "alpha");
    var beta = getBandPower(channel, "beta");
    var gamma = getBandPower(channel, "beta");
    return target / (delta + theta + alpha + beta + gamma);
  };

  this.device = new Blue.BCIDevice((sample) => {
    console.log(sample)
    let { electrode, data } = sample;
    this.addData(data, electrode);
    //window.relativeBeta = getRelativeBandPower(2, "beta");
  });

  this.start = () => {
    this.device.connect();
  };

  return this;
};

document.getElementById("bluetooth").onclick = function (e) {
  var physio = new Physio();
  physio.start();
};

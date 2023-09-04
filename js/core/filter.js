

export const Filter = class {
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
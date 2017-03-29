/*******************************
 *  Puck.js Ruuvitag Scanner   *
 *******************************/

/**
 * RuuviTag class
 */
function RuuviTag(macAddress, name) {
    this.macAddress = macAddress;
    this.name = name;
}


/**
 * RuuviTagScanner object registering to global scope
 */
var RuuviTagScanner = (function() {

    var _running = false;
    var _intervals = [];

    function _base64ToArrayBuffer(base64) {
        var binary_string = atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function _getTemperature(decoded) {
        var temp = (decoded[2] & 127) + decoded[3] / 100;
        var sign = (decoded[2] >> 7) & 1;
        if (sign === 0) {
            return temp;
        }
        return -1 * temp;
    }

    function _getHumidity(decoded) {
        return decoded[1] * 0.5;
    }

    function _getPressure(decoded) {
        pres = ((decoded[4] << 8) + decoded[5]) + 50000;
        return pres / 100;
    }

    return {
        'startScanning': function(callback, ruuvitags, scanInterval) {
            if (callback === undefined) {
                console.log('No callback function defined in RuuvitagScanner.startScanning(callback) method!');
                return;
            }
            if (_running) {
                console.log('Scan is already running, please call RuuvitagScanner.stopScanning() to stop current scan!');
                return;
            }
            if (scanInterval === undefined) {
                scanInterval = 2000;
            }

            console.log('scanning for ruuvitags...');

            if (ruuvitags === undefined) {
                ruuvitags = [];
            }
            _running = true;

            _intervals.push(setInterval(function() {
                LED3.write(true);
                NRF.findDevices(function(devices) {
                    LED3.write(false);
                    for (var i = 0; i < devices.length; i++) {
                        var sensor = devices[i];
                        var macAddress = sensor.id.substring(0, 17);
                        if (macAddress !== undefined) {
                            var decodedDataString = String.fromCharCode.apply(null, sensor.data);
                            var encoded = decodedDataString.substr(decodedDataString.indexOf('#') + 1, decodedDataString.length);
                            var decoded = _base64ToArrayBuffer(encoded);
                            var temperature = _getTemperature(decoded);
                            var humidity = _getHumidity(decoded);
                            var pressure = _getPressure(decoded);
                            var ruuvitagsFiltered = ruuvitags.filter(function(r) { return r.macAddress === macAddress; });
                            var ruuvitag = ruuvitagsFiltered.length === 1 ? ruuvitagsFiltered[0] : new RuuviTag(macAddress, macAddress);
                            ruuvitag.temperature = temperature;
                            ruuvitag.humidity = humidity;
                            ruuvitag.pressure = pressure;
                            if (ruuvitagsFiltered.length === 0) {
                                ruuvitags.push(ruuvitag);
                            }
                        }
                    }
                    callback(ruuvitags);
                }, 1000);
            }, scanInterval));
        },
        'stopScanning': function() {
            console.log('stopping...');
            _running = false;
            for (var i = 0; i < _intervals.length; i++) {
                clearInterval(_intervals[i]);
            }
        },
        'isScanning': function() {
            return _running;
        }
    };
})();

// ______MAIN___________ 

//var ruuvitags = [new RuuviTag('e4:b0:90:c7:12:a9', 'RuuviTag#1'), new RuuviTag('f6:8c:ac:03:a6:73', 'RuuviTag#2')];
//RuuviTagScanner.startScanning(function(tags) { console.log(tags); }, ruuvitags, 5000);

RuuviTagScanner.startScanning(function(tags) { console.log(tags); });
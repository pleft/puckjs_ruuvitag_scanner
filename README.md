# puckjs_ruuvitag_scanner
Puck.js scanner for Ruuvitag beacons

Use your [Puck.js](http://www.puck-js.com/) bluetooth beacon to scan and get info from nearby [Ruuvitag](https://ruuvitag.com/) bluetooth beacons.

## Hardware prerequisites
As the name of the project implies, you need to have one Puck.js beacon and one or more Ruuvitag beacons.

## Instructions
* Have your Puck.js and Ruuvitag beacons in range.
* Upload file PuckjsRuuvitagScanner.js in you Puck.js beacon.
* Once uploaded, Puck.js will start to scan for Ruuvitag beacons and display info about them (Blue led will flash each time a scan is taking place).

The command to start scanning and show info is:

`RuuviTagScanner.startScanning(function(tags) { console.log(tags); });`

Output will have the format (if two Ruuvitag beacons are in range):

```[
  RuuviTag {
    "macAddress": "f6:8c:ac:03:a6:73",
    "name": "f6:8c:ac:03:a6:73",
    "temperature": 21, 
    "humidity": 52, 
    "pressure": 996 },
  RuuviTag {
    "macAddress": "e4:b0:90:c7:12:a9",
    "name": "e4:b0:90:c7:12:a9",
    "temperature": 21, 
    "humidity": 52, 
    "pressure": 996 }
 ]
```

Of course the callback function in `startScanning` method can be changed as per user desires.

## Acknowledgements
Temperature, humidity and pressure data decoding algorithms have been sourced from another great github project [ruuvitag-sensor](https://github.com/ttu/ruuvitag-sensor)

# Plane Tracker
**Try it yourself!**: [planes.tzantchev.com](http://planes.tzantchev.com)

My plane tracker is an interactive website where you can find more information about the planes flying near your!

# How does this work?
When you enter a location, the Google Maps Geocoding API is used to determine the GPS coordinates of this location. Then, the OpenSky Network API (more info below) is used to retrieve data for all planes located in the skies near the entered location.

## OpenSky Network
This project uses data provided by [The OpenSky Network](https://opensky-network.org) API - *Matthias Schäfer, Martin Strohmeier, Vincent Lenders, Ivan Martinovic and Matthias Wilhelm.
"Bringing Up OpenSky: A Large-scale ADS-B Sensor Network for Research".
In Proceedings of the 13th IEEE/ACM International Symposium on Information Processing in Sensor Networks (IPSN), pages 83-94, April 2014.*
cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    },
    {
        "file": "plugins/plugin.google.maps/www/googlemaps-cdv-plugin.js",
        "id": "plugin.google.maps.phonegap-googlemaps-plugin",
        "clobbers": [
            "plugin.google.maps"
        ]
    },
    {
        "file": "plugins/plugin.http.request/www/http-request.js",
        "id": "plugin.http.request.phonegap-http-requst",
        "clobbers": [
            "cordova.plugins.http-request"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "cordova-plugin-crosswalk-webview": "1.2.0",
    "plugin.google.maps": "1.2.5",
    "plugin.http.request": "1.0.4",
    "com.google.playservices": "23.0.0"
}
// BOTTOM OF METADATA
});
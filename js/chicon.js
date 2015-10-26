
var favicon = $("link[rel$=icon]");
 
// ServiceName
var serviceIndex = -1
var service = location.href.match(/aws.amazon.com\/([a-z0-9]*)\//);
if (service != null) {
    serviceIndex = $.inArray(service[1], services);
}

// RegionName
var regionIco = null
var region = location.href.match(/region=([^#$]*)/);
if (region != null) {
    regionIco = regions[region[1]];
}

console.debug('Service: ' + service + '(' + serviceIndex + ')'+ ', Region: ' + region);

if (serviceIndex >= 0) {
    UpdateIcon(serviceIndex, regionIco);
}

function UpdateIcon(serviceIndex) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 32;
    var ctx = canvas.getContext('2d');

    // Service Icon
    var svcImage = new Image();
    svcImage.crossOrigin = 'Anonymous';
    svcImage.onload = function() {
        ctx.drawImage(svcImage, serviceIndex * 32, 59.5, 32, 32, 0, 0, 32, 32);
        
        // Rewrite favicon
        favicon.remove();
        $('meta:last')
            .after($(document.createElement('link'))
            .attr('rel', 'shortcut icon')
            .attr('type', 'image/ico')
            .attr('href', canvas.toDataURL()));
    };
    svcImage.src = chrome.extension.getURL('images/sprite.png');

    // Region Icon
    if (regionIco != null) {
        var rgnImage = new Image();
        rgnImage.crossOrigin = 'Anonymous';
        rgnImage.onload = function() {
            ctx.globalCompositeOperation = 'destination-over';
            ctx.drawImage(rgnImage, 16, 16, 16, 16);
        };
        rgnImage.src = chrome.extension.getURL('images/' + regionIco);
    }
}
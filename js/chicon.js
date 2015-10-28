
var loaders = [];
var images = [];

var canvas = document.createElement('canvas');
canvas.width = canvas.height = 32;
var context = canvas.getContext('2d');

// ServiceName
var serviceIndex = -1
var service = location.href.match(/aws.amazon.com\/([a-z0-9]*)\//);
if (service != null) {
    var serviceIndex = $.inArray(service[1], services);
    loaders.push(loadSprite(chrome.extension.getURL('images/sprite.png'), 0, serviceIndex));
}

if (serviceIndex != -1) {
    // RegionName
    var region = location.href.match(/region=([^#$]*)/);
    if (region != null) {
        var regionIco = regions[region[1]];
        loaders.push(loadSprite(chrome.extension.getURL('images/' + regionIco), 1));
    }

    console.debug('Service: ' + service + '(' + serviceIndex + ')'+ ', Region: ' + region);

    $.when.apply(null, loaders).done(function() {
        // callback when everything was loaded
        updateFavicon(images);
    })
} 

function loadSprite(src, index, serviceIndex) {
    var points = [
        [serviceIndex * 32, 59.5, 32, 32,  0,  0, 32, 32],
        [                0,    0, 16, 16, 16, 16, 16, 16]];
    var p = points[index];

    var deferred = $.Deferred();
    var image = new Image();

    image.crossOrigin = 'Anonymous';
    image.onload = function() {
        if (index != 0) {
            // fillArc
            context.fillStyle = '#FFFFFF';
            context.arc(p[4] + p[4] / 2, p[5] + p[5] / 2, p[6] / 2 + 1, 0, Math.PI * 2, true);
            context.fill();
        }

        context.drawImage(image, p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);

        var temp = new Image();
        temp.src = canvas.toDataURL();

        images[index] = temp;
        deferred.resolve();
    };
    image.src = src;

    return deferred.promise();
}

function updateFavicon(images) {
    $.each(images, function(i, v) {
        context.drawImage(v, 0, 0);
    })

    var favicon = $("link[rel$=icon]");
    favicon.remove();
    $('meta:last')
            .after($(document.createElement('link'))
            .attr('rel', 'shortcut icon')
            .attr('type', 'image/ico')
            .attr('href', canvas.toDataURL()));
}

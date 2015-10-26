
var favicon = $("link[rel$=icon]");

var images = []
images.push(chrome.extension.getURL('images/sprite.png'));

// ServiceName
var serviceIndex = -1
var service = location.href.match(/aws.amazon.com\/([a-z0-9]*)\//);
if (service != null) {
    serviceIndex = $.inArray(service[1], services);
}

// RegionName
var region = location.href.match(/region=([^#$]*)/);
if (region != null) {
    var regionIco = regions[region[1]];
    images.push(chrome.extension.getURL('images/' + regionIco));
}

console.debug('Service: ' + service + '(' + serviceIndex + ')'+ ', Region: ' + region);

if (serviceIndex >= 0) {
    UpdateIcon();
}


function UpdateIcon() {
    var points = [
        [serviceIndex * 32, 59.5, 32, 32,  0,  0, 32, 32],
        [                0,    0, 16, 16, 16, 16, 16, 16]];

    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 32;
    var context = canvas.getContext('2d');

    $.each(images, function(i, v) {
        var image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = v;

        image.onload = function() {
            if (i != 0) {
                context.globalCompositeOperation = 'destination-over';
            }

            var p = points[i];
            context.drawImage(image, p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7]);

            if (i == 0) {
                favicon.remove();
                $('meta:last')
                    .after($(document.createElement('link'))
                    .attr('rel', 'shortcut icon')
                    .attr('type', 'image/ico')
                    .attr('href', canvas.toDataURL()));
            }
        }
    })
}

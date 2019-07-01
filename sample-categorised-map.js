/**
 *  Categorised Map
 *  @author Jem Lopez
 *  @date 2018-01-03
 *  @framwork Drupal 8
*/

(function ($, Drupal, google) {

    Drupal.behaviors.maps = {
        attach: function (context, settings) {
            if ($.contains(context, document.getElementById('find-on-map'))) {
                doPinAddresses();
            }
        }
    }

    var map_styles = styledMapType; // imported from map-styles.js
    /**
     * 
     * @param {*} cat 
     *  Get Category and map it to show as google marker
     */
    function mapCategory(cat) {
        var catPin = '';

        switch (cat) {
            case 'After Dark':
                var catPin = 'pin-tours';
                break;
            case 'Arts & Culture':
                var catPin = 'pin-arts';
                break;
            case 'Attractions & Tours':
                var catPin = 'pin-attractions';
                break;
            case 'Family Fun':
                var catPin = 'pin-outdoors';
                break;
            case 'History & Heritage':
                var catPin = 'pin-heritage';
                break;
            case 'Shop & Pamper':
                var catPin = 'pin-shop';
                break;
            case 'Craft Beer & Cider':
                var catPin = 'pin-eatdrink';
                break;
            default:
                var catPin = "pin-attractions";
                break;
        }
        return catPin;
    }

    /**
     * 
     * @param {*} obj 
     * Make sure that the obj has filedir and category data
     */
    function getIconPath(obj) {

        if (obj) {
            var pin = mapCategory(obj.category);
            var dir = obj.filedir.split('/');
            var filedir = dir[2] || "";
            var fileurl = obj.filedir + "/images/" + filedir + "/icons/" + pin + '.png';
        }
        return fileurl;
    }
    /**
     * 
     * @param {*} obj // Obj from dom
     * @param {*} map // map id
     * @param {*} fileurl // base and them url
     * Convert address to lat and lng
     */
    function doGoogleMaps(obj, map, fileurl) {
        var geocoder = new google.maps.Geocoder();
        var address = obj.address;
        var places = [];
        // Convert address to lat and lng
        if (typeof address !== 'undefined' && typeof address == "string") {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // Marker
                    var marker = new google.maps.Marker({
                        map: map,
                        title: obj.name || "",
                        icon: {
                            url: fileurl,
                            labelOrigin: new google.maps.Point(26, 84)
                        },
                        position: results[0].geometry.location,
                    });


                    // Reset center @TODO: get the first one only
                    map.setCenter(marker.getPosition());
                    new putInfowindow(map, obj, marker);
                    places.push(results[0].geometry.location);
                }
            });
        }
    };

    /**
     *  Add pin addresses to the map
     */
    function doPinAddresses() {

        var options = {
            zoom: 13,
            center: { lat: -37.057367, lng: 144.218308 },
            mapTypeId: 'roadmap',
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
            },
            styles: map_styles
        };

        var findmap = new google.maps.Map(document.getElementById('find-on-map'), options);
        var $activity_address = $('.activity-address').data('ra-location');
        var $related_contents = $(".content-with-address > .related-articles__item");

        if ($related_contents) {
            // Loop the related content
            $related_contents.each(function (i, loc) {

                var location = $(loc).data('rc-location');

                if (typeof location.address !== 'undefined') {
                    // Get the icon
                    var icon = getIconPath(location);
                    // Get geoccoder address
                    new doGoogleMaps(location, findmap, icon);
                }
            });
        }

        if ($activity_address) {
            //  Get main address
            var icon = getIconPath($activity_address);
            new doGoogleMaps($activity_address, findmap, icon);

        }
    };

    /**
     * Infowindow -
     * data - obj
     * marker
     */
    function putInfowindow(maps, data, mark) {

        var infoWindows = [];
        var infoWindowString = '<div class="gmap__infowindow">' +
            '<div class="gmap__infowindow--img">' +
            '<img src="' + data.image + '" style="max-width: 274px">' +
            '</div>' +
            '<div class="gmap__infowindow--wrapper">' +
            '<h6 class="gmap__infowindow--title">' + data.title + ' </h6>' +
            '<span class="gmap__infowindow--address">' + data.address + ' </span>' +
            '</div>' +
            '</div>'
            ;

        var infowindow = new google.maps.InfoWindow({
            content: infoWindowString
        });

        infoWindows.push(infowindow);

        mark.addListener('click', function () {
            closeInfoWindows(infoWindows);
            infowindow.open(maps, mark);

        });

        // Event that closes the Info Window with a click on the map
        mark.addListener(maps, 'click', function () {
            infowindow.close();
        });

        // Custom info window
        google.maps.event.addListener(infowindow, 'domready', function () {
            var iwOuter = $('.gm-style-iw');
            iwOuter.prev().remove();

            var iwCloseBtn = iwOuter.next();
            var iwCloseBtn2 = iwCloseBtn.find('img');
        });
    }

    function closeInfoWindows(infoWindows) {
        for (var i = 0; i < infoWindows.length; i++) {
            infoWindows[i].close();
        }
    }

})(jQuery, Drupal, google);
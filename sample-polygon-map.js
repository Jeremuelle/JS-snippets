/** 
 *  Map Polygons 
 *  @author Jem Lopez
 *  @date 2018-01-03
 *  
*/

// If init map is used
if (document.getElementById('polygon-map')) {
    function initMap() { }

    $(() => {
        var initMap;
        var map;
        var polygons = [];
        var hover = 3;
        var normal = 1;

        // Initialize map
        var map = new google.maps.Map(document.getElementById('polygon-map'), {
            zoom: 9,
            center: { lat: -36.759696, lng: 144.280263 },
            mapTypeId: 'roadmap',
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
            },
            styles: map_styles
        });

        // Regions
        var iconPath = '/assets/img/polygon-map/';
        var regions = [
            {
                loc: 'sample1',
                color: '#a54376',
                path: $sample1_coor,
                icon: iconPath + 'pin-sample1.png',
                position: new google.maps.LatLng(-36.742871, 144.320808),
            },
            {
                loc: 'sample2',
                color: '#0d611b',
                path: $sample2_coor,
                icon: iconPath + 'pin-sample2.png',
                position: new google.maps.LatLng(-36.517321, 143.847668),

            },
            {
                loc: 'sample3',
                color: '#83040b',
                path: $sample3_coor,
                icon: iconPath + 'pin-sample3.png',
                position: new google.maps.LatLng(-36.976089, 144.699014),
            },
            {
                loc: 'sample4',
                color: '#93423c',
                path: $sample4_coor,
                icon: iconPath + 'pin-sample4.png',
                position: new google.maps.LatLng(-37.056980, 143.823773),
            },
            {
                loc: 'sample5',
                color: '#006581',
                path: $sample5_coor,
                icon: iconPath + 'pin-sample5.png',
                position: new google.maps.LatLng(-37.025946, 144.154489),
            }
        ];

        // Marker, Polygons, hover
        regions.forEach((region) => {
            // Polygons
            var locations = region.loc;

            locations = new google.maps.Polygon({
                paths: region.path,
                strokeColor: region.color,
                strokeOpacity: 1,
                strokeWeight: normal,
                fillColor: region.color,
                fillOpacity: 0.05
            });
            // Parse polygons into maps
            locations.setMap(map);

            // On Hover 
            google.maps.event.addListener(locations, "mouseover", function () {
                this.setOptions({ strokeWeight: hover });
            });

            google.maps.event.addListener(locations, "mouseout", function () {
                this.setOptions({ strokeWeight: normal });
            });
            // Parse names to map function
            polygons[region.loc] = locations;

            $(".js_hover").mouseover(function () {
                polygons[$(this).data("id")].setOptions({
                    strokeWeight: hover
                });
            });

            $(".js_hover").mouseleave(function () {
                polygons[$(this).data("id")].setOptions({
                    strokeWeight: normal
                });
            });

            // Marker
            var marker = new google.maps.Marker({
                position: region.position,
                icon: region.icon,
                map: map,
            });
        });
    });
}
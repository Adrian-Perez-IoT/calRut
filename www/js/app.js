var coordenadas;
var directionsService, directionsDisplay, vm, map;
var app = {
    initialize: function () {
        //   this.bindEvents();
        document.addEventListener('deviceready', this.setupVue, false);
        var that = this;
        navigator.geolocation.getCurrentPosition(function (position) {
            that.mapInit(position)
        }, function (error) {
            console.log(error)
        })
    },
    mapInit: function (position) {
        //obtenemos la posicion actual del dispositivo movil en formato latitud y longitd
        vm.positionCurrent = { lat: position.coords.latitude, lng: position.coords.longitude };
        //alert("La posicion actual es:",  this.positionCurrent.text);
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        //creamos un mapa y lo centramos en la posicion del dispositivo movil
        vm.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: vm.positionCurrent
        });
        var latLong = new google.maps.LatLng(vm.positionCurrent.lat, vm.positionCurrent.lng);
        var marker = new google.maps.Marker({
            position: latLong
        });
        marker.setMap(vm.map);
        vm.map.setZoom(15);
        vm.map.setCenter(marker.getPosition());
        //seteamos las propiedades en nuestro mapa
        //calculamos y visualizamos la ruta optima
    },
    setupVue: function () {
        vm = new Vue({
            el: "#vue-instance",
            data: {
                myTitulo: 'Calculo de la ruta mas corta',
                map: {},
                positionCurrent: {},
                markets: [],
                directionsService: {},
                directionsDisplay: {}
            },
            methods: {
                generarQR: function () {
                    //alert('creo un codigoQR con coordenadas geograficas (latitud y longitud)');
                    cordova.plugins.barcodeScanner.encode(
                        cordova.plugins.barcodeScanner.Encode.TEXT_TYPE,  //codifica en tipo de dato texto
                        "{lat:-24.184161848468367, lng:-65.3031125664711}", //coordenadas de pinnar 
                        function (success) {
                            console.log("encode success: " + success);
                        },
                        function (fail) {
                            alert("encoding failed: " + fail);
                        }
                    );
                },
                scanQR: function () {
                    //escaneo y guardo la informacion en un vector 
                    var markets = vm.markets;
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            if (!result.cancelled) {
                                if (result.format == "QR_CODE") {
                                    console.log('obtenemos dato tipo texto con latitud y longitud:' + result.text);
                                    //saveCoordenada(result);
                                    var marker = JSON.parse(result.text);
                                    vm.markets.push(JSON.parse(result.text))
                                    coordenadas = coordenadas + result.text;
                                    console.log(vm.markets)
                                    vm.addMarket(marker)
                                    console.log('las coordenadas guardadas son:' + coordenadas);
                                }
                            }
                        },
                        function (error) {
                            alert("Scanning failed: " + error);
                        }
                    );
                },
                addMarket: function (marker) {
                    var latLong = new google.maps.LatLng(marker.lat, marker.lng);

                    var marker = new google.maps.Marker({
                        position: latLong,
                        map: vm.map,
                        zIndex: vm.markets.lenght++
                    });
                     vm.map.setCenter(marker.getPosition());
                },
                calcular: function () {
                    directionsDisplay.setMap(vm.map);

                    var waypts = [];
                    //coordenadas pinnar
                  /*   waypts.push({
                        location: { lat: -24.184161848468367, lng: -65.3031125664711 },
                        stopover: true
                    });
                    //coordenadas casa de gobierno
                    waypts.push({
                        location: { lat: -24.1906376, lng: -65.3060652 },
                        stopover: true
                    });
                    //coordenadas de BigMall
                    waypts.push({
                        location: { lat: -24.1930547, lng: -65.3045392 },
                        stopover: true
                    }); */
                    for(var i = 0; i < vm.markets.length; i++) {
                        var market = vm.markets[i]
                        waypts.push({
                            location: { lat: market.lat, lng: market.lng },
                            stopover: true
                        })
                    }
                    directionsService.route({
                        origin: vm.positionCurrent,
                        destination: vm.positionCurrent,
                        waypoints: waypts,
                        optimizeWaypoints: true,
                        travelMode: 'DRIVING'
                    },
                        function (response, status) {
                            if (status === 'OK') {
                                directionsDisplay.setDirections(response);
                                var route = response.routes[0];
                            } else {
                                window.alert('Directions request failed due to ' + status);
                            }
                        });

                },
                testNavInterno: function () {
                    //
                    var ref = window.open('https://www.google.com', '_blank', 'location=yes');
                    ref.addEventListener('loadstart', function (event) { alert('start: ' + event.url); });
                    ref.addEventListener('loadstop', function (event) { alert('stop: ' + event.url); });
                    ref.addEventListener('loaderror', function (event) { alert('error: ' + event.message); });
                    ref.addEventListener('exit', function (event) { alert(event.type); });
                },
            }
        });
        cordova.plugins.diagnostic.isLocationEnabled(successCallback, errorCallback);
        function successCallback(res) {
            console.log("Location is " + (res ? "Enabled" : "not Enabled"));
            !res ? cordova.plugins.diagnostic.switchToLocationSettings() : '';
        }
        function errorCallback(err) {
            console.log("Error: " + JSON.stringify(err));
        }
    }
};

app.initialize();


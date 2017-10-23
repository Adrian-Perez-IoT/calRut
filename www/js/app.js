var coordenadas;
var app = {
    initialize: function () {
        //   this.bindEvents();

        document.addEventListener('deviceready', this.setupVue, false);

    },

    setupVue: function () {
        var vm = new Vue({
            el: "#vue-instance",
            data: {
                titulo: 'Calculo de la ruta mas corta',


            },

            methods: {
                generarQR: function () {
                    //alert('creo un codigoQR con coordenadas geograficas (latitud y longitud)');
                    cordova.plugins.barcodeScanner.encode(
                        cordova.plugins.barcodeScanner.Encode.TEXT_TYPE,  //codifica en tipo de dato texto
                        "lat:-24.184161848468367, long:-65.3031125664711", //coordenadas de pinnar 
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
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            if (!result.cancelled) {
                                if (result.format == "QR_CODE") {
                                    console.log('obtenemos dato tipo texto con latitud y longitud:' + result.text);
                                    //saveCoordenada(result);
                                    coordenadas = coordenadas + result.text;
                                    console.log('las coordenadas guardadas son:' + coordenadas);
                                }
                            }
                        },
                        function (error) {
                            alert("Scanning failed: " + error);
                        }
                    );

                },
                testNavInterno: function () {
                    //
                    var ref = window.open('https://www.google.com', '_blank', 'location=yes');
                    ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
                    ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
                    ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
                    ref.addEventListener('exit', function(event) { alert(event.type); });

                },
            }
        });
    }
};

app.initialize();


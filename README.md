# CALRUT - 

#Cordova CalRut aplicacion para Android - version 1 

Esta aplicacion permite calcular la ruta optima a través de distintos puntos geograficos, utilizando el servicio de circulacion para automoviles.  Es decir, para optimizar la ruta se reorganiza los puntos geograficos de manera eficaz.  El tiempo de viaje es el factor principal que se optimiza para decidir la ruta mas eficiente.  

Los usuarios pueden agregar marcadores (posicion geografica) al mapa mediante el uso de un lector de codigo QR.  

#Limites y restricciones en los puntos geograficos

La máxima cantidad de puntos geograficos permitida es 23, más el origen y el destino.
Esta App necesita que se active la opcion GPS sensor del dispositivo movil para proporcionar información sobre la ubicación como latitud/longitud actual.  Sólo se ejecuta en versiones android 4.4.2 o superior y que tengan una conexion a internet.

**Requisitos**

**Licencia**


# Instalacion 
```
$ npm i 
```
# Instalacion de las plataformas y plugins
```
$ cordova prepare
```
# Construccion en Windows
```
npm run build-win
```
# Construccion en linux
```
npm run build-linux
```
# Desplegar la aplicacion en un dispositivo conectado
```
$cordova run android
```
FinoRandom
==========

FinoRandom es un script de [Greasemonkey] que hace que el `Random!` de
[FinoFilipino] se repita menos.

Básicamente hace lo siguiente:

![img/flujo-simple.png](img/flujo-simple.png?raw=true)

Instalación
-----------

1. Primero instalas [Greasemonkey], si no lo tienes.
2. Luego instalas el script con el botón de `Install` de
[FinoRandom en UserScripts]

Configuración
-------------

Al poner el ratón sobre el botón de `Random!` aparece encima el botón 
`Configurar FinoRandom.user.js`

Permite hacer lo siguiente:

* Editar el número de intentos que hace (por defecto 10), esto es, si hace ese
número de intentos y siempre recibe páginas que ya visitaste entonces desiste y
te lleva a dicha página.
* Editar el número de páginas que recuerda (por defecto 40), esto es, al llegar
al máximo va "olvidando" las mas antiguas.
* Eliminar historial de randoms visitados.

Código
------

* [FinoRandom en GitHub] \(script sin minimizar)
* [FinoRandom en UserScripts] \(script minimizado con [YUI Compressor])

Licencia
--------

[(BSD-2-Clause) Copyright (c) 2014 Elías Grande Cásedas](LICENSE?raw=true)

[Greasemonkey]:https://addons.mozilla.org/es/firefox/addon/greasemonkey/
[FinoFilipino]:http://finofilipino.org
[FinoRandom en GitHub]:https://github.com/EliasGrande/FinoRandom/blob/master/FinoRandom.user.js
[FinoRandom en UserScripts]:http://userscripts-mirror.org/scripts/show/446003
[YUI Compressor]:http://yui.github.io/yuicompressor/

FinoRandom
=========

FinoRandom es un script de Greasemonkey que hace que el `Random!` de [FinoFilipino](http://finofilipino.org) se repita menos.

Instalación
-----------

1. Primero instalas [Greasemonkey](https://addons.mozilla.org/es/firefox/addon/greasemonkey/), si no lo tienes.
2. Luego instalas el script con el botón de `Install` de [FinoRandom](http://userscripts.org/scripts/show/446003) en userscripts.org.

Configuración
-------------

Al poner el ratón sobre el botón de `Random!` aparece encima el botón `Configurar FinoRandom.user.js`

Permite hacer lo siguiente:

* Editar el número de intentos que hace (por defecto 10), esto es, si hace ese número de intentos y siempre recibe páginas que ya visitaste entonces desiste y te lleva a dicha página.
* Editar el número de páginas que recuerda (por defecto 40), esto es, al llegar al máximo va "olvidando" las mas antiguas.
* Eliminar historial de randoms visitados.

Flujo simplificado
------------------

Básicamente hace lo siguiente:

![img/flujo-simple.png](https://raw.githubusercontent.com/EliasGrande/FinoRandom/master/img/flujo-simple.png)

Código
------

* El código sin minimizar se encuentra en [./FinoRandom.user.js](https://github.com/EliasGrande/FinoRandom/blob/master/FinoRandom.user.js)
* El código minimizado (con [YUI Compressor](http://yui.github.io/yuicompressor/)) se encuentra en [UserScripts.org/scripts/show/446003](http://userscripts.org/scripts/show/446003)

Licencia
--------

[(BSD-2-Clause) Copyright (c) 2014 Elías Grande Cásedas](https://raw.githubusercontent.com/EliasGrande/FinoRandom/master/LICENSE)

# Versión 1 jugable — Barcos

Una persona, una partida, un barco activo. El bucle cierra así: zarpar, comerciar, ganar, comprar un casco mejor y salir otra vez con ese casco.

El mercado de la versión 1 es una simulación dentro de esa partida. Los precios de los puertos importan porque cada puerto paga distinto y porque comprar y vender mueve el precio de ese puerto hasta que la partida termina. No hay universo persistente ni miles de jugadores detrás de esos precios.

No hay juego hecho y no hay captura. Todas las features de abajo están sin hacer.

## Recorrido al cerrar la versión 1

1. La partida empieza en un muelle, con el casco de salida, una bolsa corta y la bodega casi vacía.
2. La carta muestra un solo mar y tres puertos. Cada puerto tiene su precio de compra y de venta.
3. El jugador elige una ruta porque en el otro puerto el margen es mejor, y zarpa.
4. Lleva el barco por el agua hasta ese puerto.
5. En la misma salida puede pescar, comprar material para revenderlo y quitarle la carga a un mercante. Pescado, material y carga robada comparten bodega y bolsa.
6. Atraca, vende y cobra. Si vació mucho de un bien en ese puerto, el precio de ese bien en ese puerto baja durante el resto de la partida.
7. Repite salidas hasta pagar el segundo casco.
8. Compra ese casco y la siguiente salida se navega con él: cambia la bodega o el andar, y el comercio y los oficios usan ese cambio.
9. La dirección visual del mar y de esos dos cascos queda escrita. La imagen final en pantalla queda fuera de esta versión.

## Fuera de la versión 1

- Multijugador, servidores y otros jugadores.
- Universo persistente, mercado compartido e historial de precios entre partidas.
- Soberanía, dueños de puerto, nullsec y estructuras de jugador.
- Corporaciones, alianzas y política.
- Cola de habilidades, entrenamiento en tiempo real y especializaciones que cierran oficios.
- Más de dos cascos, hangar de colección, módulos, fitting, seguro y clones.
- Fabricación, refinado, minería e investigación.
- Combate como sistema: armas, vida, clases y PvP. La piratería de esta versión es quitar carga, no una fase de combate.
- Más de tres puertos, más mares y mapa por regiones.
- Más bienes que pescado y material. La carga robada es pescado o material, no un tercer mercado.
- Implementación visual final: modelos, agua definitiva, shaders.
- Narrativa, campaña, menús de metajuego y audio. No son fases de este corte.

## Fases

### 1. Salir a navegar

El jugador sale de un muelle, cruza un mar pequeño y llega a otro puerto.

#### Mar de tres puertos

Estado: sin hacer.

Un solo mar, tres puertos fijos, costa que cierra el agua. Un trayecto entre dos puertos cabe en una salida.

Dentro:

- Tres puertos con posición fija.
- Una costa que limita el agua navegable.
- Distancias de una salida, no de una región.

Fuera:

- Otro mar, otro mapa o puertos de jugador.
- Mundo que siga existiendo para otros capitanes.

Bloqueada por: ninguna.

Tareas:

- Situar los tres puertos.
- Cerrar el agua con costa.
- Medir un trayecto de una salida.

#### Zarpar y atracar

Estado: sin hacer.

El barco suelta amarras, entra al agua y vuelve a quedar amarrado en un puerto.

Dentro:

- Salir del muelle al mar.
- Atracar al llegar a uno de los tres puertos.
- Empezar y terminar la salida en un muelle.

Fuera:

- Permisos de atraque, colas y muelles con dueño.
- Estaciones, anclajes y soberanía de puerto.

Bloqueada por: Mar de tres puertos.

Tareas:

- Soltar amarras.
- Atracar en un puerto.
- Empezar y terminar en el muelle.

#### Llevar el barco

Estado: sin hacer.

El jugador gobierna el casco de salida y llega al puerto que eligió.

Dentro:

- Timón y velocidad en el agua.
- Cruzar de un puerto a otro.
- Una llegada que se reconoce como fin del trayecto.

Fuera:

- Simulación de velas, daño, tripulación y clima por capas.
- Salto, viaje entre sistemas o vuelo.

Bloqueada por: Zarpar y atracar.

Tareas:

- Timón y velocidad.
- Cruzar hasta el puerto elegido.
- Reconocer la llegada.

#### Carta de costa

Estado: sin hacer.

La carta de la partida muestra el mar, los tres puertos y el barco.

Dentro:

- Los tres puertos.
- La posición del barco.
- El puerto de destino marcado.

Fuera:

- Mapa de regiones, sondas y exploración de sector.
- Niebla de guerra de alianza.

Bloqueada por: Mar de tres puertos.

Tareas:

- Pintar los tres puertos.
- Marcar el barco.
- Marcar el destino.

### 2. Comerciar

Comprar, vender, elegir ruta y cobrar un margen. Los precios viven en la partida.

#### Precios de la partida

Estado: sin hacer.

Cada puerto compra y vende pescado y material a precios distintos. Esos precios se simulan en la partida abierta: vender mucho de un bien en un puerto baja su precio de venta allí; comprar mucho sube su precio de compra allí. Al cerrar la partida, los precios desaparecen con ella.

Dentro:

- Precio de compra y de venta de pescado y de material, por puerto.
- Un puerto puede pagar más que otro por el mismo bien.
- El movimiento de precio afecta solo a ese puerto y solo a esa partida.

Fuera:

- Libro de órdenes, contratos y mercado de jugadores.
- Precios que sobrevivan al cerrar la partida o que compartan miles de capitanes.

Bloqueada por: Mar de tres puertos.

Tareas:

- Lista de compra y venta por puerto.
- Mover el precio al comerciar.
- Borrar los precios al cerrar la partida.

#### Bodega corta

Estado: sin hacer.

El casco de salida carga poco. Pescado y material ocupan la misma bodega.

Dentro:

- Un tope bajo en el casco de salida.
- La compra, la pesca y el robo se detienen al llenar la bodega.
- Pescado y material cuentan juntos para ese tope.

Fuera:

- Contenedores, carga de alt y bodega de estación como progresión.
- Inventario infinito.

Bloqueada por: Llevar el barco.

Tareas:

- Tope del casco de salida.
- Rechazar carga de más.
- Contar pescado y material juntos.

#### Comprar y vender

Estado: sin hacer.

En el muelle, el jugador compra con la bolsa de la partida y vende lo que trae en la bodega.

Dentro:

- Comprar pescado o material hasta el hueco de bodega.
- Vender lo que hay en la bodega al precio de ese puerto.
- La bolsa y la bodega cambian en el acto.

Fuera:

- Órdenes a plazo, correos y contratos entre jugadores.
- Subasta o casa de cambio persistente.

Bloqueada por: Precios de la partida, Zarpar y atracar, Bodega corta.

Tareas:

- Comprar en el muelle.
- Vender en el muelle.
- Mover dinero y bodega.

#### Ruta con margen

Estado: sin hacer.

Antes de zarpar se puede ver si el viaje paga. Hay una ruta con ganancia y una ruta que pierde.

Dentro:

- Comparar el precio de dos puertos.
- Ver la ganancia estimada según lo que cabe en la bodega.
- Ver una ruta cuyo margen no cubre el viaje.

Fuera:

- Optimizador de región y herramientas de mercado externo.
- Rutas de docenas de saltos.

Bloqueada por: Precios de la partida, Carta de costa, Bodega corta.

Tareas:

- Comparar dos puertos.
- Enseñar la ganancia del viaje.
- Dejar visible una ruta que pierde.

### 3. Oficios

Pesca, tráfico de materiales y piratería. Un capitán los combina en la misma salida, con el mismo casco.

#### Pesca

Estado: sin hacer.

En el agua, fuera del muelle, el jugador mete pescado en la bodega y lo vende en puerto.

Dentro:

- Pescar en el mar, entre puertos.
- El pescado ocupa bodega.
- Se vende al precio del puerto donde se atraca.

Fuera:

- Minijuego de pesca, habilidades de pesca y barco pesquero como carrera aparte.
- Lonja de jugadores.

Bloqueada por: Llevar el barco, Bodega corta, Comprar y vender.

Tareas:

- Pescar fuera del muelle.
- Meter pescado en la bodega.
- Venderlo al precio del puerto.

#### Tráfico de materiales

Estado: sin hacer.

El material se compra en un puerto, llena bodega y se vende en otro puerto donde paga más.

Dentro:

- Un material con precio distinto por puerto.
- Comprarlo, transportarlo y venderlo con el mostrador de la versión 1.
- Poder llevar material y pescado en la misma bodega.

Fuera:

- Cadenas de industria, refinado y fabricación.
- Reputación, aduana o facciones de contrabando.

Bloqueada por: Comprar y vender, Ruta con margen, Bodega corta.

Tareas:

- Comprar material donde está barato.
- Ocupar bodega con ese material.
- Venderlo donde el puerto paga más.

#### Piratería

Estado: sin hacer.

Un mercante recorre una ruta entre dos de los tres puertos con pescado o material. El jugador se acerca y pasa esa carga a su bodega si hay sitio. Luego la vende en puerto.

Dentro:

- Un mercante en el mar de tres puertos.
- Pasar su carga a la bodega del jugador.
- Vender esa carga con los precios de la partida.

Fuera:

- PvP, guerra, seguridad de facción y cazar jugadores.
- Armas, vida, clases y combate como sistema.

Bloqueada por: Llevar el barco, Precios de la partida, Bodega corta, Comprar y vender.

Tareas:

- Poner un mercante con carga.
- Pasar su carga a la bodega.
- Vender esa carga en puerto.

#### Oficios en la misma salida

Estado: sin hacer.

Pesca, tráfico y piratería caben en una sola salida, un solo casco y una sola bolsa.

Dentro:

- Pescar, cargar material y abordar al mercante sin cambiar de modo.
- Una bodega compartida y una bolsa compartida.
- El mismo capitán durante toda la partida.

Fuera:

- Cola de skills para abrir un oficio.
- Personaje, clase o barco que impida hacer los otros oficios en la misma partida.

Bloqueada por: Pesca, Tráfico de materiales, Piratería.

Tareas:

- Compartir la bodega entre oficios.
- Compartir la bolsa.
- Hacer los tres sin cambiar de modo.

### 4. Barco mejor

La ganancia de las salidas paga un segundo casco, y ese casco se navega.

#### Ganancia de la salida

Estado: sin hacer.

Compras, ventas, pesca y carga robada mueven la misma bolsa. La bolsa dura lo que dura la partida.

Dentro:

- Una bolsa para todo el bucle.
- Las ventas suman y las compras restan.
- La bolsa sigue de una salida a la siguiente dentro de la misma partida.

Fuera:

- Carteras por oficio, por corporación o por personaje alt.
- Moneda que persista en un servidor compartido.

Bloqueada por: Comprar y vender.

Tareas:

- Sumar las ventas en una bolsa.
- Restar las compras de esa bolsa.
- Conservar la bolsa durante la partida.

#### Segundo casco

Estado: sin hacer.

En un puerto hay un casco en venta, además del de salida. Su precio cabe en lo que rinden varias salidas de este bucle. Difiere del casco de salida en bodega o en andar, con una diferencia que se nota al jugar.

Dentro:

- Dos cascos en total: el de salida y uno en venta.
- Un precio pagable con la ganancia de esta versión.
- Más bodega o mejor andar, definido en el casco.

Fuera:

- Catálogo, docenas de cascos y variantes por fabricante.
- Seguro, clones y módulos para “mejorar” sin cambiar de casco.

Bloqueada por: Ganancia de la salida, Bodega corta.

Tareas:

- Poner un casco en venta.
- Fijar un precio que el bucle puede pagar.
- Definir su bodega o su andar.

#### Navegar el segundo casco

Estado: sin hacer.

Después de pagarlo, la siguiente salida usa ese casco de verdad.

Dentro:

- Zarpar con el casco comprado.
- Su bodega limita comprar, pescar y robar.
- Su andar entra en llevar el barco.

Fuera:

- El casco como ficha de hangar que no se gobierna.
- Flota simultánea o varios cascos activos.

Bloqueada por: Segundo casco, Llevar el barco.

Tareas:

- Zarpar con el casco comprado.
- Aplicar su bodega al comercio y a los oficios.
- Aplicar su andar al gobierno del barco.

### 5. Aspecto del mar y de los barcos

En esta versión se fija la dirección visual. Implementarla en pantalla queda pendiente y no bloquea el bucle.

#### Dirección del mar

Estado: sin hacer.

Queda escrito cómo se lee este mar: paleta, horizonte y agua, a la escala de tres puertos y una salida.

Dentro:

- Paleta y horizonte de este mar.
- Cómo se distingue agua, costa y puerto.
- Texto de dirección, listo para cuando se implemente.

Fuera:

- Shaders, agua definitiva y escenario final.
- Océano abierto, regiones y flotas lejanas.

Bloqueada por: ninguna.

Describe el mar de Mar de tres puertos. No bloquea zarpar, comerciar ni comprar el casco.

Tareas:

- Fijar paleta y horizonte.
- Fijar cómo se lee el agua.
- Dejar escrita la implementación pendiente.

#### Dirección de los cascos

Estado: sin hacer.

Queda escrito cómo se distinguen en el agua el casco de salida y el segundo casco.

Dentro:

- Silueta del casco de salida.
- Silueta del segundo casco, distinta por bodega o andar.
- Texto de dirección de esos dos cascos.

Fuera:

- Modelos finales, materiales y cinemáticas.
- Línea de más cascos.

Bloqueada por: ninguna.

Describe el casco de salida y el Segundo casco. No bloquea navegarlos con formas provisionales.

Tareas:

- Fijar la silueta del casco de salida.
- Fijar la silueta del segundo casco.
- Dejar modelos y materiales para después.

## Dependencias

| Feature | Bloqueada por |
| --- | --- |
| Mar de tres puertos | ninguna |
| Zarpar y atracar | Mar de tres puertos |
| Llevar el barco | Zarpar y atracar |
| Carta de costa | Mar de tres puertos |
| Precios de la partida | Mar de tres puertos |
| Bodega corta | Llevar el barco |
| Comprar y vender | Precios de la partida, Zarpar y atracar, Bodega corta |
| Ruta con margen | Precios de la partida, Carta de costa, Bodega corta |
| Pesca | Llevar el barco, Bodega corta, Comprar y vender |
| Tráfico de materiales | Comprar y vender, Ruta con margen, Bodega corta |
| Piratería | Llevar el barco, Precios de la partida, Bodega corta, Comprar y vender |
| Oficios en la misma salida | Pesca, Tráfico de materiales, Piratería |
| Ganancia de la salida | Comprar y vender |
| Segundo casco | Ganancia de la salida, Bodega corta |
| Navegar el segundo casco | Segundo casco, Llevar el barco |
| Dirección del mar | ninguna |
| Dirección de los cascos | ninguna |

Camino del bucle: Mar de tres puertos → Zarpar y atracar → Llevar el barco → Bodega corta → Comprar y vender → Ganancia de la salida → Segundo casco → Navegar el segundo casco.

En paralelo desde Mar de tres puertos: Carta de costa y Precios de la partida. Ruta con margen entra cuando existen precios, carta y bodega. Los oficios entran cuando ya se puede llevar el barco, llenar la bodega y vender. Oficios en la misma salida cierra la fase 3. La dirección visual se escribe ya y queda fuera del camino del bucle.

## Riesgos de convertir la v1 en el MMO

| Riesgo | Cómo lo corta esta versión |
| --- | --- |
| El mercado pasa a ser persistente y compartido | Precios de la partida nacen al abrirla y mueren al cerrarla. Solo el comercio del jugador mueve el precio de ese puerto. |
| Aparece una cola de skills de meses | No hay habilidades. El avance es la bolsa y el segundo casco. |
| El segundo casco abre un catálogo | Hay dos cascos. El comprado se navega. No hay hangar. |
| La piratería pide armas, vida y PvP | Piratería es un mercante y su carga. El combate como sistema está fuera. |
| Los oficios se parten en carreras y corporaciones | Un capitán, un casco activo, una bodega, una bolsa, la misma salida. |
| El tráfico se vuelve industria | El material se compra en un puerto y se vende en otro. No se fabrica. |
| El mar crece a regiones con soberanía | Un mar, tres puertos fijos, sin dueño jugador. |
| La dirección visual mete el arte final en la v1 | Se escribe la dirección. Modelos, agua final y shaders no bloquean el bucle. |

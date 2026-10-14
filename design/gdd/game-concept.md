# Barcos — concepto de la versión 1

## Frase del juego

Sales a navegar, ganas con pesca, tráfico o piratería en el mismo mar, y con ese dinero compras un barco que cambia el viaje siguiente.

## Fantasía del jugador

Eres el patrón de un casco pequeño, no el almirante de una flota. En el muelle lees cuatro precios, eliges a qué puerto vale la pena ir y zarpar es la decisión. El barco pesa, gira y se queda sin agua bajo el casco. En el mismo viaje puedes llenar la bodega de pescado, comprar hierro barato o quedarte con la carga de otro. Vuelves, pagas el atraque y miras el astillero. El barco nuevo no es un número más alto: es otra forma de cruzar el mismo mar.

La fantasía de esta versión es la del patrón que ya tiene el siguiente casco en la cabeza antes de soltar amarras. La versión 1 termina cuando posees los cuatro cascos y has ganado dinero de verdad con cada uno. Después el mar sigue abierto. No hay pantalla de victoria.

## Pilares

1. **El barco se gobierna.** El minuto a minuto es timón, motor, calado y peso de la bodega. Si el casco no se siente en el agua, el resto no importa.
2. **La ruta tiene precio.** El mismo bien no vale lo mismo en dos puertos. Elegir destino es la decisión económica. Una ruta que no cubre combustible y atraque está muerta, y el juego quiere que lo veas en la cuenta.
3. **Los oficios comparten el mar.** Pesca, tráfico de materiales y piratería no son tres modos. Comparten bodega, bienes, puertos y cascos. Se cambia de oficio a mitad de viaje sin cambiar de partida.
4. **Cada casco se usa.** Hay cuatro barcos. El nuevo abre un trabajo. El anterior sigue siendo mejor en el suyo. Tenerlos los cuatro es el estado final de la versión 1, no una colección.

## Qué se siente

Diseñado desde la experiencia hacia las reglas (MDA):

- **Sensación.** El casco empuja el agua, frena con la bodega llena y no entra donde no le da el calado. La respuesta del timón llega en menos de medio segundo.
- **Fantasía.** Patrón que lee el muelle y arriesga el viaje. No hay cola de habilidades ni rango que sustituya haber cruzado la ruta.
- **Desafío.** La ruta segura paga poco. La ruta cara cruza agua de piratas. Perder carga duele. Perder el barco, no: el casco vuelve dañado y la factura de reparación es el coste.
- **Descubrimiento.** El precio es la información. Dónde está hambriento el puerto, dónde sobra el hierro, qué caladero sigue dando pescado. Saberlo es la ventaja.
- **Expresión.** Con el Balandro se pueden hacer las tres cosas en un viaje. Con el resto se elige en qué ser bueno. Las cuatro elecciones siguen siendo viables. Ninguna es el único camino rentable en todos los mares.

Lo que el jugador hace, visto desde fuera: planea en puerto, improvisa en el agua y rota de oficio cuando la ruta que acaba de alimentar ya no paga. Esa rotación es el comportamiento que las reglas tienen que producir.

Necesidades que la versión 1 cubre de forma deliberada: autonomía (oficio, ruta y casco), competencia (gobernar, leer el margen, cazar o escapar) y un vínculo mínimo con el propio barco. No hay relación con otros jugadores. Los mercantes y el pirata del corredor son el reparto que hace creíble el mercado.

## La versión 1, en concreto

Un solo jugador, un mar, cuatro puertos, cinco bienes, tres caladeros, cuatro cascos. El mercado lo mueven el jugador y unos pocos barcos no jugadores. Una partida guarda el dinero, los cascos, la carga y el stock de los puertos. Sin esa persistencia, la ruta deja de importar.

El bucle, en cuatro pasos: salir a navegar, comerciar, ganar, comprar un barco mejor. «Comerciar» incluye pescar y piratear, porque los tres oficios liquidan en los mismos puertos. El detalle implementable está en `design/gdd/core-loop.md`.

## Qué queda fuera

La versión 1 es una partida jugable, no el MMO.

- Multijugador, corporaciones, flotas compartidas, soberanía y guerras de territorio.
- Cola de habilidades, entrenamientos de horas o días, y niveles de personaje.
- Mercado de órdenes, contratos, subastas y cientos de bienes. Hay cinco bienes y el precio lo pone el stock del puerto.
- Árbol de cascos, módulos, mejoras de componente y pérdida permanente del barco. Hay cuatro cascos. Si te hunden, el casco reaparece dañado en el último puerto legal.
- Fabricación, refinado y construcción de barcos o de bienes. Los puertos producen y consumen solos.
- Misiones con guion, facciones, reputación y narrativa. El muelle no te encarga trabajos.
- Simulación de velas, trimado y clima que destruya barcos. El viento empuja un poco. El motor manda.
- Logística de trasladar un casco vacío entre puertos. El casco que posees se puede tomar en cualquier puerto legal. La carga no viaja sola: o va en la bodega, o se queda en el almacén de ese puerto.
- Escolta de jugadores, alquiler de barcos y mercado de segunda mano entre personas.

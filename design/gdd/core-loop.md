# Bucle principal — versión 1

## 1. Overview

Barcos, en su versión 1, es una partida de un solo jugador en un mar pequeño. El jugador gobierna un barco a motor, usa la bodega para pescar, comprar barato y vender caro, o robar carga, y con el neto compra otro casco. Los tres oficios liquidan los mismos cinco bienes en los mismos puertos. El precio de cada puerto sale de su stock. Por eso la ruta importa: el margen tiene que pagar el motor y el atraque, y quien vacía un puerto obliga al resto a irse a otra parte.

El bucle cabe en cuatro pasos. Salir a navegar. Comerciar (pescar, traficar materiales o piratear: los tres son comerciar). Ganar, que es vender, pagar y ver el neto. Comprar un barco mejor y zarpar con él. Comprar sin usar no cierra el bucle.

Moneda: **reales**. Un viaje de pesca en la chalupa dura unos 10 minutos y deja alrededor de 200 reales. El primer barco de pago cuesta 1.500. El casco de carga y el de caza cuestan 4.200 y 4.600. La escalera completa, jugando el oficio de cada casco, cabe en unas pocas sesiones. No hay entrenamiento de fondo.

## 2. Fantasía del jugador

El jugador se siente patrón, no gestor de una cola de iconos. En el muelle compara precios y zarpa con un plan. En el agua el plan se tuerce: el caladero baja, aparece un mercante, el motor no da para la presa. Cambia de oficio sin menú de profesión. Al atracar, la cuenta le dice si la ruta valía. En el astillero, el casco nuevo se lee en bodega, calado, cañones y pesca, no en un nivel.

Sensación principal: el barco en el agua. Fantasía principal: leer el precio y arriesgar el casco adecuado. El desafío crece por la ruta, no por una barra de experiencia.

## 3. Reglas

### 3.1 Microbucle: navegar el barco

El microbucle dura lo que dura un cambio de rumbo. Tiene que notarse en menos de medio segundo: la estela, las revoluciones del motor y el número de nudos se mueven en el mismo instante que el acelerador y el timón.

**Estado del casco en marcha**

- Posición, rumbo (grados), velocidad (nudos, negativa si va atrás).
- Acelerador del jugador, de −1 a 1. Atrás no pasa del 30% de la velocidad máxima.
- Timón del jugador, de −1 a 1.
- Puntos de casco y puntos de motor, separados.
- Bodega usada y bodega máxima.
- Combustible en el depósito de ese casco.

**Cómo se mueve**

La velocidad no salta al objetivo. Se acerca a esta velocidad objetivo:

```
velocidad_objetivo = acelerador * vel_max * factor_carga * factor_motor * factor_mar
```

- `factor_carga = 1 - 0,30 * (bodega_usada / bodega_max)`. A bodega llena el barco va al 70% de su máximo. Soltar carga por la borda sube la velocidad en el acto. Es la decisión de una persecución.
- `factor_motor = puntos_motor_actuales / puntos_motor_max`. A motor destruido (0) la velocidad máxima queda en 0,8 nudos, aunque el factor dé 0. El barco no se ancla: deriva.
- `factor_mar = 1 + aporte_viento`. El viento suma o resta como máximo un 10% según cuánto se parece el rumbo a la dirección del viento (`clamp` del producto de los dos vectores entre −1 y 1, multiplicado por 0,10). No hay velas que trimar.
- La corriente es un vector de la zona, sumado a la velocidad después del cálculo anterior. En la versión 1 hay dos canales de corriente, de 1,2 nudos, marcados en la carta. Fuera de ellos la corriente es 0.

La aceleración hacia la velocidad objetivo es de 1,5 nudos por segundo en la Chalupa Luz, 1,2 en el Balandro Travesía, 0,6 en la Urca Carga y 1,8 en el Bergantín Filo. El frenado con acelerador a 0 usa la misma cifra.

El giro, en grados por segundo:

```
giro = giro_base * timon * clamp(velocidad_absoluta / vel_max, 0,25, 1)
```

A barco parado el timón aún gira al 25%. Hace falta para desatracar. El `giro_base` de cada casco está en la escalera.

**Combustible**

El consumo por minuto es el del casco multiplicado por el valor absoluto del acelerador. A acelerador 0 no consume. El gasto se acumula en fracciones. Al atracar, o al quedarse a 0, se redondea hacia arriba la unidad empezada. Cada unidad gastada sale del depósito. A depósito 0 el acelerador no responde. El barco conserva la inercia y la corriente.

El combustible se compra en cualquier puerto, a 2 reales la unidad, sin mover el precio de los bienes. El depósito no se teletransporta entre cascos.

**Costa, fondo y choque**

- Si el calado mínimo del casco es mayor que la profundidad, la velocidad pasa a 0 y el casco pierde 4 puntos por segundo hasta que el jugador da atrás y sale a agua suficiente. No hay muerte instantánea por varar.
- Chocar con tierra a más de 3 nudos quita `8 * (nudos - 3)` puntos de casco, redondeado al entero más cercano, y multiplica la velocidad por 0,2.
- Los puertos legales tienen un círculo de abrigo. Dentro no disparan los cañones, no entran el pirata no jugador y varar no hace daño. Cala Hundida no es abrigo.

**Profundidades de la versión 1**

| Lugar | Profundidad |
| --- | ---: |
| Bajos de Calma | 0,9 m |
| Banco de Brezo | 1,8 m |
| Fosa del Cabo | 4,0 m |
| Canal de Cala Hundida | 1,6 m |
| Puerto Calma, Muelles de Brezo, Cabo Rojo | 4,0 m |
| Resto del mar navegable | 3,0 m o más |

**Distancias**

Millas náuticas entre puntos. Los minutos salen de `millas / nudos * 60` a toda máquina, sin viento ni corriente. El nivel puede curvar el camino. La distancia de diseño es la del camino real.

| Tramo | Millas |
| --- | ---: |
| Puerto Calma ↔ Bajos de Calma | 0,4 |
| Puerto Calma ↔ Banco de Brezo | 0,7 |
| Banco de Brezo ↔ Muelles de Brezo | 0,5 |
| Puerto Calma ↔ Muelles de Brezo | 1,0 |
| Muelles de Brezo ↔ Cabo Rojo | 1,5 |
| Puerto Calma ↔ Cabo Rojo (por fuera) | 1,9 |
| Cabo Rojo ↔ boca de Cala Hundida | 0,45 |

El tramo Calma–Brezo es el único sin pirata no jugador. Una patrullera lo cubre. El tramo de fuera, Calma–Cabo, y el tramo Brezo–Cabo son el corredor de caza.

### 3.2 Bucle de sesión: salir, comerciar, ganar

Una sesión de juego aquí es un viaje: del desatraque a la venta. Dura entre 10 y 25 minutos si el jugador va a un oficio claro. El circuito de dos tramos (hierro de ida y aceite de vuelta) puede ocupar dos viajes. No hace falta cerrarlo en una sentada.

**Paso 1. Salir a navegar**

En un puerto legal el jugador ve, para cada uno de los cinco bienes: stock, precio al que el puerto vende y precio al que el puerto compra. Ve el mismo par de precios de los otros dos puertos legales, con el stock de la última vez que ese dato se actualizó. El dato se actualiza al atracar allí o al llegar un mercante no jugador. No hay pantalla de mercado global en tiempo real: hay que haber pasado o fiarse del último barco.

El muelle muestra también el margen bruto por unidad hasta cada otro puerto legal: precio de compra de allí menos precio de venta de aquí. No resta combustible, atraque ni riesgo. Esa resta la hace el jugador. Es el núcleo de «la ruta tiene precio».

Antes de zarpar puede, en este orden y las veces que quiera:

- Mover carga entre la bodega y el almacén de ese puerto. Cada puerto legal tiene un almacén de 40 espacios, solo de ese puerto. Cala Hundida no tiene almacén.
- Comprar o vender bienes legales si hay stock y hay espacio.
- Comprar combustible hasta llenar el depósito de ese casco.
- Comprar munición, solo en Brezo y en Cabo, a 6 reales la unidad.
- Reparar casco y motor.
- Cambiar al casco con el que va a zarpar, si lo posee. El cambio es inmediato en cualquier puerto legal. La carga que estaba en el otro casco se queda en ese otro casco, esté donde esté. No hay botón de «traer mi otro barco con su bodega».
- Pagar no es un paso aparte del atraque. El atraque se cobra al entrar, no al salir.

Zarpar es libre siempre que el casco tenga al menos 1 punto de casco. Se puede salir dañado. No hay multa por deuda: no existe la deuda. Si no alcanza para reparar, sale dañado.

**Paso 2. Comerciar**

En el agua no hay modo «pescador» ni modo «pirata». El oficio es lo que el jugador hace con la bodega y con los cañones. En un mismo viaje puede pescar, comprar no aplica en alta mar, abordar y seguir hacia un puerto distinto del que pensó. Las reglas de cada oficio están en la sección 3.4. El microbucle de la sección 3.1 no se pausa durante un lance ni durante un disparo. El lance sí exige ir despacio, y eso es una ventana, no un minijuego aparte.

**Paso 3. Ganar**

Atracar en un puerto legal o en Cala Hundida cobra el atraque (Cala cobra 0) y abre la venta.

Al vender, la cuenta del viaje muestra cinco líneas, en reales: lo pagado por la mercancía de esta bodega, lo cobrado ahora, el combustible gastado desde el desatraque, el atraque de esta entrada, la munición y la reparación pagadas en esta escala. El neto es la suma con su signo. Si el jugador no compró porque pescó o robó, la línea de compra sale a 0. El neto es la recompensa del viaje. Tiene que leerse en un vistazo, sin salir a una hoja de cálculo.

Los bienes legales se venden en cualquier puerto legal, aunque el precio sea malo. Los bienes marcados como botín solo se venden en Cala Hundida. Un puerto legal los rechaza y no los confisca: siguen en la bodega.

El dinero se suma en el acto. No hay letra ni banco.

**Paso 4, que ya es el bucle largo**

Con el neto en el bolsillo el jugador puede entrar en el astillero del puerto legal. Eso es el paso 4 y vive en la sección 3.3. También puede no comprar nada y volver a zarpar. Las dos opciones son válidas. El juego no empuja con una misión.

**Arranque de la partida**

El jugador posee la Chalupa Luz, atracado en Puerto Calma, con el depósito lleno (25 unidades), la bodega vacía y 200 reales. No se cobra atraque por esa primera estancia. El primer viaje que el mapa invita a hacer, sin cerrar el resto del mar, es Calma → Bajos de Calma → Calma. El corredor de piratas queda lejos. No hay muro invisible: si el jugador se va a Cabo en la chalupa, puede. Lo más probable es que pierda el pescado por el plazo o que lo cacen. Esa pérdida enseña el mapa.

**Quién más navega**

Hacen falta barcos no jugadores para que el mercado y la piratería existan con un solo jugador.

- Dos mercantes con las cifras de la Urca Carga (bodega 40, sin cañones, 5,5 nudos). Cada 3 minutos, si están atracados, miran el margen bruto de los tramos entre puertos legales. Si el mejor margen por unidad, multiplicado por 40, supera 200 reales, compran hasta 40 del bien de ese tramo, pagan el precio del puerto (el stock baja) y zarpan. Al llegar venden al precio de ese momento (el stock sube) y esperan otros 3 minutos. Si los hunden, el que falta reaparece a los 8 minutos en el puerto de origen de su último tramo, con bodega vacía. Su compra y su venta son reales: mueven el precio.
- Un pirata no jugador en el corredor Brezo–Cabo y en el tramo exterior Calma–Cabo. No entra en Calma–Brezo. 10 nudos, calado mínimo 1,5 m, casco 70, motor 26, dos cañones, daño 10, bodega 16. Si un barco que no sea la patrullera está a menos de 80 metros y fuera de un abrigo, lo persigue. Apunta al motor la mitad de los disparos, al casco la otra mitad. Aborda con la misma regla que el jugador y se queda hasta 16 unidades del bien de mayor precio base. Si lo hunden, reaparece a los 6 minutos en el centro del tramo Brezo–Cabo. Lo que roba lo vende en Cala Hundida con la regla del perista y desaparece del mundo: no vuelve a un puerto legal.
- Una patrullera en el segmento Calma–Brezo. Casco 400, daño 20, sin bodega. Dispara a quien dispare dentro del segmento y al pirata no jugador si entra. No suelta carga. No se aborda. No es una presa.

El mundo se congela en la pausa. No hay ingresos con el juego cerrado. Al guardar se guardan dinero, cascos poseídos, estado de cada casco, carga, almacenes, stock de los tres puertos legales, riqueza de los tres caladeros y posición del jugador y de los no jugadores.

### 3.3 Bucle largo: comprar un barco mejor y usarlo

El bucle largo es la escalera de cuatro cascos. No hay experiencia, reputación ni desbloqueo por horas. Hay reales y una compra.

**Precios de astillero**, iguales en los tres puertos legales. Cala Hundida no vende cascos.

| Casco | Precio |
| --- | ---: |
| Chalupa Luz | Se posee al empezar. No se compra ni se vende. |
| Balandro Travesía | 1.500 reales |
| Urca Carga | 4.200 reales |
| Bergantín Filo | 4.600 reales |

Comprar exige el dinero en el acto. El casco aparece vacío en ese puerto, con depósito vacío, casco y motor al máximo, y queda poseído en todos los puertos legales: se puede tomar en otro puerto, pero vacío. La versión 1 no simula el viaje del casco vacío. La carga sí se simula.

Vender cascos no existe en la versión 1. La Luz no se pierde. Los otros tres tampoco: hundirse no los borra.

**Cuándo cuenta como «usarlo»**

Pagar no cierra el bucle. El cierre es un viaje terminado con ese casco en el trabajo que los otros hacen peor:

- Travesía: un viaje en el que, con ella, se pesca en el Banco de Brezo o se vende en un puerto un bien que no sea pescado recién capturado por ella misma.
- Urca Carga: un viaje en el que se venden al menos 17 unidades de un mismo bien comprado en otro puerto. Diecisiete es una más que la bodega de la Travesía. Por debajo de eso, la Urca no está haciendo su trabajo.
- Filo: un viaje que termina en Cala Hundida con una venta de botín.

La Luz se usa mientras alguien pesque los Bajos de Calma. No hay un cuarto cierre: ya se posee.

El astillero, al mirar un casco que no se tiene, muestra las cuatro diferencias que importan frente al casco con el que se ha atracado: bodega, agua mínima, cañones, pesca. No muestra un «+15% de poder».

**Ritmo al que la escalera está afinada**

Cifras objetivo con los precios de arranque de la sección 4, sin combate, jugando el mejor uso honrado de cada casco. Sirven para saber si un cambio de números ha roto la escalera.

| Meta | Viajes | Tiempo de juego aproximado |
| --- | --- | --- |
| Luz → Travesía, pescando en los Bajos y vendiendo en Calma | 7 viajes de unos 200 reales | hora y media |
| Travesía → Urca o Filo, pescando el Banco o mezclando un flete corto | 8 a 10 viajes de 350 a 450 reales | unas tres horas |
| Ya con la Urca, el otro casco caro, haciendo el tramo del hierro o el del aceite | 8 a 10 tramos de 440 a 550 reales | unas tres horas |

Los dos cascos caros no están en fila. Después de la Travesía se elige carga o caza. Comprar los dos es el final de la escalera, no un requisito para que el mar funcione.

**Hundirse, que es el coste del bucle largo**

A 0 puntos de casco el barco se hunde. La carga queda en un pecio durante 180 segundos. Cualquiera con espacio puede recogerla. Lo que el dueño recoge de su propio pecio no es botín. Lo que recoge otro, sí.

El casco reaparece en el último puerto legal en el que atracó, con el 25% de los puntos de casco y el 25% de los puntos de motor, redondeado hacia abajo con mínimo 1, bodega vacía y el combustible que le quedaba. El dinero no se toca. No hay pérdida permanente del barco en la versión 1. El daño se arregla pagando. Si el jugador no paga, navega peor. Ese es el coste, proporcionado a un hundimiento que en el corredor puede ocurrir varias veces por hora.

Reparar, en puerto legal: 4 reales por punto de casco que falte y 6 reales por punto de motor que falte. En Cala Hundida los dos precios van multiplicados por 1,5, redondeados al real más cercano.

### 3.4 Cómo conviven la pesca, el tráfico y la piratería

Los tres oficios usan la misma bodega y los mismos cinco bienes: pescado, sal, madera, hierro y aceite. No hay bienes de contrabando distintos. «Tráfico de materiales» es comprar en un puerto y vender en otro. El acto ilegal es la piratería, y se reconoce porque la carga queda marcada como botín.

Un viaje puede encadenar los tres. Ejemplo que las reglas permiten sin ningún diálogo: zarpar de Calma con sal, pescar en el Banco, salar, vender el pescado en Brezo, comprar hierro, y a medio camino de Cabo abordar a un mercante. El pescado ya vendido era pesca. El hierro es tráfico. Lo robado es piratería y no se puede vender en Cabo. Hay que seguir hasta Cala Hundida. Nadie cambia de «clase» para hacerlo. El casco solo pone el techo: la Urca no pesca ni entra en Cala, el Filo no llena un flete, la Luz no cruza con volumen.

**Pesca: la fuente de pescado**

El pescado que el jugador lleva a puerto entra en el mundo en ese momento. Es la fuente principal de ese bien. Los puertos no producen pescado.

Para lanzar hay que estar dentro de un caladero, con pesca del casco mayor que 0, a menos de 1,5 nudos durante 5 segundos seguidos. El lance dura 8 segundos. Si en esos 8 segundos la velocidad pasa de 1,5 nudos, el lance se anula y no gasta el caladero. Si termina, se añade 1 pescado a la bodega con una marca de tiempo. Si la bodega está llena, el lance no empieza.

Entre el fin de un lance y el siguiente hace falta una espera de `16 - (pesca * 2)` segundos. Luz espera 10, Travesía 12, Filo 14. La Urca tiene pesca 0: la acción no existe.

Cada captura resta riqueza al caladero. Por debajo de 15 de riqueza el lance termina en vacío y no resta. La riqueza sube sola cada minuto, con tope 100.

| Caladero | Profundidad | Riqueza inicial | Resta por captura | Regenera por minuto | Quién entra |
| --- | ---: | ---: | ---: | ---: | --- |
| Bajos de Calma | 0,9 m | 70 | 10 | 8 | Solo la Luz |
| Banco de Brezo | 1,8 m | 85 | 10 | 5 | Luz, Travesía, Filo |
| Fosa del Cabo | 4,0 m | 95 | 14 | 3 | Luz, Travesía, Filo. Cada captura aquí da 2 pescados, no 1. Está en el corredor. |

El pescado crudo desaparece a los 480 segundos de su captura. El tiempo corre con el mundo y se congela en la pausa. Al desaparecer, un aviso dice que se echó a perder. Salarlo gasta 1 sal por cada 4 pescados o fracción y borra el plazo de esos pescados. Salir a pescar y volver a Calma cabe en el plazo. Llevar pescado crudo hasta Cabo, no. La sal es el puente entre pescar y traficar, y es un sumidero: la sal consumida no vuelve.

La Luz sigue siendo el mejor pesquero de bajura después de comprar el resto, porque es la única que entra en los Bajos y porque espera menos entre lances. El Filo puede pescar el Banco si no hay presas, y lo hace peor que la Travesía. La Urca no pesca. Si el jugador solo pesca, gana menos por minuto que un buen tramo de la Urca, y no le dispara nadie en los Bajos. Es un camino válido, no el dominante.

**Tráfico de materiales: mover, no crear**

El tráfico no crea bienes. Los saca de un stock y los mete en otro. La fuente de madera, sal, hierro y aceite es la producción de los puertos. El sumidero grande es el consumo de los puertos, más el combustible, el atraque, la munición, la reparación y el pescado podrido.

Cada minuto, en cada puerto legal, cada bien suma su producción y resta su consumo. El stock no baja de 0. La producción se detiene si el stock llega al doble del objetivo. El consumo no se detiene por estar bajo: a stock 0 simplemente no resta.

El jugador compra como máximo el stock existente y como máximo el espacio libre de la bodega. Paga `compra_jugador` por unidad y el stock baja en esas unidades. Vende lo que quiera de un bien legal, cobra `venta_jugador` por unidad y el stock sube. Las fórmulas están en la sección 4.

Por qué el precio de la ruta importa, en una frase operativa: el neto del tramo es `(venta_destino - compra_origen) * unidades - combustible - atraques`. Si eso da negativo, la ruta está muerta aunque el barco quepa. El ejemplo worked de la madera, en la sección 4, sale a propósito peor que pescar. El del hierro sale a propósito mejor, y cruza el corredor.

Un viaje de la Urca que entrega 40 de hierro en Cabo deja ese puerto cerca de su objetivo. El margen se hunde. El consumo de Cabo (1,0 de hierro por minuto) tarda un cuarto de hora largo en volver a abrir un hueco. Mientras tanto el aceite de Cabo sigue barato y Calma lo sigue pagando, o el Banco sigue teniendo pescado. Rotar de oficio no es un consejo: es lo que pasa cuando el jugador se come su propia ruta. Los mercantes no jugadores hacen lo mismo a escala menor y le disputan el hueco.

La ruta corta Calma–Brezo no tiene pirata. Tampoco tiene un margen que justifique la Urca. La seguridad se paga con un mal precio. La ruta Brezo–Cabo y la de fuera pagan más porque el stock de destino tarda en reponerse y porque parte de los viajes no llegan.

**Piratería: trasladar y destruir valor, no crearlo**

La piratería no genera bienes. Los quita de otra bodega.

Para disparar hace falta un cañón, munición y estar fuera de un abrigo. Cada cañón tiene su propia recarga de 6 segundos. El jugador dispara un cañón listo por vez. El proyectil tarda en llegar. El daño se aplica al casco (14) o al motor (8), según el punto de mira que el jugador haya elegido antes del disparo. Cada disparo gasta 1 de munición, se acierte o no. A 0 munición no se dispara.

Abordar exige todo esto a la vez: distancia menor de 25 metros, el objetivo con motor a 0 o con velocidad menor de 2 nudos, y 5 segundos seguidos manteniendo esa distancia. Entonces se mueven a la bodega del abordador tantas unidades como quepan, tomadas del bien con mayor precio base que lleve el objetivo. Si hay empate de precio base, se toma el que más unidades ocupe. Un abordaje por cada vez que el objetivo queda en esas condiciones. Para volver a ser abordado tiene que recuperar el motor por encima de 0 y la velocidad por encima de 2 nudos, y volver a perderlos.

Lo abordado nace como botín. Cala Hundida lo compra y lo borra del mundo. No entra en el stock de ningún puerto legal. El precio del perista es el 75% del mejor precio de compra legal de ese bien en ese instante, redondeado hacia abajo. El otro 25% es el sumidero del oficio. Por eso piratear paga menos, por unidad, que haber hecho uno mismo el tramo. Paga sin haber puesto el capital de compra, y solo por lo que cabe en el Filo.

Lo que no cabe se queda en la víctima. Si la víctima es un mercante no jugador y sigue a flote, entrega el resto y el precio de destino se mueve poco. Si se le hunde, lo que no se recogió del pecio en 180 segundos desaparece. Hundir a propósito para que el destino siga hambriento, y luego cruzar uno mismo con la Urca, es una estrategia mixta permitida en la versión 1. Cuesta munición, tiempo y los bienes destruidos. No es un error de reglas. Si en prueba resulta siempre mejor que simplemente cruzar, el mando a tocar es la recarga y el precio de la munición, no un castigo nuevo.

El Filo es el casco que caza de verdad: cierra contra la Urca a 11 nudos contra 5,5, lleva 30 de bodega (una tajada, no las 40 de la presa) y entra en Cala Hundida. La Travesía también es más rápida que la Urca y entra en Cala, pero en línea recta recorta a 3 nudos (8,5 menos 5,5) y el Filo recorta a 5,5 nudos (11 menos 5,5). Tiene un cañón y 16 de bodega. Sirve para rematar a un mercante ya tocado y vender poco. Si se queda en el corredor, el pirata no jugador de 10 nudos la alcanza. No escapa de él sin la patrullera o sin un bajo. La Luz escapa del pirata metiéndose en los Bajos (0,9 m; el pirata necesita 1,5 m) y no puede cazar.

La piratería depende del tráfico. Si nadie cruza el corredor, no hay presa, el pirata no jugador incluido: los mercantes solo zarpan si el margen merece. Si el jugador hunde a los dos mercantes y no cruza él, el destino se vacía por consumo, el margen sube, los mercantes reaparecen a los 8 minutos y vuelven a salir. El oficio se apaga solo cuando el margen se apaga, y el margen se apaga cuando alguien entrega.

**Fuentes y sumideros, juntos**

| | Entra en el mundo | Sale del mundo |
| --- | --- | --- |
| Pesca | Pescado capturado | Pescado podrido. Sal gastada en salar. Consumo de pescado de los puertos |
| Tráfico | Producción de sal, madera, hierro y aceite en los puertos | Consumo de esos bienes. El tráfico en sí no destruye: recoloca |
| Piratería | Nada | El 25% que se queda el perista, en valor. Lo que se hunde y no se recoge, en bienes |
| Los tres | — | Combustible (se paga, no es un bien del mercado), atraque, munición, reparación |

El bucle que se refuerza: un destino vacío sube el precio, salen mercantes, el pirata tiene presas, algunas cargas no llegan, el destino sigue relativamente vacío. El bucle que lo frena: cada entrega llena stock, el margen baja, los mercantes dejan de salir, el pirata se queda sin oficio, el consumo vuelve a abrir el hueco. El jugador empuja los dos según el casco con el que zarpó.

### 3.5 Escalera de barcos de la versión 1

Cuatro cascos. Cada uno se usa después de comprar el siguiente. Las cifras de combate y de motor que no están en esta tabla están en las secciones 3.1 y 3.4.

| | Chalupa Luz | Balandro Travesía | Urca Carga | Bergantín Filo |
| --- | ---: | ---: | ---: | ---: |
| Papel | Pescar los Bajos | Mezclar los tres oficios | Hacer rentable el flete | Alcanzar a la Urca y vender en Cala |
| Precio | Ya poseída | 1.500 | 4.200 | 4.600 |
| Bodega | 8 | 16 | 40 | 30 |
| Nudos máx. | 7 | 8,5 | 5,5 | 11 |
| Aceleración (nudos/s) | 1,5 | 1,2 | 0,6 | 1,8 |
| Giro base (grados/s) | 55 | 38 | 16 | 42 |
| Calado | 0,5 m | 1,2 m | 2,3 m | 1,3 m |
| Agua mínima | 0,7 m | 1,4 m | 2,6 m | 1,5 m |
| Casco | 45 | 80 | 130 | 90 |
| Motor | 24 | 32 | 28 | 30 |
| Cañones | 0 | 1 | 0 | 3 |
| Pesca | 3 | 2 | 0 | 1 |
| Consumo (unidades/min a fondo) | 1 | 2 | 3 | 4 |
| Depósito | 25 | 40 | 70 | 55 |

Por qué no se guardan en el astillero:

- **Luz.** Única en los Bajos de Calma. El mejor minuto de pesca segura de la versión 1 sigue siendo suyo. Cabe en Cala, pero sin cañones no genera botín.
- **Travesía.** Primer compra. Pesca el Banco, lleva 16 de flete y tiene un cañón para un blanco ya parado. Es el casco con el que un viaje mezcla oficios. No alcanza el neto de una Urca en el hierro ni el de un Filo que sí encontró presa.
- **Urca Carga.** Única bodega por la que el hierro y el aceite pagan el motor. No pesca, no dispara, no entra en Cala Hundida (necesita 2,6 m; el canal tiene 1,6). Si lleva botín por un caso raro, no puede venderlo: tiene que traspasarlo abordando a otro casco propio que sí entre, o tirarlo. En la práctica no es un pirata. Es la presa que hace verdadero al Filo y la que mueve bastante stock como para cambiar un precio.
- **Filo.** El que caza a la Urca con margen (11 nudos, 3 cañones, bodega 30) y aún así entra a vender a Cala. Su bodega de 30 no sustituye a la de 40 en un flete: el capital inmovilizado y el margen por viaje se quedan por debajo. Pesca mal. Come mucho combustible. Sin presas, pescar con él es empeorar.

Atraques, en reales, al entrar: Puerto Calma 10, Muelles de Brezo 15, Cabo Rojo 25, Cala Hundida 0.

### 3.6 Bienes y puertos al empezar la partida

Cinco bienes. Precio base y elasticidad entran en la fórmula de la sección 4.

| Bien | Precio base | Elasticidad | De dónde sale |
| --- | ---: | ---: | --- |
| Pescado | 22 | 1,0 | Solo de pescar. No lo produce ningún puerto |
| Sal | 8 | 0,4 | Puerto Calma. Sirve para salar |
| Madera | 12 | 0,6 | Puerto Calma. La ruta segura y mala |
| Hierro | 20 | 0,8 | Muelles de Brezo. El flete del corredor |
| Aceite | 18 | 0,8 | Cabo Rojo. El flete de vuelta por fuera |

Stock inicial, stock objetivo, producción por minuto y consumo por minuto.

**Puerto Calma.** Abrigo. Atraque 10. Vende munición: no.

| Bien | Stock | Objetivo | Prod./min | Cons./min |
| --- | ---: | ---: | ---: | ---: |
| Pescado | 16 | 28 | 0 | 0,6 |
| Sal | 70 | 40 | 2,0 | 0,2 |
| Madera | 64 | 36 | 1,6 | 0,2 |
| Hierro | 12 | 30 | 0 | 0,4 |
| Aceite | 6 | 22 | 0 | 0,5 |

**Muelles de Brezo.** Abrigo. Atraque 15. Vende munición: sí.

| Bien | Stock | Objetivo | Prod./min | Cons./min |
| --- | ---: | ---: | ---: | ---: |
| Pescado | 14 | 34 | 0 | 0,7 |
| Sal | 18 | 24 | 0 | 0,3 |
| Madera | 10 | 32 | 0 | 0,8 |
| Hierro | 100 | 60 | 2,0 | 0,3 |
| Aceite | 14 | 26 | 0 | 0,4 |

**Cabo Rojo.** Abrigo. Atraque 25. Vende munición: sí.

| Bien | Stock | Objetivo | Prod./min | Cons./min |
| --- | ---: | ---: | ---: | ---: |
| Pescado | 8 | 26 | 0 | 0,5 |
| Sal | 10 | 18 | 0 | 0,15 |
| Madera | 8 | 24 | 0 | 0,45 |
| Hierro | 36 | 80 | 0 | 1,0 |
| Aceite | 72 | 40 | 1,8 | 0,2 |

**Cala Hundida.** Sin abrigo, sin almacén, sin astillero, sin libro de stock. Compra botín al precio perista y lo destruye. Repara a precio y medio. No compra carga legal y no vende bienes.

### 3.7 Qué no entra en la versión 1

- Un segundo jugador, corporaciones, soberanía, flotas y chat de comercio.
- Cola de habilidades, niveles y cualquier espera que no sea la del propio viaje.
- Órdenes de compra, contratos, subastas y más bienes o más puertos.
- Un quinto casco, módulos, seguros con letra pequeña y pérdida permanente del barco.
- Fabricar, refinar o construir. Los puertos producen solos según la tabla.
- Misiones, facciones, reputación y diálogo.
- Velas, daño por tormenta y viento que haga algo más que el 10% de la sección 3.1.
- Mover un casco vacío como si fuera carga. La carga entre puertos solo viaja en una bodega.
- Que el perista revenda botín en un puerto legal. El botín se destruye al venderse en Cala.
- Deuda, intereses y alquiler de cascos.

## 4. Fórmulas

Todas las cifras de esta sección son los valores iniciales. Viven en datos, no en el código. Los mandos están reunidos en la sección 7.

**Precio local**

Para cada bien en cada puerto legal, con el stock y el objetivo de ese momento:

```
presion = clamp((objetivo - stock) / objetivo, -0,65, 0,50)
medio = base * (1 + presion * elasticidad)
compra_jugador = max(1, round(medio * 1,06))
venta_jugador = max(1, round(medio * 0,94))
```

`compra_jugador` es lo que el jugador paga por unidad. `venta_jugador` es lo que el jugador cobra. `round` es al entero más cercano, y el ,5 hacia arriba. `objetivo` nunca es menor que 1.

La presión va en línea recta entre −0,65 y 0,50 y se queda plana fuera. Con elasticidad 1, el medio se mueve entre el 35% y el 150% del base. Con elasticidad 0,8, entre el 48% y el 140%. El 6% a cada lado del medio es el corte del puerto: comprar y vender en el mismo muelle, en el mismo instante, pierde alrededor del 12%. Esa operación no es un oficio.

**Precio perista**

```
mejor_venta = max(venta_jugador de ese bien en Calma, Brezo y Cabo)
precio_perista = max(1, floor(mejor_venta * 0,75))
```

`floor` hacia abajo. Cala no tiene stock que mueva este precio.

**Combustible del tramo**

```
unidades = ceil(minutos_a_fondo * consumo_del_casco * |acelerador_medio|)
reales = unidades * 2
```

En los ejemplos de abajo el acelerador medio es 1 en la travesía y 0 durante el lance. `ceil` hacia arriba.

**Reparación**

```
reales = puntos_casco_que_faltan * 4 + puntos_motor_que_faltan * 6
```

En Cala Hundida, ese resultado por 1,5, y `round` al real.

**Neto del viaje**, tal como lo enseña la cuenta:

```
neto = cobrado_por_ventas - pagado_por_compras - combustible - atraque - municion - reparacion
```

La sal gastada al salar ya está dentro de lo pagado por compras si se compró en ese viaje. Si salió del almacén, cuenta como compra a 0 y el jugador ve el hueco: el diseño acepta esa lectura, porque la sal se pagó en un viaje anterior cuya cuenta ya se cerró.

**Curva de presión, hierro de ejemplo**

Base 20, elasticidad 0,8. Medio según presión ya recortada:

| Presión | Medio | El jugador paga | El jugador cobra |
| ---: | ---: | ---: | ---: |
| −0,65 | 9,60 | 10 | 9 |
| −0,30 | 15,20 | 16 | 14 |
| 0 | 20,00 | 21 | 19 |
| 0,25 | 24,00 | 25 | 23 |
| 0,50 | 28,00 | 30 | 26 |

**Ejemplo A. Primera pesca en la Luz**

Pescado en Calma al empezar: stock 16, objetivo 28.

```
presion = (28 - 16) / 28 = 0,4286
medio = 22 * (1 + 0,4286 * 1) = 31,429
venta_jugador = round(31,429 * 0,94) = round(29,543) = 30
```

Ocho pescados se cobran a 240 reales. Ida y vuelta a los Bajos: 0,8 millas a 7 nudos son 6,86 minutos a fondo. `ceil(6,86 * 1) = 7` unidades de combustible, 14 reales. Atraque en Calma, 10. Neto **216 reales** en unos 10 minutos (navegación más ocho lances). Siete viajes de este tipo, sin que el precio se hunda, pagan la Travesía (1.500). En la práctica el precio baja un poco al volcar pescado: el objetivo de afinado es 180–230 reales el viaje mientras el stock de Calma siga entre 12 y 24.

**Ejemplo B. Madera Calma → Brezo en la Travesía, la ruta que no conviene**

Madera en Calma: stock 64, objetivo 36.

```
presion = clamp((36 - 64) / 36, -0,65, 0,50) = clamp(-0,7778, ...) = -0,65
medio = 12 * (1 + (-0,65) * 0,6) = 12 * 0,61 = 7,32
compra_jugador = round(7,32 * 1,06) = round(7,759) = 8
```

Madera en Brezo: stock 10, objetivo 32.

```
presion = clamp((32 - 10) / 32, ...) = clamp(0,6875, ...) = 0,50
medio = 12 * (1 + 0,50 * 0,6) = 15,6
venta_jugador = round(15,6 * 0,94) = round(14,664) = 15
```

Margen 7 por unidad. Dieciséis unidades: 112 reales de margen. Una milla a 8,5 nudos: 7,06 minutos. Combustible `ceil(7,06 * 2) = 15` unidades, 30 reales. Atraques 10 y 15. Neto **57 reales**. El mismo tiempo, pescando, deja varios cientos. La ruta segura está viva para que se pueda cruzar sin piratas, y muerta como negocio. Con la Urca y 40 unidades el margen sube a 280, el combustible de ida y vuelta se lleva 132 y los atraques 25: neto alrededor de **123 reales** por más de 20 minutos. Sigue siendo peor que un tramo de hierro. Si alguien «arregla» la madera para que sea el mejor flete, la patrullera se convierte en la estrategia dominante y el corredor deja de importar.

**Ejemplo C. Hierro Brezo → Cabo en la Urca, la ruta que sí conviene**

Hierro en Brezo: stock 100, objetivo 60.

```
presion = clamp((60 - 100) / 60, ...) = -0,65
medio = 20 * (1 - 0,52) = 9,6
compra_jugador = round(10,176) = 10
```

Hierro en Cabo: stock 36, objetivo 80.

```
presion = clamp((80 - 36) / 80, ...) = clamp(0,55, ...) = 0,50
medio = 20 * 1,4 = 28
venta_jugador = round(26,32) = 26
```

Cuarenta unidades. Se pagan 400 y se cobran 1.040. Margen 640. Distancia 1,5 millas a 5,5 nudos: 16,36 minutos. Combustible `ceil(16,36 * 3) = 50` unidades, 100 reales. Atraques 15 y 25. Neto **500 reales** si nadie aborda. Al vender, el stock de Cabo pasa a 76 y la presión cae a `(80 - 76) / 80 = 0,05`. El mismo tramo, al minuto siguiente, ya no es este tramo. Hay que esperar al consumo (1,0 por minuto) o hacer otra cosa.

**Ejemplo D. Aceite Cabo → Calma en la Urca**

Aceite en Cabo: stock 72, objetivo 40.

```
presion = clamp((40 - 72) / 40, ...) = -0,65
medio = 18 * 0,48 = 8,64
compra_jugador = round(9,158) = 9
```

Aceite en Calma: stock 6, objetivo 22.

```
presion = clamp((22 - 6) / 22, ...) = 0,50
medio = 18 * 1,4 = 25,2
venta_jugador = round(23,688) = 24
```

Cuarenta unidades. Margen 15, total 600. Distancia 1,9 millas a 5,5 nudos: 20,73 minutos. Combustible `ceil(20,73 * 3) = 63` unidades, 126 reales. Atraques 25 y 10. Neto **439 reales**. Junto con el ejemplo C, y solo si los dos se hacen con los stocks de arranque, el circuito da unos 940 reales. En cuanto el primer tramo se ha vendido, el segundo ya no usa esta tabla. El objetivo de afinado del circuito real, con los precios ya movidos, es 800–1.100 reales si las dos puntas seguían hambrientas, y bastante menos si Cabo ya recibió hierro de un mercante.

**Ejemplo E. El Filo vende en Cala lo que le quitó a un mercante de aceite**

Mejor compra legal del aceite al empezar: 24 en Calma. Precio perista `floor(24 * 0,75) = 18`. El Filo vacía 30 unidades: cobra 540. Un acecho de 9 minutos a fondo gasta `ceil(9 * 4) = 36` unidades, 72 reales. Cuatro disparos, 24 reales de munición. Una reparación de 20 puntos de casco, 80 reales, si el pirata no jugador acertó en el camino. Neto **364 reales** cuando la presa existía y el combate salió regular. Si no hay mercante, el viaje es negativo: combustible, munición y nada que vender. El objetivo de afinado es 300–550 reales el asalto que sí cobra, y una racha con un fracaso de cada tres acercándose al neto por minuto de la pesca, no doblándolo.

**Tiempos de combate que anclan el daño**

- Motor de la Urca: 28 puntos, daño 8. Hacen falta 4 impactos. El Filo puede soltar 3 cañones y esperar una recarga de 6 segundos para el cuarto. Una pasada bien hecha desactiva en torno a 8 segundos de fuego, más el tiempo de acercarse.
- Casco de la Urca: 130 puntos, daño 14. Hacen falta 10 impactos para hundirla. Hundir cuesta más munición que abordar y no da más botín del que ya cabía. Abordar es la jugada que gana dinero. Hundir es la jugada que encarece la ruta.
- El pirata no jugador, con daño 10 y un disparo cada 4 segundos entre dos cañones, no borra a la Urca en un encuentro corto. El jugador de la Urca tiene tiempo de verlo venir. No tiene tiempo de llegar a puerto si lo engancharon en mitad del tramo de 1,5 millas. La defensa de la Urca es no estar ahí cuando el margen no paga el riesgo, no ganarle el tiroteo.

## 5. Casos límite

- **Objetivo de stock a 0.** No puede ocurrir con los datos de la versión 1. Si ocurre por un dato mal puesto, se trata como 1 antes de dividir.
- **Stock negativo.** No se permite. La compra se recorta a lo que hay. El consumo a stock 0 no hace nada.
- **Stock por encima del doble del objetivo.** La producción de ese bien en ese puerto no suma. El jugador sí puede seguir vendiendo y empujar el stock más arriba. La presión ya está en el suelo (−0,65), así que el precio no baja más. Vender ahí es tirar el bien a cambio del mínimo.
- **Precio 0.** `max(1, ...)` en compra, venta y perista. No hay división por precio en ninguna fórmula.
- **Bodega llena a mitad de un lance o de un abordaje.** El lance no empieza. El abordaje mueve solo lo que cabe y deja el resto. No se pierde el derecho de abordaje: ya se usó, y el resto se queda en la víctima con la regla normal.
- **Tirar carga al agua.** Desaparece a los 120 segundos si nadie la recoge. Conserva o no la marca de botín. Tirar sube `factor_carga` en el acto. Es legal tirar botín, pescado a punto de pudrirse o flete, para correr más.
- **Recoger el propio pecio.** No es botín. Recoger el pecio de otro, o el fardo que otro tiró marcado, sí lo es. Recoger un fardo legal que otro tiró lo mantiene legal.
- **Botín dentro de la Urca.** Cabo, Brezo y Calma no lo compran. El canal de Cala no la deja entrar. Puede tirarlo o pasarlo a un Filo, una Travesía o una Luz si los pone a distancia de abordaje y se cumplen las condiciones de abordaje, con el dueño eligiendo el bien. El abordaje entre cascos del mismo dueño usa la misma regla de transferencia y no marca como botín lo que ya era legal. Esto evita un callejón sin salida sin abrir un menú de trueque nuevo.
- **Dinero que no llega a reparar.** Se zarpa igual, con los puntos que haya, con mínimo 1 de casco tras un hundimiento. No hay embargo.
- **Munición en Calma.** No se vende. La Luz tampoco la gastaría. Quien quiera balas tiene que ir a Brezo o a Cabo. El primer cañón de la vida del jugador, el de la Travesía, no sale cargado de serie: el depósito de munición de un casco nuevo está a 0.
- **Disparar en abrigo.** El disparo no sale. La munición no se gasta.
- **Varar a un perseguidor.** Si el pirata, jugador o no, entra en agua menor que su mínimo, se detiene y pierde 4 puntos de casco por segundo como cualquiera. La Luz se salva en los Bajos por geografía, no por inmunidad.
- **Mercantes sin margen.** Si ningún tramo paga más de 200 reales brutos a bodega de 40, no zarpan. El Filo se queda sin oficio hasta que el consumo reabre un hueco. Pescar o esperar son las salidas. No aparece una presa de consolación.
- **Un solo jugador vacía el corredor y luego lo explota.** Permitido. Es pescar, piratear y traficar en serie, que es la fantasía de la mezcla. Si el neto de «hundir y después vender yo» gana siempre al neto de «vender yo sin hundir», se sube el precio de la munición o la recarga, que están en los mandos. No se prohíbe la secuencia.
- **Voltear en el mismo puerto.** Comprar y vender el mismo bien en el mismo instante pierde el corte del 6% a cada lado. No es una fuente de dinero.
- **Pescado que caduca en el muelle.** El plazo corre también atracado, pausa aparte. Vender es la forma de pararlo, además de salar.
- **Dos bienes con el mismo precio base en un abordaje.** Se roba primero el que más unidades ocupe. Si también empatan las unidades, se roba el que vaya primero en esta lista fija: aceite, hierro, madera, sal, pescado.
- **La patrullera.** No tiene bodega, no se aborda, no paga recompensa. Dispararle gasta munición y acaba en hundimiento. Es un sumidero para quien se equivoca de blanco, no una presa.
- **Guardar y cargar.** El stock y la riqueza de los caladeros persisten. Reiniciarlos al cargar borraría la razón del precio. Una partida nueva sí empieza con las tablas de la sección 3.6.

Estrategias que no deben volverse las únicas, y cómo se evita:

- **Solo madera por el tramo patrullado.** El ejemplo B enseña que el neto es pobre. Se mantiene pobre mientras el tope de presión no deje subir más el precio de un bien de base 12.
- **Solo pesca en la Luz, para siempre.** Válido y seguro. Por minuto se queda por debajo de un tramo de Urca que sí cobra (216 reales en 10 minutos contra unos 500 en 16). No se castiga con aburrimiento forzado: los Bajos se regeneran.
- **Solo piratería.** Sin mercantes el ingreso es cero y el combustible sigue costando. Los mercantes existen mientras el margen exista. El perista paga el 75% del mejor compra legal, nunca más que haber hecho el flete.
- **El Filo como carguero.** Bodega 30 contra 40, consumo 4 contra 3, y el mismo corte de precios. El flete legal le sale peor que a la Urca. Su depósito de 55 y su consumo lo hacen caro de pasear vacío.

## 6. Dependencias

Esto es un contrato entre sistemas de juego, no una elección de motor.

| Sistema | Necesita | Entrega |
| --- | --- | --- |
| Navegación | Cifras del casco, peso de la bodega, viento, corriente, profundidades | Posición, velocidad, varada, choque |
| Bodega y almacén | Casco activo, puerto actual | Espacios usados, marca de botín, plazo del pescado |
| Precios | Stock, objetivo, base, elasticidad | Compra, venta, margen bruto que se muestra en el muelle |
| Oficios | Navegación, bodega, precios, cañones | Altas y bajas de bienes, botín, riqueza del caladero |
| Astillero | Reales, lista de cascos poseídos | Casco nuevo vacío, disponible en todo puerto legal |
| Tráfico no jugador | Precios y stock | Compras y ventas que mueven el stock aunque el jugador pesque |
| Cuenta del viaje | Lo gastado y lo cobrado desde el desatraque | Neto legible al vender |
| Partida guardada | Todos los anteriores | El mismo stock al volver a cargar |

El bucle de navegación no pregunta en qué oficio está el jugador. El bucle de precios no pregunta qué casco lleva, salvo en el sentido obvio de cuántas unidades caben. El astillero no pregunta cuántos viajes lleva: solo si alcanza el dinero.

Datos que tienen que existir fuera del código, con los valores de este documento como origen: cascos, bienes, puertos, caladeros, distancias, atraques, daño, recarga, precios del combustible y de la munición, y los umbrales 200 reales (mercantes) y 0,75 (perista).

## 7. Mandos de ajuste

Tres tipos. Sensación: se tocan jugando. Curva: se tocan con la fórmula, porque cambian la forma del ingreso. Compuerta: se tocan para alargar o acortar la sesión y la escalera. Ninguno se deja escrito a fuego en la lógica.

| Mando | Tipo | Valor inicial | Rango sano | Para qué |
| --- | --- | ---: | --- | --- |
| Velocidad máxima, aceleración y giro de cada casco | Sensación | Tabla de la sección 3.5 | ±20% sin cruzar el orden Filo > Travesía > Luz > Urca en nudos | Que el barco se sienta distinto en los primeros 30 segundos |
| Peso de la bodega (el 0,30 de `factor_carga`) | Sensación | 0,30 | 0,15–0,45 | Cuánto duele ir lleno en una persecución |
| Viento máximo | Sensación | 0,10 | 0–0,15 | Mar de verdad sin convertir la versión 1 en un sim de vela |
| Tope de presión (−0,65 y 0,50) | Curva | −0,65 / 0,50 | Suelos −0,8 a −0,4. Techos 0,35 a 0,7 | Cuánto puede llegar a pagar una escasez. Subir el techo enriquece el corredor |
| Elasticidad por bien | Curva | 1,0 / 0,4 / 0,6 / 0,8 / 0,8 | 0,3–1,2 | Qué bienes merecen un desvío |
| Corte del puerto (el 0,06) | Curva | 0,06 | 0,04–0,12 | Que voltear en el mismo muelle pierda dinero |
| Precio base de cada bien | Curva | 22, 8, 12, 20, 18 | ±30% | El tamaño del margen. La madera tiene que seguir siendo el mal negocio |
| Producción y consumo por minuto | Curva | Tablas de la sección 3.6 | La mitad o el doble | Cuánto tarda una ruta en reabrirse después de un viaje de 40 unidades |
| Coeficiente del perista | Curva | 0,75 | 0,6–0,85 | Por debajo de 0,6 la piratería no paga el combustible. Por encima de 0,85 robar gana a comerciar |
| Precio de los cascos | Compuerta | 1.500 / 4.200 / 4.600 | ±25% | La hora y media hasta la Travesía y las tres horas hasta el casco caro |
| Atraques | Compuerta | 10 / 15 / 25 / 0 | 0–40 | El suelo de coste de un viaje corto |
| Precio del combustible | Compuerta | 2 reales | 1–4 | Apaga rutas de margen pequeño. El ejemplo B tiene que seguir en números bajos |
| Plazo del pescado crudo | Compuerta | 480 s | 300–900 | Obliga a salar si se quiere traficar pescado lejos |
| Espera entre lances | Compuerta | 16 − pesca×2 s | 8–20 s de base | Ingreso de la pesca sin tocar el precio |
| Recarga del cañón y precio de la munición | Compuerta | 6 s y 6 reales | 4–10 s, 3–12 reales | El coste de hundir para manipular el precio |
| Umbral de los mercantes | Compuerta | 200 reales brutos a bodega llena | 100–400 | Por debajo de qué margen el corredor se queda vacío de presas |
| Minutos de reaparición de mercante y de pirata | Compuerta | 8 y 6 | 4–15 | Cuánto castigo es limpiar el corredor |

Si un viaje de pesca de la Luz se sale de 180–230 reales, se toca primero el precio base del pescado o la espera entre lances, no la velocidad del barco. Si el hierro se sale de 440–550 reales netos en la Urca con los stocks de arranque, se toca primero el base del hierro o el precio del combustible. Si el Filo, con presa, se sale de 300–550, se toca el coeficiente del perista.

## 8. Criterios de aceptación

**Funciona si:**

- Con los stocks de arranque, la cuenta del ejemplo A da 216 reales, la del B da 57, la del C da 500 y la del D da 439, usando las fórmulas de la sección 4 sin números escondidos.
- Comprar y vender el mismo bien en el mismo puerto y en el mismo instante no aumenta los reales.
- La Luz entra en los Bajos. La Travesía, la Urca y el Filo no.
- La Urca no entra en Cala Hundida. El Filo sí, y puede vender allí botín que un puerto legal rechazó sin borrarlo.
- Un pescado crudo desaparece a los 480 segundos. Cuatro pescados salados gastan 1 sal y ya no desaparecen.
- Entregar 40 de hierro en Cabo con el stock inicial de 36 deja el stock en 76 y la presión por debajo de 0,10.
- Con todos los márgenes brutos de bodega llena por debajo de 200 reales, los mercantes no zarpan.
- Hundirse devuelve el casco al último puerto legal, con el 25% de casco y de motor, sin borrar el casco de la lista de poseídos y sin quitar reales.
- Se pueden poseer los cuatro cascos a la vez, cambiar de casco en cualquier puerto legal, y la carga no cambia de puerto al cambiar de casco.
- La partida guardada restaura el stock. Una partida nueva restaura las tablas de la sección 3.6.

**Se siente bien si, en una prueba de una hora con una persona que no ha leído este documento:**

- El primer viaje de pesca en la Luz se completa sin un tutorial de texto, y al vender entiende las líneas de la cuenta.
- En algún momento deja una ruta porque el margen no cubre el viaje, y lo dice con sus palabras. Si nunca mira el precio, el muelle no está enseñando el margen bruto.
- Después de llenar Cabo de hierro, no repite el mismo tramo al minuto. Se va a pescar, a por aceite o a esperar. Si repite y sigue ganando lo mismo, el consumo o la presión no se están aplicando.
- Al probar la Travesía, nota que hace algo que la Luz no hacía (Banco, flete de más de 8, o un cañón), y que la Luz sigue siendo la que entra en los Bajos.
- Un abordaje con el Filo acaba en Cala con menos reales por unidad de los que el mercante habría cobrado en el destino, y la persona lo ve en la cuenta.
- Perder la Urca en el corredor duele por la carga y por la reparación, y la persona vuelve a salir con ese mismo casco en la misma sesión. Si abandona el casco porque teme perderlo para siempre, se ha colado una muerte permanente que esta versión no tiene.

El documento se da por fallido si la forma más rentable y más segura es la misma forma. En la versión 1 la forma segura es pescar los Bajos con la Luz. La forma rentable es cruzar el corredor con la Urca o cazar a quien lo cruza con el Filo. Las dos tienen que seguir siendo ciertas después de afinar.

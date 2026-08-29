import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const es: Partial<HomeCell> = {
  title: 'Este es el starter de tu aplicación',
  // Описание для ПОИСКА — коротко: сниппет обрезается примерно на 160 знаках.
  // Развёрнутый текст первого экрана живёт в секции `heroSplit` ниже.
  description: 'Tu servidor, tu código: autorización, base de datos, almacenamiento y búsqueda vectorial ya conectados. Crea una landing page o un SaaS en 82 idiomas.',
  keywords: '',
  blocks: [
  {
    kind: 'heroSplit',
    pill: 'Infraestructura de ingeniería agéntica',
    title: 'Este es el starter de tu aplicación',
    description:
      'Todo ya está instalado y conectado entre sí — autorización, tu propia base de datos, almacenamiento de archivos, búsqueda vectorial y un centenar de herramientas más, ordenadas de modo que un agente de programación las encuentre sin que haya que explicárselo dos veces. Crea una página de aterrizaje, un SaaS o una automatización que nunca duerme, en cualquiera de los 82 idiomas, sobre un esqueleto pensado para un proyecto que superará el millón de líneas. Alrededor de **nueve veces más rápido** que montar tú mismo la misma pila — y aquí nada llama a casa: ni proveedor, ni suscripción, ni permiso que pedir. El servidor es tuyo, el código es tuyo, **al cien por cien**.',
    cta: { href: 'https://www.fractera.ai/deployments/vps', label: 'Llévatelo gratis y escala' },
    image: 'homePage',
    imageAlt: 'Plantilla inicial de SaaS',
  },
  // 🔒 ЛЕНТА НАПРАВЛЕНИЙ — ПЕРВОЕ, ЧТО ИДЁТ ЗА ПЕРВЫМ ЭКРАНОМ (владелец
  // 2026-08-22). Человек, только что прочитавший, ЧТО это, сразу видит, ЧТО этим
  // строят: двадцать два направления проходят перед ним прежде любых доводов.
  // Она стоит вне ленты страницы, во всю ширину, вместе с рядом ярлыков.
  { kind: 'projectTypeMarquee' },
  // 🔒 РЯД МЕР УШЁЛ ВНИЗ, под виджет безопасности (владелец 2026-08-22). Три
  // множителя — это довод, а доводу место после того, как названа ценность:
  // сначала «безопасность встроена в основу», потом «во сколько раз дешевле»,
  // и только потом «как это работает».
  //
  // Механически: ряда мер больше нет среди поднятых видов (`LEAD_KINDS` в
  // `_data/index.ts`), поэтому он рисуется в ленте страницы — первым её блоком.
  {
    kind: 'metrics',
    items: [
      { value: '×4', label: 'más barato de construir' },
      { value: '×9', label: 'más rápido de lanzar' },
      { value: '×100', label: 'más fiable en producción' },
    ],
  },
  {
    kind: 'badges',
    items: [
      { label: 'Open Code', tone: 'code' },
      { label: '82 idiomas', tone: 'reach' },
      { label: 'SEO incorporado', tone: 'reach' },
      { label: 'AIO navegación agéntica', tone: 'reach' },
      { label: 'Base de datos propia', tone: 'data' },
      { label: 'Búsqueda vectorial', tone: 'data' },
      { label: 'Grafo de conocimiento', tone: 'data' },
      { label: 'Almacenamiento propio', tone: 'data' },
      { label: 'Autorización', tone: 'access' },
      { label: '{roles} roles', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Telegram', tone: 'code' },
      { label: 'Arquitectura Fractera', tone: 'code' },
      { label: 'Enrutamiento paralelo · 12 slots', tone: 'code' },
      { label: 'Next 16+', tone: 'code' },
      { label: '100+ más', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Proceso',
    title: 'Cómo funciona',
    note: 'De un servidor vacío a tu propio código en producción. Todo lo de abajo corre sobre hardware que es tuyo.',
    steps: [
      { title: 'Levanta el servidor', text: 'Despliégalo con el [robot instalador](https://www.fractera.ai/deployments/vps) de Fractera. Obtienes un sistema operativo, una plantilla de inicio, el panel de control, los almacenamientos y la autorización — instalados y conectados entre sí.' },
      { title: 'Desarrolla donde ya trabajas', text: 'Sincroniza con GitHub, luego clona en tu propia máquina y ejecuta Claude Code o Codex. Los datos siguen llegando de tu servidor; el código se ejecuta en tu propio IDE.' },
      { title: 'Haz push y se despliega solo', text: 'Termina en la máquina local y envía el proyecto a GitHub. Eso lanza de inmediato un nuevo despliegue en tu propio servidor — y el visitante ve el nuevo proyecto.' },
    ],
  },
  // 🔒 ПЕРЕНОС ЧУЖОГО ПРОЕКТА — ЧЕТВЁРТЫЙ ТИП РАБОТЫ (владелец 2026-08-22).
  // Раздел описывает НАМЕРЕНИЕ, и это сказано в нём прямо: сегодня шаги, из
  // которых миграция состоит, ещё строятся. Раздел, обещающий готовую кнопку,
  // стоит дороже отсутствующего — за ним приходят и не находят.
  {
    kind: 'cards',
    badge: 'Primeros pasos',
    title: 'Cómo empezar',
    note: 'Todo lo de abajo ya está instalado — lo estás activando, no construyendo. A la izquierda, el camino; a la derecha, lo que evita recorrerlo dos veces.',
    cols: 2,
    children: [
      {
        kind: 'card',
        tone: 'data',
        children: [
          { kind: 'h3', text: 'Siete pasos desde un servidor vacío' },
          { kind: 'p', text: 'Lanza el [robot instalador](https://www.fractera.ai/deployments/vps) para obtener este proyecto.' },
          {
            kind: 'olist',
            items: [
          'Abre el panel de control — todo sobre este servidor se configura ahí. [Panel de control]({admin}/{lang})',
          'Elige los idiomas en los que funcionará tu aplicación. [Idiomas]({admin}/{lang}/languages)',
          'Usa los ajustes para describir tu proyecto: nombre, descripción, logo, SEO. [Ajustes de la app]({admin}/{lang}/app-settings)',
          'Conecta GitHub y envía el código del servidor a tu repositorio. [GitHub]({admin}/{lang}/github)',
          'Clona ese repositorio en tu propia máquina, desarrolla ahí y envía los cambios de vuelta.',
          'Lleva el archivo de entorno `.env.local` a tu máquina — git nunca lo transporta y sin él la copia local no arranca. [Variables de entorno]({admin}/{lang}/env)',
          'Pulsa Desplegar en el panel — el servidor toma tu commit y se reconstruye solo. [Despliegues]({admin}/{lang}/deployments)',
            ],
          },
        ],
      },
      {
        kind: 'card',
        tone: 'access',
        children: [
          { kind: 'h3', text: 'Recomendado antes de empezar' },
          { kind: 'p', text: 'Nada de esto bloquea nada. Los tres ahorran rehacer trabajo.' },
          {
            kind: 'list',
            items: [
              '**Una clave de OpenAI.** Sin ella el Quiz no hace preguntas, y sin casos el agente programador se niega a construir. El sitio sigue funcionando — solo quedan vacíos la búsqueda vectorial y el grafo de conocimiento. Se introduce una vez; el gasto va directo a tu proveedor de modelo. [Clave OpenAI]({admin}/{lang}/openai)',
              '**Tu propio dominio.** En una dirección numérica no hay certificado ni aplicación instalable — el navegador solo los concede sobre conexión segura. Mudarse después cambia la dirección de cada página, así que sale más barato antes de que las indexen. [Dominio]({admin}/{lang}/domain)',
              '**Extensión de Claude para Chrome.** Sin ella el agente solo ve el código: los errores de consola, el comportamiento sin JavaScript y el aspecto real de la página no están escritos en ninguna parte. Con ella abre la página él mismo y arregla lo que hay, no lo que supuso. [Herramientas de desarrollo]({admin}/{lang}/dev-tools)',
            ],
          },
        ],
      },
    ],
  },
  {
    kind: 'cards',
    badge: 'Antes de cualquier código',
    title: 'Quiz — siete preguntas en vez de una página en blanco',
    note: 'El error más caro de un proyecto se comete antes de la primera línea de código: se construye lo que no era. No por construir mal, sino porque «por dónde empiezo» es difícil de responder en solitario. Quiz lo convierte en una conversación: tú respondes, el modelo sigue preguntando, y de ahí crece la lista de escenarios con la que luego se construye el proyecto.',
    children: [
      { kind: 'card', children: [{ kind: 'h3', text: 'La semilla' }, { kind: 'p', text: 'Siete preguntas breves: qué es el producto, para quién es, con qué debería quedarse una persona. Responde con tus propias palabras — el dictado funciona. Todo lo que sigue crece desde aquí, así que un par de frases da un resultado notablemente mejor que un par de palabras.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'La conversación' }, { kind: 'p', text: 'Después, una pregunta a la vez, en tu idioma. Existe un autoquiz: el modelo hace cinco preguntas nuevas y se las responde él mismo, profundizando la descripción — pero todo lo que haya inventado en tu nombre queda marcado como «Suposición», y tú lo corriges. Una conjetura pasada por hecho aparecería más tarde, dentro de los escenarios terminados.' }] },
      { kind: 'card', children: [{ kind: 'h3', text: 'Los escenarios' }, { kind: 'p', text: 'La conversación se sintetiza en casos numerados: quién llega, qué hace, qué debe ser cierto al final. Los lees y confirmas uno por uno. Un caso sin leer sigue siendo la conjetura del modelo.' }] },
    ],
  },
  { kind: 'statement', text: 'Y esto no es un consejo, sino una regla del producto: mientras quede un solo caso sin confirmar, el panel mantiene la alarma encendida y el agente programador se niega a construir. Construir sobre una conjetura sin leer cuesta más que no construir nada.' },
  { kind: 'cta', href: 'https://www.fractera.ai/deployments/vps', label: 'Llévatelo gratis y escala' },
  {
    kind: 'cards',
    badge: 'Arquitectura',
    title: 'Qué es este proyecto, técnicamente',
    note: 'Tres cosas que conviene saber antes de construir: qué es este esqueleto, dónde se escribe realmente el código y qué pasa cuando el proyecto supera sus primeras cien páginas.',
    children: [
      { kind: 'card', children: [{ kind: 'p', text: 'Esto no es un sitio terminado sino la arquitectura Fractera: un mismo esqueleto sostiene tanto una landing page como un SaaS grande o una automatización multinivel. Crecer no exige reescribir — las capas de datos, autorización y panel ya están separadas, y cada una está pensada para una carga que aún no tienes.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'El código no se escribe aquí. Un desarrollador clona el repositorio en su propia máquina y trabaja con Claude Code, que lee las instrucciones y habilidades que viven dentro del proyecto: ellas fijan las reglas, y las comprobaciones automáticas no dejan que se rompan. El servidor solo recibe el resultado y se reconstruye.' }] },
      { kind: 'card', children: [{ kind: 'p', text: 'El esqueleto está pensado para un proyecto que superará el millón de líneas: cada entidad tiene su propia carpeta, la capa compartida no crece con su número, y las rutas y permisos se declaran donde se aplican. La estabilidad aquí no es una promesa sino una consecuencia — una página nueva no añade nada a un núcleo central.' }] },
    ],
  },
  {
    kind: 'quote',
    lead: 'Listo para alta carga',
    text:
      'La realidad oculta del vibe coding: la mayor parte de un proyecto se construye sin pensar en la alta carga, en ahorrar consultas a la base de datos, en el caché. No porque los desarrolladores no lo sepan — sino porque mantener ese estándar dentro de un framework es realmente difícil. Demasiadas cosas pequeñas empujan en silencio una página desde la generación estática hacia el renderizado dinámico. Y la diferencia no es del cinco ni del diez por ciento: en algunos casos la carga sobre su servidor crece mil veces, y con ella crece su factura de servidores y plataformas. Fractera está construida sobre una experiencia larga: más de treinta años de desarrollo web. Todo lo relativo a la alta carga, la optimización para buscadores y el ahorro en bases de datos está escrito en el ADN del proyecto. Es su esqueleto y su fuerza vital. Y es suya gratis.',
    cite: 'Roma Armstrong · fundador de Fractera',
  },
  {
    kind: 'noBill',
    badge: 'Independencia',
    heading: 'Un espacio totalmente independiente',
    note: 'En un proyecto habitual son tres servicios ajenos: sus precios, sus condiciones y su permiso para que tu proyecto siga funcionando. Aquí los tres viven en tu propio servidor.',
    items: [
      { vendor: 'Vercel', text: 'no pagas a', badge: { label: 'alojamiento', tone: 'reach' } },
      { vendor: 'Neon', text: 'no pagas a', badge: { label: 'base de datos', tone: 'data' } },
      { vendor: 'Clerk', text: 'no pagas a', badge: { label: 'autorización', tone: 'access' } },
    ],
    title: 'No pagas a nadie',
    text: 'No dependes de nadie. El proyecto es tuyo por completo.',
    cta: { page: 'architecture' },
  },
  {
    kind: 'problemSolution',
    badge: 'Mudarse es fácil',
    title: 'Cómo trasladar su proyecto a la arquitectura Fractera',
    note: 'Su proyecto ya funciona — en Vercel o en cualquier otro sitio. Y usted paga: por el alojamiento, por la base de datos, por guardar las imágenes, por la autorización, por el correo. Cada servicio le factura por separado, y cada factura crece con usted. El traslado parece imposible, y no lo es: Fractera desmonta su proyecto y lo vuelve a montar sobre su propia arquitectura, en el servidor de usted, donde todo eso ya está y no cuesta nada aparte.',
    demandLabel: 'Qué hace usted',
    answerLabel: 'Por qué funciona en Fractera',
    items: [
      {
        title: 'Instalar Fractera',
        demand: 'Compre un servidor — desde tres euros al mes. Compre un dominio — desde un dólar al año. Ponga en marcha el robot instalador y siga sus indicaciones: lo demás lo hace él solo.',
        answer: 'Tres euros son toda su factura de alojamiento. No la del primer mes, ni «hasta que supere el límite», sino toda. La base de datos, el almacén de imágenes, el acceso con contraseña y el correo ya están en su servidor e incluidos en esos tres euros. No queda nada por pagar aparte.',
      },
      {
        title: 'Elegir el modo traslado',
        demand: 'En el panel abra la pestaña «Traslado a Fractera» e indique la dirección de su repositorio. Durante la mudanza conviene que sea público — el suyo y el de Fractera; puede cerrarlos de nuevo cuando quiera. Guarde el modo.',
        answer: 'Es el único ajuste que usted toca a mano. A partir de aquí el proyecto sabe que se está mudando y actúa en consecuencia: no construye desde una página en blanco, desmonta lo que usted ya tiene escrito.',
      },
      {
        title: 'Avisar al agente',
        demand: 'Abra el proyecto en su editor, en su propia máquina, donde trabaja habitualmente. Arránquelo y dígale al agente que empieza la mudanza. Con palabras normales, como se lo diría a un compañero.',
        answer: 'A partir de ahí él lee su proyecto antiguo por su cuenta: qué arquitectura tiene, qué bibliotecas usa, qué depende de qué. Usted no tiene que explicar ni recordar nada: él mira el código, no su memoria.',
      },
      {
        title: 'Recibir el plan por pasos',
        demand: 'Nada. Mire lo que ha salido: la tarea enorme «trasladar el proyecto» está desplegada en pasos, cada uno con su número y su objetivo.',
        answer: 'La mudanza deja de dar miedo porque deja de ser un bloque único. Usted ve la lista: qué está hecho, qué se está haciendo, qué viene después. No hay dónde atascarse a mitad y perder el hilo.',
      },
      {
        title: 'Levantar el esqueleto',
        demand: 'Responda a las preguntas sobre permisos: quién podrá ver y cambiar qué en su aplicación. Son pocas y todas hablan de su producto, no de tecnología.',
        answer: 'Primero se levanta el armazón: direcciones de páginas, tablas, acceso, repositorios — público para el código y cerrado para lo que no debe verse. El armazón se levanta una vez, y el proyecto crece dentro de él en lugar de rehacerse con cada función nueva.',
      },
      {
        title: 'Añadir las funciones',
        demand: 'Recorra los pasos. Un paso, una función: una página, un formulario, un cobro, los correos. Marque lo hecho y añada lo nuevo cuando se le ocurra.',
        answer: 'Cada paso se comprueba y a usted le enseñan que funciona: no «la compilación pasó», sino una página viva con su propio texto. Por eso siempre sabe dónde está y nunca se queda con un proyecto que «más o menos está listo».',
      },
      {
        title: 'Trasladar los datos',
        demand: 'Dé al agente acceso a sus bases. Trasladará lo que ya se ha acumulado: usuarios, pedidos, textos, imágenes.',
        answer: 'Es el último paso. Después tiene en su propio servidor una copia completa y funcionando del proyecto — con sus datos, su gente y su dominio. Las facturas antiguas pueden cancelarse: a partir de ahora paga el servidor y el dominio, nada más.',
      },
    ],
  },
  {
    kind: 'languageMarquee',
    title: 'Ochenta y dos idiomas, listos antes de que los necesites',
    note: 'Todos vienen con el producto: activas los que habla tu mercado. La generación estática, la optimización para buscadores y para IA, el caché de datos y la preparación para carga alta mantienen la eficiencia en lo más alto del sector — y la mantienen igual tanto si trabajas con un idioma, con varios o con los ochenta y dos.',
  },
],
  faq: [
    {
      q: '¿Cuánto cuesta y hay cargos ocultos?',
      a: 'No hay cargos ocultos porque no hay a quién pagar: la plataforma es código abierto, y todo lo que instale y use le pertenece al cien por cien. Sus gastos son su servidor, su dominio y la IA en la nube si la usa; eso lo calcula usted y lo paga directamente al proveedor. Nosotros no cobramos suscripción, ni porcentaje, ni tarifa por usuario.',
    },
    {
      q: '¿Cuál es la ventaja principal?',
      a: 'La fiabilidad: ahí está puesta la apuesta. Hoy hay muchas formas de montar una aplicación deprisa, y conviene no hacerse ilusiones: casi todas están hechas para que usted pague ante todo sus propios errores. Una aplicación eficiente le interesa solo a usted; a quien le vende servicios le interesa que compre y pague cuantos más servicios sueltos mejor. Lo caro llega después: incumplir la ley y ser multado por dónde están los datos, cortes imprevistos, sanciones y sencillamente la pérdida de sus datos. Fractera cierra eso manteniéndolo todo en su propio servidor.',
    },
    {
      q: '¿Y si necesito más?',
      a: 'Su herramienta principal es la suya — Claude Code, Codex u otra — y funciona en su propia máquina. El proyecto escala mucho: el esqueleto está pensado para millones de líneas y sigue siendo eficiente. Y si necesita un cambio conceptual de arquitectura al nivel del panel de control, o construir la aplicación todavía le resulta difícil, envíe una solicitud a admin@fractera.ai y un desarrollador se pondrá en contacto y le propondrá una solución.',
    },
  ],
}

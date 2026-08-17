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
    image: 'homePage',
    imageAlt: 'Plantilla inicial de SaaS',
  },
  { kind: 'projectTypeMarquee' },
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
      { label: '100+ más', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    badge: 'Proceso',
    title: 'Cómo funciona',
    note: 'De un servidor vacío a tu propio código en producción. Todo lo de abajo corre sobre hardware que es tuyo.',
    steps: [
      { title: 'Levanta el servidor', text: 'Despliégalo con el robot instalador de Fractera. Obtienes un sistema operativo, una plantilla de inicio, el panel de control, los almacenamientos y la autorización — instalados y conectados entre sí.' },
      { title: 'Desarrolla donde ya trabajas', text: 'Sincroniza con GitHub, luego clona en tu propia máquina y ejecuta Claude Code o Codex. Los datos siguen llegando de tu servidor; el código se ejecuta en tu propio IDE.' },
      { title: 'Haz push y se despliega solo', text: 'Termina en la máquina local y envía el proyecto a GitHub. Eso lanza de inmediato un nuevo despliegue en tu propio servidor — y el visitante ve el nuevo proyecto.' },
    ],
  },
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
          { kind: 'h3', text: 'Seis pasos desde un servidor vacío' },
          {
            kind: 'olist',
            items: [
          'Abre el panel de control — todo sobre este servidor se configura ahí. [Panel de control]({admin}/{lang})',
          'Elige los idiomas en los que funcionará tu aplicación. [Idiomas]({admin}/{lang}/languages)',
          'Usa los ajustes para describir tu proyecto: nombre, descripción, logo, SEO. [Ajustes de la app]({admin}/{lang}/app-settings)',
          'Conecta GitHub y envía el código del servidor a tu repositorio. [GitHub]({admin}/{lang}/github)',
          'Clona ese repositorio en tu propia máquina, desarrolla ahí y envía los cambios de vuelta.',
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
          { kind: 'p', text: 'Ninguno de los dos bloquea nada. Ambos ahorran rehacer trabajo.' },
          {
            kind: 'list',
            items: [
              '**Una clave de OpenAI.** Sin ella el Quiz no hace preguntas, y sin casos el agente programador se niega a construir. El sitio sigue funcionando — solo quedan vacíos la búsqueda vectorial y el grafo de conocimiento. Se introduce una vez; el gasto va directo a tu proveedor de modelo. [Clave OpenAI]({admin}/{lang}/openai)',
              '**Tu propio dominio.** En una dirección numérica no hay certificado ni aplicación instalable — el navegador solo los concede sobre conexión segura. Mudarse después cambia la dirección de cada página, así que sale más barato antes de que las indexen. [Dominio]({admin}/{lang}/domain)',
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
  { kind: 'cta', href: '{admin}/{lang}/doc-use-cases', label: 'Abrir Quiz' },
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
    kind: 'languageMarquee',
    title: 'Ochenta y dos idiomas, listos antes de que los necesites',
    note: 'Todos vienen con el producto: activas los que habla tu mercado. La generación estática, la optimización para buscadores y para IA, el caché de datos y la preparación para carga alta mantienen la eficiencia en lo más alto del sector — y la mantienen igual tanto si trabajas con un idioma, con varios o con los ochenta y dos.',
  },
],
}

import type { HomeCell } from './index'

// Языковая ячейка главной. Перевод перенесён из прежнего словаря без изменений.
export const es: Partial<HomeCell> = {
  title: 'Este es el starter de tu aplicación',
  description: 'Funciona en tu propio servidor y no responde ante nadie más. Dale un nombre en el panel de control — esta línea desaparecerá.',
  keywords: '',
  blocks: [
  { kind: 'hero', pill: 'Infraestructura de ingeniería agéntica' },
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
      { label: 'Base de datos propia', tone: 'data' },
      { label: 'Búsqueda vectorial', tone: 'data' },
      { label: 'Grafo de conocimiento', tone: 'data' },
      { label: 'Almacenamiento propio', tone: 'data' },
      { label: 'Autorización', tone: 'access' },
      { label: '{roles} roles', tone: 'access' },
      { label: 'GitHub', tone: 'code' },
      { label: 'Arquitectura Fractera', tone: 'code' },
      { label: '100+ más', tone: 'muted' },
    ],
  },
  {
    kind: 'flow',
    title: 'Cómo funciona',
    note: 'De un servidor vacío a tu propio código en producción. Todo lo de abajo corre sobre hardware que es tuyo.',
    steps: [
      { title: 'Levanta el servidor', text: 'Despliégalo con el robot instalador de Fractera. Obtienes un sistema operativo, una plantilla de inicio, el panel de control, los almacenamientos y la autorización — instalados y conectados entre sí.' },
      { title: 'Desarrolla donde ya trabajas', text: 'Sincroniza con GitHub, luego clona en tu propia máquina y ejecuta Claude Code o Codex. Los datos siguen llegando de tu servidor; el código se ejecuta en tu propio IDE.' },
      { title: 'Haz push y se despliega solo', text: 'Termina en la máquina local y envía el proyecto a GitHub. Eso lanza de inmediato un nuevo despliegue en tu propio servidor — y el visitante ve el nuevo proyecto.' },
    ],
  },
  {
    kind: 'panel',
    title: 'Cómo empezar',
    children: [
      { kind: 'p', text: 'Seis pasos desde un servidor vacío hasta tu propio código en producción. Todo lo de abajo ya está instalado — lo estás activando, no construyendo.' },
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
    kind: 'panel',
    tone: 'warn',
    title: 'Recomendado antes de empezar',
    children: [
      { kind: 'p', text: 'Ninguno de los dos bloquea nada. Ambos ahorran rehacer trabajo: el primero activa la mitad pensante del producto, el segundo cambia la dirección de cada página.' },
      {
        kind: 'list',
        items: [
          '**Una clave de OpenAI.** Sin clave, el Quiz no hace preguntas, y sin el Quiz no hay con qué describir tus casos de uso — así que el agente programador se niega a construir. Por eso el panel trata la clave como requisito ROJO hasta que existan los primeros casos, y como sugerencia ámbar después: el sitio funciona sin ella, solo quedan vacíos la búsqueda vectorial y el grafo de conocimiento. La clave se introduce una vez y el gasto va directo a tu proveedor del modelo. [Clave de OpenAI]({admin}/{lang}/openai)',
          '**Tu propio dominio.** Mientras el sitio viva en una dirección numérica no tendrá certificado ni aplicación instalable — el navegador solo los concede sobre una conexión segura. Pasar a un dominio cambia la dirección de cada página, así que sale más barato hacerlo antes de que las indexen. [Dominio]({admin}/{lang}/domain)',
        ],
      },
    ],
  },
  {
    kind: 'panel',
    tone: 'accent',
    eyebrow: 'Antes de cualquier código',
    title: 'Quiz — siete preguntas en vez de una página en blanco',
    children: [
      { kind: 'p', text: 'El error más caro de un proyecto se comete antes de la primera línea de código: se construye lo que no era. No por construir mal, sino porque «por dónde empiezo» es difícil de responder en solitario. Quiz lo convierte en una conversación: tú respondes, el modelo sigue preguntando, y de ahí crece la lista de escenarios con la que luego se construye el proyecto.' },
      {
        kind: 'columns',
        cols: 3,
        children: [
          { kind: 'group', children: [{ kind: 'h3', text: 'La semilla' }, { kind: 'p', text: 'Siete preguntas breves: qué es el producto, para quién es, con qué debería quedarse una persona. Responde con tus propias palabras — el dictado funciona. Todo lo que sigue crece desde aquí, así que un par de frases da un resultado notablemente mejor que un par de palabras.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'La conversación' }, { kind: 'p', text: 'Después, una pregunta a la vez, en tu idioma. Existe un autoquiz: el modelo hace cinco preguntas nuevas y se las responde él mismo, profundizando la descripción — pero todo lo que haya inventado en tu nombre queda marcado como «Suposición», y tú lo corriges. Una conjetura pasada por hecho aparecería más tarde, dentro de los escenarios terminados.' }] },
          { kind: 'group', children: [{ kind: 'h3', text: 'Los escenarios' }, { kind: 'p', text: 'La conversación se sintetiza en casos numerados: quién llega, qué hace, qué debe ser cierto al final. Los lees y confirmas uno por uno. Un caso sin leer sigue siendo la conjetura del modelo.' }] },
        ],
      },
      { kind: 'quote', text: 'Y esto no es un consejo, sino una regla del producto: mientras quede un solo caso sin confirmar, el panel mantiene la alarma encendida y el agente programador se niega a construir. Construir sobre una conjetura sin leer cuesta más que no construir nada.' },
      { kind: 'cta', text: 'Quiz — siete preguntas en vez de una página en blanco', href: '{admin}/{lang}/doc-use-cases', label: 'Abrir Quiz' },
    ],
  },
  {
    kind: 'panel',
    title: 'Qué es este proyecto, técnicamente',
    children: [
      { kind: 'p', text: 'Esto no es un sitio terminado sino la arquitectura Fractera: un mismo esqueleto sostiene tanto una landing page como un SaaS grande o una automatización multinivel. Crecer no exige reescribir — las capas de datos, autorización y panel ya están separadas, y cada una está pensada para una carga que aún no tienes.' },
      { kind: 'p', text: 'El código no se escribe aquí. Un desarrollador clona el repositorio en su propia máquina y trabaja con Claude Code, que lee las instrucciones y habilidades que viven dentro del proyecto: ellas fijan las reglas, y las comprobaciones automáticas no dejan que se rompan. El servidor solo recibe el resultado y se reconstruye.' },
      { kind: 'p', text: 'El esqueleto está pensado para un proyecto que superará el millón de líneas: cada entidad tiene su propia carpeta, la capa compartida no crece con su número, y las rutas y permisos se declaran donde se aplican. La estabilidad aquí no es una promesa sino una consecuencia — una página nueva no añade nada a un núcleo central.' },
    ],
  },
  {
    kind: 'noBill',
    items: [
      { vendor: 'Vercel', text: 'no pagas a' },
      { vendor: 'Neon', text: 'no pagas a' },
      { vendor: 'Clerk', text: 'no pagas a' },
    ],
    title: 'No pagas a nadie',
    text: 'No dependes de nadie. El proyecto es tuyo por completo.',
  },
],
}

import type { BlogOverride } from '../../_lib/types'

// Traducción al español. Tono del autor: directo, sin registro académico,
// dirigido al lector.
// Los términos de producto y nombres propios no se traducen (Claude Code,
// Anthropic, CI, LLM).
// Los diagramas se tradujeron junto con el texto: un diagrama en inglés
// dentro de un artículo en español se lee como una traducción a medias.

const POST_1_LINEAR = `escribes un prompt  ─▶  la IA escribe código  ─▶  encuentras el bug  ─▶  corriges el prompt  ─┐
     ▲                                                                          │
     └──────────────────────────  otra vez a mano  ◀─────────────────────────────────┘`

const POST_1_LOOP = `defines el objetivo
     │
     ▼
la IA escribe código  ─▶  CI ejecuta todas las pruebas  ─▶  ¿en verde?  ─▶  ✦ entregado
     ▲                      │
     │                      ▼  (en rojo)
     └──  la IA lee los registros y se vuelve a preguntar a sí misma`

export const es: BlogOverride = {
  title: 'La ingeniería de prompts ha muerto. Larga vida a la ingeniería de bucles.',
  subtitle:
    'Por qué el responsable de Claude Code en Anthropic acaba de anunciar el fin de la era de los "susurradores de IA" — y qué viene después.',
  description:
    'Boris Cherny, quien lidera el desarrollo de Claude Code en Anthropic, dice que ya no escribe prompts — escribe bucles. Un análisis: la muerte de la ingeniería de prompts y el nacimiento de la ingeniería de bucles, flujos de trabajo agénticos, agentes autocorrectivos, por qué el juez importa más que la formulación y cómo ese mismo bucle está tendido en un espacio de trabajo que tú posees: verificaciones automáticas en el repositorio, memoria que sobrevive a la sesión y un panel de control que construye y sabe revertir.',
  excerpt:
    'El ingeniero que lidera Claude Code en Anthropic admitió que ya no se dirige al modelo con prompts — escribe bucles que se dirigen a él en su lugar. Por qué esto cierra la era de los "susurradores de IA" y cómo de ahí sale una arquitectura de trabajo.',
  heroCaption: 'La publicación en LinkedIn con la que todo empezó: Boris Cherny sobre escribir bucles, no prompts.',
  blocks: [
    { kind: 'h2', text: 'La cita que rompió la ilusión' },
    {
      kind: 'p',
      text: 'Hace unos días, una sola frase de **Boris Cherny** — el ingeniero que lidera el desarrollo de **Claude Code** en **Anthropic** — recorrió en silencio, como una onda expansiva, la comunidad de desarrolladores.',
    },
    {
      kind: 'p',
      text: 'En un panel público, Cherny reveló cómo trabajan realmente con sus propios modelos las personas que construyen la IA de programación más sofisticada del mundo. Lo dicho no solo contradice lo establecido — declara obsoleta toda una disciplina apenas nacida:',
    },
    {
      kind: 'quote',
      text: 'Ya no escribo prompts para Claude. Tengo bucles funcionando que se dirigen a Claude y deciden por sí mismos qué hacer después. Mi trabajo es escribir bucles.',
      cite: 'Boris Cherny · Claude Code, Anthropic',
    },
    { kind: 'p', text: 'Deja que esto se asiente.' },
    {
      kind: 'p',
      text: 'El hombre con ambas manos en el volante del mejor modelo de desarrollo del mundo te está diciendo que soltó el volante. No se sienta en una ventana de chat puliendo el párrafo perfecto de instrucciones. Escribe código que obliga a la IA a hablar consigo misma, evaluar sus propios errores y corregirlos dentro de un circuito autónomo cerrado. Construye la máquina que conduce al modelo — y la deja andar.',
    },
    {
      kind: 'p',
      text: 'Si todavía pasas los días puliendo prompts para sacarle al modelo el fragmento de código correcto, su mensaje suena duro y claro: **estás optimizando un mundo que ya no existe.**',
    },

    { kind: 'h2', text: 'El cambio de paradigma: del micromanagement a la arquitectura de sistemas' },
    {
      kind: 'p',
      text: 'Para ver por qué esto es un cambio tectónico, mira cómo cambió nuestra relación con la IA generativa en apenas un par de años.',
    },
    { kind: 'h3', text: 'Fase 1 — el prompt lineal (el humano como cuello de botella)' },
    {
      kind: 'p',
      text: 'Hasta hace poco, toda la industria estaba obsesionada con la **ingeniería de prompts**. Tratábamos a los modelos de lenguaje como junior brillantes pero fácilmente distraídos. El proceso era lineal, frágil y completamente manual:',
    },
    { kind: 'code', text: POST_1_LINEAR },
    {
      kind: 'p',
      text: 'En este paradigma, **el cuello de botella es el humano.** Escribes un prompt, lees la respuesta, notas un error de sintaxis, lo pegas de nuevo en el chat y rezas para que el modelo no haya olvidado el contexto cinco pasos después. Se siente productivo. En realidad es un micromanagement agotador que no escala — y desde luego no funciona mientras duermes.',
    },
    { kind: 'h3', text: 'Fase 2 — la ingeniería de bucles (el circuito autónomo)' },
    {
      kind: 'p',
      text: 'Lo que describe Cherny es **ingeniería de bucles**: procesos agénticos donde el humano sale por completo del circuito de ejecución. Dejas de conducir la máquina. Construyes la pista y dejas que la máquina dé las vueltas.',
    },
    {
      kind: 'p',
      text: 'En lugar de un prompt que resuelve una tarea, escribes un **bucle** programático que incrusta a la IA en un circuito automático de ejecución y verificación:',
    },
    {
      kind: 'olist',
      items: [
        '**El objetivo.** El humano plantea una sola tarea de alto nivel — "construye este endpoint de API y alcanza el 98 % de cobertura de pruebas".',
        '**La acción.** La IA escribe la primera versión del código.',
        '**La verificación.** Un entorno automático — compilador, linters, pruebas unitarias, tu CI — ejecuta el código y detecta cada error.',
        '**La autocorrección.** Ante un fallo, el sistema captura el rastro del error, se lo entrega a la IA como una nueva instrucción y le ordena intentarlo de nuevo.',
      ],
    },
    { kind: 'code', text: POST_1_LOOP },
    {
      kind: 'p',
      text: 'El bucle avanza a velocidad de máquina, procesando decenas de iteraciones, corrigiéndose y curándose a sí mismo hasta que se cumplen las condiciones de verificación. No escribiste ni una sola aclaración. No escribiste los prompts — construiste la pista, y el modelo dio cada vuelta por sí solo.',
    },

    { kind: 'h2', text: 'La habilidad real no es escribir código. La habilidad real es escribir al juez.' },
    {
      kind: 'p',
      text: 'Aquí está la parte que casi todos pasan por alto — y en ella está todo el juego. Lo difícil del bucle **no** es generar el código. Los modelos ya son terroríficamente buenos en eso. Lo difícil es **lo que decide si el código es bueno.**',
    },
    {
      kind: 'p',
      text: 'Dale al bucle un verificador fuerte e implacable — pruebas reales, análisis estático, un compilador que no sabe mentir — y el bucle converge en algo que realmente funciona. Dale uno débil, y ese mismo bucle producirá alegremente un río infinito de basura segura y bellamente formateada, alucinando su camino hacia una marca verde que no significa nada.',
    },
    {
      kind: 'p',
      text: 'Así que la habilidad de la próxima década no es el arte de la formulación. Es **diseñar la verificación**: sistemas de validación a prueba de balas que permiten a una IA hablar consigo misma con seguridad sin caer por un precipicio. Es una ingeniería más difícil, más rara y mucho más valiosa que encontrar las palabras correctas.',
    },

    { kind: 'h2', text: 'De la filosofía a la producción: cómo armamos el bucle' },
    {
      kind: 'p',
      text: 'Mientras el resto del mundo tecnológico analiza la cita de Cherny en redes sociales, el verdadero desafío no tiene glamur: **¿cómo construir una infraestructura de ingeniería de bucles que funcione en producción — fuera de los laboratorios internos de Anthropic?**',
    },
    {
      kind: 'p',
      text: 'Cierra un bucle alrededor de un solo modelo y pronto chocarás con los muros del mundo real: degradación de la ventana de contexto, espirales alucinatorias de muerte y ausencia de memoria a escala de proyecto. En [%SITE%](/es) pasamos todo el año pasado tratando la filosofía de Cherny no como una predicción sino como un **plano arquitectónico** — y construimos el bucle sobre el que corre este espacio de trabajo.',
    },
    {
      kind: 'figure',
      media: 'image',
      src: 'media:development-loop-2026.jpg',
      alt: 'Esquema del bucle de desarrollo: el propietario fija un objetivo, el agente edita el repositorio, verificaciones automáticas lo evalúan, el fallo vuelve al agente como nueva instrucción, y el panel de control construye, registra y sabe revertir',
      caption: 'El bucle tal como está realmente tendido: un agente en tu repositorio, verificaciones que no saben mentir, y un panel que cierra el circuito.',
    },
    { kind: 'h3', text: 'La anatomía de un bucle de nivel producción' },
    {
      kind: 'p',
      text: 'Para que los bucles sean viables en software real, hay que dejar de admirar el modelo y construir a su alrededor tres cosas sin glamur — el juez, la memoria y la mano que entrega:',
    },
    {
      kind: 'list',
      items: [
        '**Un juez al que no se puede convencer.** El juez no es un segundo modelo con opinión propia, sino un conjunto de scripts que hacen fallar la compilación. ¿Existen las señales de idioma en cada página pública? ¿Tiene cada material la versión en markdown que necesita un lector de IA? ¿Se hace referencia a una imagen que nadie subió al repositorio? Cada verificación existe porque ese defecto exacto llegó a producción una vez, y responde con un código de salida, no con un párrafo.',
        '**Memoria que sobrevive a la sesión.** El efecto de amnesia es real: quince vueltas alrededor de un bug terco y el agente pierde de vista la arquitectura. Aquí la memoria no es un servicio que puede estar caído, sino archivos junto al código que viajan con el repositorio: la instrucción de trabajo, las lecciones anotadas en el momento en que el propietario corrige algo, la lista de antipatrones, los casos de usuario confirmados. Una sesión nueva empieza leyéndolos — por eso la vigésimo quinta vuelta sabe lo que aprendió la primera.',
        '**Un acto final que no pertenece al agente.** El bucle termina en el panel de control: construye el proyecto, lleva un registro de despliegues y sabe volver a la última build que funcionaba. Ajustes, textos e imágenes cambian ahí sin ninguna reconstrucción — así que al bucle nunca se le pide resolver lo que nunca fue un problema de código.',
      ],
    },
    {
      kind: 'p',
      text: 'Fíjate en lo que **no** está en esa lista: un enjambre de modelos supervisándose entre sí. Esa fue nuestra primera arquitectura, y la retiramos. La orquestación es la parte más vistosa de un diagrama agéntico y la menos estructural de uno que funciona: a un juez débil no lo arregla una segunda opinión, y uno fuerte casi nunca la necesita.',
    },

    { kind: 'h2', text: 'La nueva descripción del puesto del ingeniero' },
    {
      kind: 'p',
      text: 'Nos alejamos de escribir código, pasamos de largo por escribir prompts y entramos directo en **construir tuberías cognitivas.** El oficio ya no es la instrucción, sino el sistema dentro del cual esa instrucción se ejecuta.',
    },
    {
      kind: 'p',
      text: 'Y no es gratis. Con los bucles llegan dos gastos nuevos. **Deuda de comprensión:** cuando un agente reescribe un archivo trescientas veces entre bastidores, tu conocimiento de tu propia base de código se erosiona en silencio — funciona, pero ya no estás seguro de por qué. Y **cómputo puro:** un bucle puede quemar dinero real en tokens persiguiendo un solo bug con cien intentos silenciosos. Los ingenieros que ganan en esta era tratan el equilibrio entre costo y calidad como una decisión de diseño consciente, no como una sorpresa en la factura.',
    },
    {
      kind: 'cta',
      text: 'Este sitio es uno de esos bucles: las páginas que estás leyendo son estáticas, y la verificación no las dejó salir hasta que llevaron sus señales de idioma, su versión en markdown y su lugar en el mapa del sitio.',
      href: '/es',
      label: 'Ver el espacio de trabajo sobre el que corre',
    },
    {
      kind: 'p',
      text: 'La era de la ingeniería de prompts ha quedado oficialmente atrás. Queda una sola pregunta — la misma que Cherny ya se respondió a sí mismo: **¿sigues intentando hablar con tu IA — o ya estás construyendo los bucles que la dejan trabajar?**',
    },
    {
      kind: 'note',
      text: 'Fuente: una publicación en LinkedIn de Guillermo Flor, ampliamente compartida, que sacó a la luz las palabras de Boris Cherny. La cita se reproduce tal como circuló; la arquitectura y el análisis son propios.',
    },
  ],
  faq: [
    {
      q: '¿Qué es la "ingeniería de bucles" y por qué está desplazando a la ingeniería de prompts?',
      a: 'La ingeniería de bucles es escribir procesos automáticos que se dirigen a la IA por sí mismos, pasan su resultado por una verificación (pruebas, CI, compilador), devuelven los fallos como nuevas instrucciones y repiten, hasta que el resultado es correcto. Boris Cherny, quien lidera Claude Code en Anthropic, dijo que ya no elabora prompts a mano: escribe bucles que lo hacen por él. La clave es que el cuello de botella nunca fue el prompt — el cuello de botella era el humano dentro del ciclo de retroalimentación.',
    },
    {
      q: '¿Cómo está tendido aquí, en producción, el bucle de desarrollo?',
      a: 'Un agente de código trabaja dentro de tu propio repositorio, en tu propia máquina, y la instrucción de trabajo del proyecto vive junto al código. El juez es un conjunto de verificaciones que corren en cada build y la hacen fallar: señales de idioma en cada página pública, versión en markdown para cada página publicada, ninguna referencia a una imagen sin subir, ningún diccionario con una clave faltante. El fallo vuelve al agente como nueva instrucción, y el ciclo se repite. El panel de control cierra el circuito: construye el proyecto, lleva un registro de despliegues y sabe volver a la última build que funcionaba.',
    },
    {
      q: '¿Necesito saber programar para trabajar con este bucle?',
      a: 'Para la mayor parte de lo que realmente cambia en el sitio, no. El nombre, la descripción, las imágenes, los idiomas, la analítica y los textos de configuración viven en el panel de control y se aplican sin reconstrucción: son datos, no código. Los cambios de código los hace el agente en tu repositorio; tú los lees y los apruebas, y el panel construye el resultado. El límite honesto es este: nadie promete que nunca vas a mirar un cambio — se te promete que nunca vas a ejecutar una build a mano, y que una fallida se puede revertir con un clic.',
    },
  ],
}

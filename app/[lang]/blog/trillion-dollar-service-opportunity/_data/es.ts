import type { BlogOverride } from '../../_lib/types'

// Versión en español. Tono del autor (Roma Armstrong): personal, directo, inspirador.
// El ancla raíz obligatoria «Agentic Engineering Infrastructure» (término sin traducir) → /es.
export const es: BlogOverride = {
  title: 'La oportunidad de un billón de dólares es el salón de al lado',
  subtitle:
    'Elon Musk habló sobre el espacio, la inteligencia artificial y los coches. La frase que se me quedó fue más simple: la mayoría de los negocios del planeta todavía no tienen ni siquiera una API. Esta es la vía que encontré gracias a eso.',
  description:
    'Por qué el dinero grande, a corto plazo, en IA no está en un unicornio — está en la peluquería, la clínica, la consulta dental de al lado. El problema de las ausencias, los negocios sin sitio web ni CRM, y cómo un espacio de trabajo self-hosted permite que casi cualquiera los automatice sin armar antes una pila de servicios.',
  excerpt:
    'Elon Musk dijo que la mayoría de los negocios todavía no tienen API — funcionan con un teléfono, o sin ni eso. Pasé decenas de reuniones persiguiendo esa idea y encontré un nicho a la vista de todos: el salón, la clínica, la consulta dental de al lado.',
  blocks: [
    {
      kind: 'p',
      text:
        'Este es un post un poco inusual, porque empieza con otra persona. La entrevista de Elon Musk de arriba me llamó la atención — habló sobre el espacio, sobre inteligencia artificial, sobre coches. Pero el momento que más me inspiró fue uno tranquilo. Dijo que, a pesar de cómo se siente el mundo moderno — como si ya se hubiera inventado todo, se hubiera construido cada sitio, lanzado cada aplicación, automatizado cada proceso de negocio — la inmensa mayoría de los negocios del mundo ni siquiera tienen una API. Funcionan con un teléfono. Algunos, ni siquiera con eso.',
    },
    {
      kind: 'quote',
      text:
        'Si la IA simplemente puede tomar lo que ya se le da a la empresa de atención al cliente subcontratada que ya usan y hacer ese servicio con las mismas aplicaciones que ya usan, se puede avanzar muchísimo en atención al cliente, que es, creo, alrededor del 1% de la economía mundial. Cerca de un billón de dólares en total, solo en atención al cliente.',
      cite: 'Elon Musk · Entrevista con Dwarkesh Patel, febrero de 2026',
    },
    {
      kind: 'p',
      text:
        'Vuelve a leer eso con ojos de constructor. Ese billón no vive en otra red social ni en otro envoltorio de IA — vive dentro de negocios ordinarios que nunca se digitalizaron. Y la barrera nunca fue la idea; fue la construcción. Contratar un equipo, montar infraestructura, pagar mes tras mes por una pila de servicios en la nube. Esa barrera es exactamente lo que elimina un espacio de trabajo self-hosted — por eso me quedé con esta frase tranquila, y no con los cohetes.',
    },

    { kind: 'h2', text: 'Todos aprendieron a programar. La calle se ve igual.' },
    {
      kind: 'p',
      text:
        'Hablando con muchos socios, sigo viendo dos escenarios. Por un lado, una avalancha de desarrolladores — e incluso personas que nunca fueron desarrolladoras, gente que antes eran marketineros o gestores de contenido — aprendieron de golpe a programar en un solo año. Todo el mundo se puso a construir. Hay muchísimos proyectos, y muchos de verdad son interesantes. ¿Y en el mundo real? En el mundo real todo sigue exactamente igual.',
    },
    {
      kind: 'p',
      text:
        'Así que resulta que algunos encontramos una forma maravillosa de complacernos a nosotros mismos — el subidón de dopamina de aprender algo nuevo. Pero también es hora de ganar dinero con esto. ¿Entonces hacia dónde mueves el foco?',
    },
    {
      kind: 'founder',
      text:
        'El problema: no podemos predecir el futuro. Especialmente ahora, cuando el mercado y la tecnología han empezado a cambiar a una velocidad extraordinaria. Adaptarse al cambio es un proceso agónico de cambiar de estrategia.',
    },

    { kind: 'h2', text: 'Salí a buscar la respuesta. Y encontré una peluquería.' },
    {
      kind: 'p',
      text:
        'Tras estudiar este vídeo en detalle y hacer varias decenas de reuniones para confirmar la respuesta a esa pregunta, encontré un nicho de negocio muy interesante: salones de belleza y cosmetología no quirúrgica, centros médicos, clínicas dentales. A pesar de la abundancia de automatización y sistemas CRM, se topan con un problema con sorprendente frecuencia: un cliente deja una solicitud, reserva una visita — y luego no aparece. Cuando el encargado le llama — normalmente justo a la hora en que debía empezar la cita — los clientes suelen responder: "ay, se nos olvidó. ¿Por qué no nos lo recordaron?"',
    },
    {
      kind: 'p',
      text:
        'Por supuesto que hay muchísimas soluciones ya hechas que se pueden instalar. Pero hay todavía más clientes a los que nunca se las instalaron — y muchos de ellos no tienen sitio web, muchos ni siquiera tienen CRM.',
    },

    { kind: 'h2', text: 'Para esto exactamente sirve un espacio de trabajo como este.' },
    {
      kind: 'p',
      text:
        '[%SITE%](/es) es un espacio de trabajo de ingeniería agéntica self-hosted, construido precisamente para escenarios como este. Trae de fábrica las piezas que ese negocio, de otro modo, tendría que comprar por separado: una base de datos y tablas propias, almacenamiento de archivos, voz convertida en texto, un canal para llegar a un cliente en un mensajero, autorización con roles y un sitio público que un motor de búsqueda realmente puede leer. El dueño del negocio puede tener tantas ideas como quiera — las piezas ya están en el estante.',
    },
    {
      kind: 'p',
      text:
        'La ventaja está en que antes, materializar estas ideas significaba trabajar increíblemente mucho tiempo con un equipo de producto, luego contratar programadores, luego pensar sin parar en cómo funciona todo — o comprar servicios caros para las necesidades propias. Ahora todo esto es simple. Gracias a la ingeniería agéntica, casi cualquier persona puede coger un teléfono y describir cómo le gustaría optimizar su negocio, y hacerlo ella misma o con la ayuda de alguien que ya entiende un poco de esto.',
    },
    {
      kind: 'p',
      text:
        'También te libera de tener que recordar qué servicios se supone que debes pagar. La mayoría de los servicios en la nube que se convierten en pagos periódicos y forman la mayor parte de tus costes — una base de datos, almacenamiento, una suscripción de CRM — ya son funciones ordinarias de tu propia aplicación, corriendo en tu propio servidor. Y los cambios del día a día no son en absoluto un despliegue: el nombre, los textos, las imágenes y los idiomas se editan en un panel de control y se aplican sin reconstrucción, mientras que el código vive en un repositorio que te pertenece.',
    },

    { kind: 'h2', text: 'Uno de tantos. Los puedes encontrar cada día.' },
    {
      kind: 'p',
      text:
        'El ejemplo de arriba es uno de tantos. Puedes encontrar casos así literalmente cada día y ganar dinero implementándolos — o puedes añadir la materialización de nuevas ideas dentro de tu propio negocio, porque ahora es prácticamente gratis. Nunca antes fue así.',
    },
    {
      kind: 'p',
      text:
        'Y aunque parece casi imposible encontrar un nicho nuevo para un unicornio startup — quizás no valga la pena pensar en eso. En lugar de soñar con construir un unicornio, puedes simplemente automatizar la peluquería de al lado, o el salón de belleza, o el taller mecánico. Todos aquellos con quienes ya llevas tiempo en contacto. Todos los que ya confían en ti. Quizás sea hora de intentarlo.',
    },
  ],
  faq: [
    {
      q: '¿Para qué tipo de negocio funciona mejor esto?',
      a: 'Negocios de servicios locales con citas y clientes recurrentes — salones, cosmetología no quirúrgica, clínicas, consultas dentales, talleres mecánicos — especialmente los que no tienen sitio web ni CRM y sufren un problema recurrente de ausencias.',
    },
    {
      q: '¿Pago por separado por una base de datos, almacenamiento, una suscripción de CRM?',
      a: 'No. Son piezas ordinarias integradas de tu propia aplicación en tu propio servidor, no suscripciones de terceros facturadas cada mes. Lo que pagas es el servidor en sí.',
    },
    {
      q: '¿Necesito ser desarrollador?',
      a: 'No para lo que un negocio cambia con más frecuencia: nombres, textos, precios, imágenes e idiomas se editan en el panel de control y se aplican sin reconstrucción. Construir algo nuevo es trabajo de un agente de código que trabaja en tu repositorio — el tuyo, o el de alguien que ya entiende un poco de esto. El servidor, el modelo de IA y el dominio ya están conectados por ti.',
    },
  ],
}

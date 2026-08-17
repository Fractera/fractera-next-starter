import type { FooterPageCell } from '@/lib/pages/footer-page'

// Языковая ячейка страницы «Архитектура» — перевод владельца (внешняя модель).

export const es: FooterPageCell = {
  title: 'Arquitectura',
  description:
    'Cómo está ensamblada esta aplicación: las capas, qué posee cada una y cuáles de ellas siguen funcionando cuando las demás se apagan.',
  keywords: 'arquitectura, capas, generación estática, servidor propio, capa de datos',
  blocks: [
    {
      kind: 'p',
      text: 'Esta página describe el esqueleto sobre el que se apoya la aplicación. Está escrita para dos lectores a la vez: una persona que decide si el producto encaja y un agente de código que lo modificará. Ambos necesitan lo mismo: saber qué capa posee qué antes de tocar nada. Volver a [%SITE%](/es).',
    },

    { kind: 'h2', text: 'Cómo está conectado' },
    {
      kind: 'p',
      text: 'Varios procesos se ejecutan codo con codo en su servidor. Cuatro de ellos responden hacia el exterior y cada uno tiene exactamente una tarea. El límite entre ellos es un puerto en lugar de una carpeta, razón por la cual un fallo en uno no arrastra a los demás.',
    },
    {
      kind: 'table',
      headers: ['Puerto', 'Proceso', 'Para qué sirve'],
      rows: [
        ['3000', 'Su aplicación', 'Las páginas que ven los visitantes. Esta es con la que trabaja todos los días.'],
        ['3001', 'Autorización', 'Cuentas, sesiones, roles. Configurado desde el panel de control, no editado por usted.'],
        ['3002', 'Panel de control', 'Lo mismo: configurado, no editado.'],
        ['3300', 'Capa de datos', 'Filas, archivos subidos, vectores y la única puerta a todo lo demás. Su aplicación se comunica con ella.'],
      ],
    },
    { kind: 'p', text: 'Tres servicios más se ejecutan en paralelo, y ninguno de ellos es una puerta propia:' },
    {
      kind: 'list',
      items: [
        'el mapa — rutas, matrices de distancia y búsqueda de direcciones, puerto 3400;',
        'canales — Telegram y lo que le siga, puerto 3500;',
        'el grafo de conocimiento — el almacén RAG agéntico, puerto 9621.',
      ],
    },
    {
      kind: 'note',
      text: 'Ninguno de estos puertos es accesible desde Internet: el cortafuegos admite únicamente los puertos web, y todo lo público llega a través de ellos. Su aplicación accede a los tres servicios a través de la capa de datos — /service/geo, /service/channels, /service/rag — con la misma clave que abre la capa de datos en sí.',
    },

    { kind: 'h2', text: 'Cada capa sobrevive a las demás' },
    {
      kind: 'p',
      text: 'Los procesos separados no son un diagrama: son lo que ocurre en un mal día. Cualquiera de los cuatro puede detenerse sin que el resto caiga con él.',
    },
    {
      kind: 'table',
      headers: ['Si esto se detiene', 'Qué sigue funcionando'],
      rows: [
        ['Su aplicación', 'El panel, los datos y las cuentas no se tocan; solo el sitio web está caído'],
        ['Panel de control', 'El sitio sigue atendiendo a los visitantes; solo los cambios tienen que esperar'],
        ['Capa de datos', 'Las páginas generadas de antemano siguen abriéndose — para eso sirve la generación estática'],
        ['Autorización', 'Las páginas públicas no se ven afectadas; solo se cierra lo que está detrás de un inicio de sesión'],
      ],
    },
    {
      kind: 'note',
      text: 'El panel vive deliberadamente fuera de su repositorio. Lo que viaja a su GitHub es la aplicación; la cabina se queda en el servidor, razón por la cual un error de edición no puede romperlo.',
    },

    { kind: 'h2', text: 'Primero lo estático, y lo que eso le aporta' },
    {
      kind: 'p',
      text: 'Las páginas se generan de antemano, no se ensamblan por cada solicitud. Eso no es un detalle de rendimiento; es la razón por la cual el sitio sigue siendo económico de servir bajo carga, totalmente legible para los motores de búsqueda y funcional con JavaScript desactivado.',
    },
    {
      kind: 'list',
      items: [
        'El encaminamiento es del lado del servidor, por lo que un visitante con los scripts desactivados sigue navegando por todo el sitio.',
        'El contenido se regenera según un horario en lugar de en cada visita, por lo que un pico de tráfico no cuesta nada extra.',
        'Todo lo que depende genuinamente de quién está mirando — un panel, una cuenta — se renderiza por solicitud, y solo esa parte.',
      ],
    },

    { kind: 'h2', text: 'Un diseño, decidido una vez' },
    {
      kind: 'p',
      text: 'Los colores, la tipografía y el espaciado no se eligen por página. Toda la escala vive en un lugar, la paleta en otro, y un encabezado escrito a mano falla una comprobación antes de llegar siquiera al sitio.',
    },
    {
      kind: 'p',
      text: 'La ley detrás de esto es breve: **nada de cómo se ve una página depende de quién pueda abrirla.** Pública o privada, escaparate o tabla de administración — mismos encabezados, misma escala, mismos colores. El acceso decide lo que una persona puede ver, nunca cómo está configurado.',
    },
    {
      kind: 'p',
      text: 'Esto está escrito porque su ausencia tiene una forma. Mientras el archivo de diseño estaba vacío, el agente que construyó este proyecto inventó un segundo estilo de encabezado para "pantallas de trabajo" — dos páginas privadas terminaron con el doble de separación en tamaño y configuradas en familias diferentes. Nada se rompió; simplemente se leía como dos productos diferentes.',
    },
    {
      kind: 'p',
      text: 'Su paleta es un pequeño archivo de roles de color, leído a medida que se sirve la página. Cámbielo y todo el sitio le seguirá — incluidas las páginas que aún no ha construido, e incluidos ambos temas: claro y oscuro son los mismos roles con valores diferentes, no dos diseños que deban mantenerse sincronizados a mano.',
    },

    { kind: 'h2', text: 'Idiomas: 82 disponibles, y añadir uno no cuesta nada' },
    {
      kind: 'p',
      text: 'Ochenta y dos idiomas vienen con el producto. Usted activa los que habla su mercado, y el resto espera — activar uno más tarde es una configuración, no una reconstrucción de cómo funciona el sitio.',
    },
    {
      kind: 'p',
      text: 'La parte que vale la pena entender es lo que añadir un idioma NO hace:',
    },
    {
      kind: 'list',
      items: [
        'No convierte ninguna página en dinámica. Cada idioma obtiene sus propias páginas, generadas de antemano exactamente igual que la primera — diez idiomas significan diez conjuntos de páginas estáticas, no una página ensamblada por solicitud.',
        'No diluye el posicionamiento en buscadores. Cada página se declara a sí misma como la original en su propio idioma y nombra sus traducciones, por lo que un motor de búsqueda las trata como una página en diez idiomas en lugar de diez duplicados casi idénticos compitiendo entre sí.',
        'No cuesta velocidad. Servir una página prerenderizada requiere el mismo trabajo independientemente de cuántos idiomas existan junto a ella.',
      ],
    },
    {
      kind: 'note',
      text: 'Un sitio de un solo idioma es un caso por derecho propio, no una versión reducida: el idioma desaparece por completo de las direcciones, y el sitio deja de publicitar traducciones que no tiene.',
    },

    { kind: 'h2', text: 'Encontrado por los motores de búsqueda, legible por modelos' },
    {
      kind: 'p',
      text: 'Dos lectores llegan a un sitio moderno y quieren cosas distintas. Un motor de búsqueda envía a una persona a una página. Un modelo viene por sí mismo, lee y retransmite. El producto está construido para ambos, y ambos no son la misma tarea.',
    },
    {
      kind: 'p',
      text: 'Para los motores de búsqueda: las páginas se sirven como HTML terminado, cada una declara su propia dirección canónica, las traducciones se nombran mutuamente, los metadatos se ensamblan mediante un único mecanismo en lugar de por página, y los datos estructurados, sitemaps y reglas de robots se incluyen por defecto. Las comprobaciones automáticas rechazan cualquier página que rompa algo de esto.',
    },
    {
      kind: 'p',
      text: 'Para los modelos: cada página pública también existe como texto plano. Hay un mapa en /llms.txt, todo el corpus en /llms-full.txt y una versión en markdown de cada página junto a ella. Esto importa porque el marcado de la página es mitad ruido para un modelo — menús, pie de página, banner de consentimiento, scripts — y gasta su contexto en todo ello.',
    },
    {
      kind: 'note',
      text: 'Ambas formas se construyen a partir del MISMO contenido. No hay una "versión para IA" separada que pueda desincronizarse: edite el texto una vez y ambas cambian juntas. Una copia mantenida a mano divergiría en la primera corrección, y nadie se daría cuenta, porque nadie la abre en un navegador.',
    },

    { kind: 'h2', text: 'Los ajustes se aplican sin necesidad de reconstruir' },
    {
      kind: 'p',
      text: 'El nombre, la descripción, el logotipo, los colores, los idiomas y los interruptores de características viven en archivos de configuración en el servidor, fuera del código. La aplicación los lee a medida que sirve, por lo que un cambio en el panel es visible inmediatamente — sin despliegue, sin tiempo de inactividad.',
    },
    {
      kind: 'p',
      text: 'La consecuencia importa más que la comodidad: la misma base de código sirve a una panadería y a un mercado, y ninguna tuvo que ser ramificada para llegar ahí.',
    },

    { kind: 'h2', text: 'Su servidor, su código y la salida' },
    {
      kind: 'p',
      text: 'La aplicación es suya: clónela, edítela localmente, vuelva a hacer push. Nada aquí llama a casa — no hay ningún proveedor al que pedir permiso ni ninguna suscripción que pueda ser revocada.',
    },
    {
      kind: 'p',
      text: 'También puede irse. Elimine la dependencia del panel y la aplicación funcionará en cualquier lugar. Pierde las partes que viven en el servidor — ajustes sin reconstruir, la capa de datos, búsqueda vectorial, autorización en 82 idiomas, el historial de despliegues con un rollback — y se queda con el código. Esa es una salida legítima, no una desviación del diseño.',
    },

    { kind: 'h2', text: 'Diseñado para seguir creciendo después de que se agote el contexto' },
    {
      kind: 'p',
      text: 'El límite estricto en un proyecto construido por IA no es el tamaño del código. Es cuánto de ese código hay que comprender de una sola vez antes de poder realizar un cambio seguro. Un proyecto en el que cada nueva página se añade a un archivo central choca pronto contra ese muro: al final ninguna sesión puede retener lo suficiente como para cambiar algo sin romper otra cosa.',
    },
    {
      kind: 'p',
      text: 'La estructura aquí elegida va precisamente en contra de eso. **Cada entidad posee su propia carpeta** — sus páginas, sus datos, sus palabras, sus componentes privados. Elimine la carpeta y nada quedará huérfano en ninguna otra parte.',
    },
    {
      kind: 'list',
      items: [
        'La capa compartida no crece a medida que se añaden entidades. Algo asciende a un lugar compartido solo cuando dos cosas lo utilizan genuinamente, y ese movimiento es un acto deliberado, no un hábito.',
        'Los permisos se declaran donde se aplican, no en un registro que alguien deba recordar actualizar.',
        'Los grupos de rutas hacen visibles en el disco los dos tipos de página: contenido público por un lado, pantallas protegidas por roles por el otro. Una carpeta que no esté en ninguno de los dos es una pregunta sin respuesta, y una comprobación lo dice en voz alta.',
      ],
    },
    {
      kind: 'p',
      text: 'La consecuencia es el punto central: un cambio en una entidad requiere leer una carpeta. Millones de líneas siguen siendo manejables no porque nadie las tenga todas en mente, sino porque ningún cambio individual necesita hacerlo jamás.',
    },
    {
      kind: 'p',
      text: 'El starter es la misma idea aplicada al principio. Lo que se entrega no es un repositorio vacío, sino un ejemplo funcional de cada patrón — una página, un artículo, un catálogo, una pantalla privada, un diálogo, una celda de idioma. Una página nueva se hace copiando una que ya funciona, por lo que la estructura se propaga por construcción en lugar de por disciplina.',
    },

    { kind: 'h2', text: 'Los documentos a los que obedece el agente' },
    {
      kind: 'p',
      text: 'Un agente de código comienza cada sesión sin memoria de la anterior. Lo que sobrevive está escrito por escrito, dentro del proyecto, y se lee al inicio de cada sesión. Este corpus es tan parte de la arquitectura como lo son los puertos — es lo que hace que la segunda sesión sea tan competente como la primera.',
    },
    {
      kind: 'table',
      headers: ['Documento', 'Para qué sirve'],
      rows: [
        ['Casos de uso', 'PARA QUÉ sirve el producto, un archivo por escenario: quién llega, qué lo trajo, qué debe ser verdad cuando termine. Ningún caso confirmado significa que no se construye — el agente está obligado a detenerse y preguntar en lugar de adivinar.'],
        ['Pasos de desarrollo', 'El trabajo en sí, como archivos. Un paso se abre antes de ejecutarse y se traslada a la carpeta de completados con un informe completo. Una sesión que muere no pierde nada; una sesión fría se reanuda a partir de los archivos.'],
        ['Pruebas', 'Cómo se demuestra que un paso ha terminado: dos pruebas independientes desde dos planos diferentes, redactadas por escrito. Un build en verde nunca es una de ellas — un registro de compilación se ve idéntico funcione o no la característica.'],
        ['Antipatrones', 'Enfoques que ya han costado tiempo aquí, cada uno con el mecanismo del fallo. Autoevolutivo: el agente lo añade en el momento en que se comprende un callejón sin salida.'],
        ['Lecciones', 'Sus preferencias y los hábitos adquiridos al equivocarse una vez. Cuando una lección y el comportamiento por defecto del agente discrepan, gana la lección — existe porque el valor por defecto ya falló aquí.'],
        ['Diseño', 'Cómo se ven las páginas, decidido por usted y obedecido. Dado, no evolutivo.'],
      ],
    },
    {
      kind: 'p',
      text: 'Dos de estos merecen una mención sobre su dirección. **Los antipatrones y las lecciones los escribe el agente**; el documento de diseño lo escribe usted. La diferencia es deliberada: un agente puede registrar lo que ha aprendido, pero no puede decidir cómo debe verse el producto.',
    },
    {
      kind: 'note',
      text: 'Los casos de uso están pasando de archivos a un servicio. La conversación que los genera ya vive en el panel de control; a continuación, se trasladan detrás de una interfaz de herramientas respaldada por una base de datos, de modo que el agente solicita los casos que necesita en lugar de leer una carpeta. La regla no cambia con el almacenamiento — ningún caso confirmado, ninguna construcción. Lo que cambia es que los casos dejan de ser un documento que el agente debe recordar abrir.',
    },

    { kind: 'h2', text: 'Muchos productos en un solo servidor' },
    {
      kind: 'p',
      text: 'Un caso tiene que pertenecer a algo. En este producto pertenece a un **producto** — y un servidor transporta varios de ellos: una página de aterrizaje hoy, un monitor programado la próxima semana, el cerebro de la empresa después.',
    },
    {
      kind: 'p',
      text: 'La objeción es justa y vale la pena plantearla antes de dar la respuesta: **un sitio web suele ser un producto.** Si está construyendo un sistema de producción profesional para una empresa, eso es correcto, y nada aquí lo contradice — coloque un producto en un servidor y el resto de esta sección no le costará nada.',
    },
    {
      kind: 'p',
      text: 'Pero eso ya no es lo único que construye la gente. Cada vez más, lo que una persona necesita es un pequeño servicio para su propia eficiencia: algo que se ejecute según un horario e informe de lo que cambió, algo que busque por criterio en lugar de por palabra clave, algo que gestione una tarea recurrente en ventas, marketing u operaciones. Cada uno de ellos es demasiado pequeño para merecer su propio servidor, su propio dominio y su propia factura — y juntos forman un sistema.',
    },
    {
      kind: 'p',
      text: 'Por lo tanto, la unidad de trabajo es el producto, no el sitio. Agrupar un producto en su propia página o en un puñado de páginas es lo que le permite a un agente de código saber, sin preguntar, cuál de ellos está cambiando.',
    },

    { kind: 'h3', text: 'Por qué no llamarlo simplemente un proyecto' },
    {
      kind: 'p',
      text: 'Porque un proyecto no es un lugar. No tiene dirección, ni carpeta ni tablas, por lo que un caso adjunto a él no puede ejecutarse — el agente todavía tiene que adivinar adónde va el trabajo. Un producto tiene los tres, y esa es toda la diferencia: un caso adjunto a un producto es una instrucción ejecutable.',
    },
    {
      kind: 'p',
      text: 'Un producto posee cuatro raíces, y ninguna de ellas se configura a mano — las cuatro se **derivan** de su registro:',
    },
    {
      kind: 'table',
      headers: ['Raíz', 'Derivado de'],
      rows: [
        ['Sus páginas', 'Su dirección — en este framework el nombre de una carpeta ES el segmento de la URL'],
        ['Su lógica', 'Su identificador permanente'],
        ['Sus tablas', 'Su identificador permanente, como prefijo de nombre'],
        ['Sus casos', 'Su identificador permanente'],
      ],
    },
    {
      kind: 'p',
      text: 'Al trabajar en un caso, el agente escribe dentro de esas cuatro raíces y en ninguna otra parte. El código compartido vive en una raíz compartida, y mover algo allí es un acto deliberado indicado en el paso — buscar un componente en un producto vecino es el movimiento exacto que esta regla existe para detener, porque así es como el cambio de un propietario rompe silenciosamente otro producto semanas después.',
    },
    {
      kind: 'p',
      text: 'El identificador carece deliberadamente de significado — p1, p2 — y nunca cambia. No se puede derivar del título o de la estructura, porque ambos cambiarán, y las rutas dependen del identificador. Eso se demostró el mismo día en que se escribió la regla: un producto cuyo identificador decía «store» resultó ser un cerebro corporativo.',
    },

    { kind: 'h3', text: 'No todo producto tiene una página' },
    {
      kind: 'p',
      text: 'Un producto declara una de tres superficies, y por defecto siempre tiende hacia lo cerrado:',
    },
    {
      kind: 'list',
      items: [
        '**Público** — tiene una dirección y los visitantes llegan a ella.',
        '**Privado** — vive como una pestaña en su panel de control, y el mundo exterior no tiene forma de entrar.',
        '**Headless** — no tiene pantalla en absoluto: funciona a través de canales y según un horario, y se encuentra con él en Telegram o en su informe.',
      ],
    },
    {
      kind: 'p',
      text: 'Un producto también lleva un estado — siendo descrito, siendo construido, live. Moverlo a live lo publica, y eso es un ajuste: no se reconstruye nada y no se despliega nada.',
    },

    { kind: 'h3', text: 'Cómo se ve esto en la práctica' },
    {
      kind: 'p',
      text: 'Imagine a una consultora con un servidor. Su primer producto es una landing page: pública, en la raíz, con un único objetivo — conseguir una consulta. Sus casos dicen quién llega y qué debe ser verdad cuando se van.',
    },
    {
      kind: 'p',
      text: 'Su segundo producto no comparte nada con el primero excepto el servidor. Todas las mañanas lee las páginas, ofertas de empleo y precios de cuatro competidores, almacena lo que encontró y le envía un solo mensaje: qué cambió, cuándo y por qué cantidad. Es headless — sin dirección, sin página, sin pantalla. Sus casos tratan sobre sus mañanas, no sobre los visitantes.',
    },
    {
      kind: 'p',
      text: 'Ambos viven en un servidor y ninguno puede dañar silenciosamente al otro: páginas separadas, lógica separada, tablas separadas, casos separados. Cuando le pide al agente que cambie la redacción del formulario de consulta, nada relacionado con el monitor está en el ámbito — no porque el agente haya tenido cuidado, sino porque el límite se decidió antes de que se construyera cualquiera de los dos.',
    },
    {
      kind: 'note',
      text: 'El plan y el hecho real se mantienen separados a propósito. Las páginas que un producto DEBERÍA tener están escritas; las páginas que realmente tiene se cuentan recorriendo las carpetas, nunca se almacenan. Una lista escrita a mano de lo que existe diverge de la realidad en la primera semana — el agente construye una página y se olvida de la lista. La brecha entre ambos es la respuesta a "qué sigue faltando", y solo es digna de confianza porque una mitad de ella no se puede falsificar.',
    },
  ],
}

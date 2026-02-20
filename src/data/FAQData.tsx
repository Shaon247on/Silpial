import { FAQCategory } from "@/types/FAQ.type";

export const faqData: FAQCategory[] = [
  {
    label: "General",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    items: [
      {
        q: "¿Qué es RedactAI?",
        a: "RedactAI es una plataforma de redacción y revisión de licitaciones asistida por IA, construida exclusivamente para administraciones públicas españolas. Ayuda a los funcionarios a preparar documentos de licitación legalmente conformes más rápido, con cada sugerencia basada en la Gaceta Oficial del Estado (BOE) y precedentes de contratación aprobados.",
      },
      {
        q: "¿Para quién está diseñado RedactAI?",
        a: "RedactAI está diseñado específicamente para funcionarios de contratación, asesores legales y personal administrativo dentro de administraciones públicas españolas, desde ayuntamientos municipales hasta gobiernos regionales y agencias nacionales.",
      },
      {
        q: "¿Es RedactAI un sustituto del asesoramiento legal?",
        a: "No. RedactAI es una herramienta que asiste a profesionales legales y administrativos, no los reemplaza. Cada sugerencia requiere revisión y aprobación humana. La plataforma está diseñada para reducir la carga de trabajo manual y el riesgo legal, no para tomar decisiones legales autónomas.",
      },
      {
        q: "¿En qué idiomas está disponible RedactAI?",
        a: "RedactAI actualmente es compatible con español (castellano). La compatibilidad con catalán, euskera y gallego está en nuestro plan para 2025.",
      },
    ],
  },
  {
    label: "Documentos y Carga",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    items: [
      {
        q: "¿Qué formatos de archivo admite RedactAI?",
        a: "RedactAI acepta documentos de Word (.docx) y archivos PDF. Para obtener los mejores resultados, recomendamos enviar documentos de Word editables. La compatibilidad con PDF incluye extracción automática de texto para PDF escaneados y creados digitalmente.",
      },
      {
        q: "¿Cuál es el tamaño máximo de documento?",
        a: "RedactAI admite documentos de licitación desde 25 páginas hasta 890 páginas. Los archivos de hasta 200 MB se pueden cargar directamente. Si su documento es más grande, póngase en contacto con nuestro equipo de soporte para una carga asistida.",
      },
      {
        q: "¿Son seguros mis datos de documento?",
        a: "Sí. Todos los documentos se cifran en tránsito utilizando TLS 1.3 y en reposo utilizando cifrado AES-256. RedactAI cumple completamente con el Reglamento General de Protección de Datos (RGPD) de la UE y la Ley Orgánica de Protección de Datos Personales de España (LOPDGDD). Los documentos nunca se utilizan para entrenar ningún modelo de IA.",
      },
      {
        q: "¿Puedo comenzar desde una plantilla en blanco en lugar de cargar?",
        a: "Sí. RedactAI incluye una biblioteca de plantillas oficiales del gobierno obtenidas del portal de contratación del Ministerio de Hacienda. Puede comenzar cualquier licitación directamente desde una de estas plantillas y desarrollarla con asistencia de IA.",
      },
    ],
  },
  {
    label: "IA y Sugerencias",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    items: [
      {
        q: "¿De dónde provienen las sugerencias de IA?",
        a: "Cada sugerencia se deriva únicamente de fuentes oficiales, principalmente la Gaceta Oficial del Estado (BOE), el Portal de Contratación del Gobierno (PLACE) y una base de datos seleccionada de licitaciones públicas españolas aprobadas. RedactAI nunca inventa información ni utiliza fuentes no verificadas.",
      },
      {
        q: "¿Puede la IA realizar cambios en mi documento automáticamente?",
        a: "No. Este es un principio fundamental de RedactAI. No se aplica ningún cambio automáticamente. Cada sugerencia se le muestra para su revisión, y debe aceptar, editar o rechazar explícitamente cada una antes de que se aplique. Esto garantiza el control humano completo en cada paso.",
      },
      {
        q: "¿Cómo se ve una sugerencia?",
        a: "Cada sugerencia se muestra en una vista lado a lado que muestra su texto original junto a la revisión propuesta. Debajo de la comparación, verá una explicación en lenguaje natural de por qué se recomienda el cambio y el artículo o disposición legal específica a la que hace referencia.",
      },
      {
        q: "¿Qué pasará si no estoy de acuerdo con una sugerencia?",
        a: "Puede rechazar cualquier sugerencia con un solo clic. Las sugerencias rechazadas se registran en su registro de auditoría pero nunca se aplican al documento. También puede editar una sugerencia en línea antes de aceptarla, lo que le da control total sobre la redacción final.",
      },
    ],
  },
  {
    label: "Conformidad y Legal",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    items: [
      {
        q: "¿Qué leyes de contratación pública españolas cubre RedactAI?",
        a: "RedactAI cubre la Ley 9/2017 sobre Contratos del Sector Público (LCSP), Real Decreto 1098/2001, Real Decreto 817/2009 y las Directivas UE relevantes 2014/23/EU y 2014/24/EU tal como se transponEN en la ley española. La base de datos legal se actualiza regularmente para reflejar nuevas publicaciones en el BOE.",
      },
      {
        q: "¿Proporciona RedactAI un certificado de conformidad?",
        a: "RedactAI genera un informe de resumen de conformidad con cada exportación. Este informe describe los problemas detectados, las sugerencias realizadas y las decisiones tomadas por el funcionario revisor. Si bien esto no es un certificado legal formal, proporciona un registro de conformidad estructurado adecuado para archivos administrativos.",
      },
      {
        q: "¿Hay un registro de auditoría?",
        a: "Sí. Cada acción tomada dentro de un documento, incluyendo qué sugerencias fueron aceptadas, editadas o rechazadas por quién, se registra en un registro de auditoría con marca de tiempo. Este registro es exportable junto con el documento final y puede presentarse como parte del archivo administrativo.",
      },
      {
        q: "¿Puede RedactAI ayudar si una licitación ya ha sido impugnada?",
        a: "RedactAI es una herramienta de redacción y revisión, no un servicio de defensa legal. Si una licitación ya ha sido impugnada, recomendamos consultar a un abogado de contratación pública calificado. RedactAI puede ayudarle a preparar documentos futuros que reduzcan el riesgo de desafíos similares.",
      },
    ],
  },
  {
    label: "Precios y Planes",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    items: [
      {
        q: "¿Cómo se cotiza RedactAI?",
        a: "RedactAI se ofrece con base en suscripción por administración. Los precios escalan con el número de usuarios activos y el volumen de documentos procesados por mes. Póngase en contacto con nuestro equipo de ventas para obtener una cotización personalizada basada en el volumen de contratación de su administración.",
      },
      {
        q: "¿Hay una prueba gratuita?",
        a: "Sí. Ofrecemos una prueba gratuita de 14 días con acceso completo a todas las funciones, incluyendo carga de documentos, análisis de IA y exportación. No se requiere tarjeta de crédito para comenzar su prueba.",
      },
      {
        q: "¿Hay descuentos para administraciones más pequeñas?",
        a: "Sí. Tenemos niveles de precios especiales para municipios más pequeños y organismos locales con volúmenes de contratación más bajos. Por favor comuníquese con nuestro equipo de ventas para discutir su situación específica.",
      },
      {
        q: "¿Podemos pagar a través de un marco de contratación pública?",
        a: "Sí. RedactAI se puede contratar a través de acuerdos marco aprobados para servicios de software. Póngase en contacto con nosotros con los requisitos de contratación de su administración y proporcionaremos la documentación necesaria.",
      },
    ],
  },
];


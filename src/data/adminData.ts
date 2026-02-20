import { ActivityDataPoint, LegalReference, User } from "@/types/Admin.type";

export const DUMMY_USERS: User[] = [
  { id: "u1",  name: "Juan Smith",       email: "johnsm@example.com",     status: "Activo", documents: 48, lastLogin: "22-02-2026 09:30" },
  { id: "u2",  name: "Sarah Johnson",    email: "sarah@example.com",      status: "Activo", documents: 52, lastLogin: "22-02-2026 09:30" },
  { id: "u3",  name: "Miguel Wilson",    email: "mike@example.com",       status: "Activo", documents: 32, lastLogin: "22-02-2026 09:30" },
  { id: "u4",  name: "Champ Ullah",      email: "champull@example.com",   status: "Bloqueado", documents: 20, lastLogin: "22-02-2026 09:30" },
  { id: "u5",  name: "Elena García",     email: "elena.g@example.com",    status: "Activo", documents: 67, lastLogin: "21-02-2026 14:15" },
  { id: "u6",  name: "David Martínez",   email: "david.m@example.com",    status: "Activo", documents: 11, lastLogin: "21-02-2026 11:00" },
  { id: "u7",  name: "Laura Sánchez",    email: "laura.s@example.com",    status: "Bloqueado", documents: 5,  lastLogin: "20-02-2026 08:45" },
  { id: "u8",  name: "Carlos Ruiz",      email: "carlos.r@example.com",   status: "Activo", documents: 29, lastLogin: "20-02-2026 16:20" },
  { id: "u9",  name: "Amara Diallo",     email: "amara.d@example.com",    status: "Activo", documents: 14, lastLogin: "19-02-2026 10:10" },
  { id: "u10", name: "Pilar Fernández",  email: "pilar.f@example.com",    status: "Activo", documents: 38, lastLogin: "19-02-2026 13:55" },
  { id: "u11", name: "Omar Sheikh",      email: "omar.s@example.com",     status: "Bloqueado", documents: 3,  lastLogin: "18-02-2026 09:00" },
  { id: "u12", name: "Natalia López",    email: "natalia.l@example.com",  status: "Activo", documents: 22, lastLogin: "18-02-2026 17:30" },
  { id: "u13", name: "Tomás Pérez",      email: "tomas.p@example.com",    status: "Activo", documents: 45, lastLogin: "17-02-2026 12:00" },
  { id: "u14", name: "Ingrid Olsen",     email: "ingrid.o@example.com",   status: "Activo", documents: 19, lastLogin: "17-02-2026 08:30" },
  { id: "u15", name: "Bashir Noor",      email: "bashir.n@example.com",   status: "Bloqueado", documents: 7,  lastLogin: "16-02-2026 15:45" },
  { id: "u16", name: "Rosa Moreno",      email: "rosa.m@example.com",     status: "Activo", documents: 33, lastLogin: "16-02-2026 11:20" },
  { id: "u17", name: "Liam O'Brien",     email: "liam.ob@example.com",    status: "Activo", documents: 56, lastLogin: "15-02-2026 09:10" },
  { id: "u18", name: "Fatima Zahra",     email: "fatima.z@example.com",   status: "Activo", documents: 41, lastLogin: "15-02-2026 14:00" },
  { id: "u19", name: "Héctor Navarro",   email: "hector.n@example.com",   status: "Activo", documents: 28, lastLogin: "14-02-2026 10:50" },
  { id: "u20", name: "Zara Ahmed",       email: "zara.a@example.com",     status: "Bloqueado", documents: 2,  lastLogin: "14-02-2026 07:30" },
  { id: "u21", name: "Paulo Sousa",      email: "paulo.s@example.com",    status: "Activo", documents: 60, lastLogin: "13-02-2026 13:00" },
  { id: "u22", name: "Nina Kovač",       email: "nina.k@example.com",     status: "Activo", documents: 17, lastLogin: "13-02-2026 16:40" },
  { id: "u23", name: "Adrián Castro",    email: "adrian.c@example.com",   status: "Activo", documents: 23, lastLogin: "12-02-2026 09:15" },
  { id: "u24", name: "Mei Lin",          email: "mei.l@example.com",      status: "Activo", documents: 36, lastLogin: "12-02-2026 14:25" },
];

// ─── Referencias Legales Ficticias ────────────────────────────────────────────

export const DUMMY_LEGAL_REFS: LegalReference[] = [
  { id: "l1",  title: "Contrato de Mantenimiento de Infraestructura Pública 2026", category: "Legislación General", lastModified: "Hoy a las 12:45" },
  { id: "l2",  title: "Acuerdo Marco de Servicios de TI",                         category: "Reglamentos",          lastModified: "Hoy a las 12:45" },
  { id: "l3",  title: "Licitación de Gestión de Residuos Municipales",            category: "Guías Prácticas",      lastModified: "Hoy a las 12:45" },
  { id: "l4",  title: "Servicios de Consultoría de Planificación Urbana",         category: "Ejecución de Contrato", lastModified: "Hoy a las 12:45" },
  { id: "l5",  title: "Acuerdo Marco de Servicios de TI v2",                      category: "Legislación General", lastModified: "Hoy a las 12:45" },
  { id: "l6",  title: "Ley 9/2017 sobre Contratos del Sector Público",            category: "Legislación General", lastModified: "Ayer a las 09:00" },
  { id: "l7",  title: "Real Decreto 1098/2001 – Reglamentos Generales",           category: "Reglamentos",          lastModified: "Ayer a las 09:00" },
  { id: "l8",  title: "Directiva UE 2014/24/UE sobre Contratación Pública",      category: "Contratación",         lastModified: "20-02-2026" },
  { id: "l9",  title: "Marco de Externalización de Servicios de Salud",           category: "Ejecución de Contrato", lastModified: "20-02-2026" },
  { id: "l10", title: "Guía de Contratación de Transformación Digital",           category: "Guías Prácticas",      lastModified: "19-02-2026" },
  { id: "l11", title: "Especificaciones de Licitación de Servicios Sociales",     category: "Legislación General", lastModified: "19-02-2026" },
  { id: "l12", title: "Normas de Cumplimiento Ambiental 2025",                   category: "Reglamentos",          lastModified: "18-02-2026" },
  { id: "l13", title: "Acuerdo de Mantenimiento de Infraestructura Vial",         category: "Ejecución de Contrato", lastModified: "18-02-2026" },
  { id: "l14", title: "Marco de Licencias de Software 2026",                      category: "Contratación",         lastModified: "17-02-2026" },
  { id: "l15", title: "Directrices de Contratos de Servicios de Emergencia",      category: "Guías Prácticas",      lastModified: "17-02-2026" },
  { id: "l16", title: "Licitación de Construcción de Viviendas Públicas",         category: "Legislación General", lastModified: "16-02-2026" },
  { id: "l17", title: "Marco de Servicios de Ciberseguridad",                     category: "Reglamentos",          lastModified: "16-02-2026" },
  { id: "l18", title: "Contratación de Transporte y Logística 2026",             category: "Contratación",         lastModified: "15-02-2026" },
  { id: "l19", title: "Acuerdo Marco del Sector Educativo",                       category: "Ejecución de Contrato", lastModified: "15-02-2026" },
  { id: "l20", title: "Guía de Infraestructura de Gestión del Agua",              category: "Guías Prácticas",      lastModified: "14-02-2026" },
  { id: "l21", title: "Contratación de Tecnología de Ciudad Inteligente",         category: "Contratación",         lastModified: "14-02-2026" },
  { id: "l22", title: "Contrato de Preservación del Patrimonio Cultural",         category: "Legislación General", lastModified: "13-02-2026" },
  { id: "l23", title: "Acuerdo de Servicios de Energías Renovables",              category: "Reglamentos",          lastModified: "13-02-2026" },
  { id: "l24", title: "Marco de Equipos de Seguridad Pública 2026",               category: "Ejecución de Contrato", lastModified: "12-02-2026" },
];

// ─── Datos de Gráficos Ficticios ──────────────────────────────────────────────

export const MONTHLY_DATA: ActivityDataPoint[] = [
  { label: "Ene", value: 0 },
  { label: "Feb", value: 52000 },
  { label: "Mar", value: 42000 },
  { label: "Abr", value: 18000 },
  { label: "May", value: 47000 },
  { label: "Jun", value: 58000 },
  { label: "Jul", value: 49000 },
  { label: "Ago", value: 85000 },
  { label: "Sep", value: 72000 },
  { label: "Oct", value: 63000 },
  { label: "Nov", value: 78000 },
  { label: "Dic", value: 91000 },
];

export const WEEKLY_DATA: ActivityDataPoint[] = [
  { label: "Lun",  value: 8200 },
  { label: "Mar",  value: 14500 },
  { label: "Mié",  value: 11000 },
  { label: "Jue",  value: 19800 },
  { label: "Vie",  value: 16400 },
  { label: "Sáb",  value: 6200 },
  { label: "Dom",  value: 3100 },
];

// ─── Estadísticas de Resumen ──────────────────────────────────────────────────

export const OVERVIEW_STATS = {
  totalUsers: 710,
  uploadedLaws: 2000,
  documentsProcessed: 22025,
  aiAnalyses: 3590,
};
 import { Document } from "@/types/Document.type";

export const recentDocuments: Document[] = [
  {
    id: "1",
    name: "Contrato de Mantenimiento de Infraestructura Pública 2026",
    sections: 42,
    lastModified: "Hoy a las 12:45",
    status: "conforme",
    complianceScore: 97,
  },
  {
    id: "2",
    name: "Acuerdo Marco de Servicios de TI",
    sections: 38,
    lastModified: "Hoy a las 12:45",
    status: "revisión",
    complianceScore: 74,
  },
  {
    id: "3",
    name: "Licitación de Gestión de Residuos Municipales",
    sections: 38,
    lastModified: "Hoy a las 12:45",
    status: "conforme",
    complianceScore: 91,
  },
  {
    id: "4",
    name: "Servicios de Consultoría de Planificación Urbana",
    sections: 38,
    lastModified: "Hoy a las 12:45",
    status: "no-conforme",
    complianceScore: 43,
  },
  {
    id: "5",
    name: "Acuerdo Marco de Servicios de TI",
    sections: 38,
    lastModified: "Hoy a las 12:45",
    status: "pendiente",
    complianceScore: 68,
  },
];

export const allDocuments: Document[] = [
  ...recentDocuments,
  {
    id: "6",
    name: "Estándares de Contratación de Servicios de Salud 2025",
    sections: 55,
    lastModified: "Ayer a las 09:30",
    status: "conforme",
    complianceScore: 99,
  },
  {
    id: "7",
    name: "Marco de Licitación de Infraestructura Vial",
    sections: 29,
    lastModified: "Ayer a las 14:10",
    status: "revisión",
    complianceScore: 61,
  },
  {
    id: "8",
    name: "Licitación de Equipos de Seguridad Pública 2025",
    sections: 33,
    lastModified: "17 Feb a las 11:00",
    status: "conforme",
    complianceScore: 88,
  },
];
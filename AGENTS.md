# AGENTES - GESTIÓN DE LISTAS Y REGALOS

## Descripción

Aplicación clara y eficiente para gestionar listas y regalos. Pensada con foco en buenas prácticas de React, Next.js y TypeScript.

---

## Objetivo principal

- Permitir a los usuarios crear, editar, ver y eliminar listas y regalos de manera intuitiva.

---

## Funcionalidades clave

- Gestión completa de listas y regalos.
- Asignación de regalos a listas.
- Consulta rápida de regalos asignados.
- Navegación simple y responsiva.

---

## Tecnologías principales

- **Next.js** (seguimiento fiel de buenas prácticas y arquitectura de páginas)
- **TypeScript** (tipado seguro en toda la app)
- **Tailwind CSS** (estilos utilitarios)
- **Prisma** y **PostgreSQL** (persistencia de datos eficiente)

---

## Principios de arquitectura y diseño

- **Arquitectura Hexagonal:** separación clara entre lógica de negocio, infraestructura y controladores/adaptadores.
- **SOLID:** se prioriza la separación de responsabilidades, facilidad de extensión y mantenimiento del código.
- **DDD:** cada dominio (listas, regalos) tiene su propio contexto y entidad/repo/lógica.
- **Clean Code, DRY y KISS:** código limpio, reutilizable y fácil de entender.

---

## Organización de componentes y páginas

- Componentes reutilizables, preferiblemente de **Shadcn UI**.
- Si un componente no existe, crearlo siguiendo patrones de Shadcn o Radix UI.
- Utilizar utilidades como `cn` y `twMerge` para gestión de clases tailwind.
- Estructura clara entre componentes de presentación y contenedores.
- Uso extensivo de la arquitectura de páginas de Next.js (hidratación, prefetch, Suspense, Error Boundaries).
- Separación de responsabilidades: lógica de negocio fuera de componentes UI.

---

## Documentación y fuentes recomendadas

- [Next.js - Documentación LLMs](https://nextjs.org/docs/llms-full.txt)
- [Shadcn UI](https://ui.shadcn.com/llms.txt)
- [Better Auth](https://better-auth-ui.com/llms.txt)
---

**Importante:** Mantener siempre una clara separación de dominios, aplicar principios SOLID, DDD y Hexagonal en la organización del código. Evitar mezclas de lógica de negocio con UI. Las mejores prácticas de React, Next.js y TypeScript deben estar presentes en todo el proyecto.

# Reconstrução Local e APK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remover a dependência funcional do Base44, preservar os fluxos do app com armazenamento local e gerar um APK Android instalável.

**Architecture:** Um repositório local baseado em armazenamento persistente do navegador/WebView substituirá as entidades Base44. A interface React/TanStack existente será mantida; Capacitor fornecerá o contêiner Android e o ciclo de build.

**Tech Stack:** React 19, TanStack Start/Router, JavaScript, Node test runner, localStorage/IndexedDB conforme necessidade, Capacitor Android.

**Spec:** `docs/superpowers/specs/2026-11-11-reconstrucao-local-apk-design.md`

## Global Constraints

- Não depender de Base44 em runtime para a primeira versão.
- Preservar o fixture público `data/card-templates.json`.
- Não enviar dados pessoais para serviços externos.
- Escrever somente JavaScript/JSX; não criar TypeScript.
- Preservar o ZIP original fora da cópia de trabalho.

## Review Focus

- Recarregar o app não pode apagar cartões, favoritos, categorias ou lembretes.
- Dados de uma entidade não podem vazar para outra nem ser apagados parcialmente.
- IDs desconhecidos e cartões inexistentes devem retornar `null`/erro controlado.
- Exportação e exclusão devem incluir todas as entidades locais.
- O APK deve abrir sem depender de URL remota.

### Task 1: Local repository

**Files:**
- Create: `src/lib/local-store.js`
- Create: `src/lib/local-repository.js`
- Test: `tests/local-repository.test.js`
- Modify: `package.json`

- [ ] Write failing tests for CRUD, ownership namespace, revisions and persistence-shaped serialization.
- [ ] Run `npm test -- tests/local-repository.test.js` and observe the expected failure.
- [ ] Implement the smallest repository API for cards, revisions, favorites, categories and reminder preference.
- [ ] Run the focused test and then the full test suite.

### Task 2: Replace Base44 consumers

**Files:**
- Modify: `src/lib/cards.js`, `src/lib/privacy.js`, `src/components/FavoritesProvider.jsx`, `src/lib/AuthContext.jsx`
- Modify: personal-card routes and components importing `@/api/base44Client`
- Test: local behavior tests for cards, favorites and privacy

- [ ] Replace Base44 entity calls with the local repository.
- [ ] Convert authentication UI to a clearly labeled local profile/session.
- [ ] Verify create, edit, delete, revisions, favorites, categories, reminder settings, export and delete-all behavior.

### Task 3: Remove runtime Base44 coupling

**Files:**
- Modify: `src/lib/server-fns.js`, `src/start.js`, `src/routes/__root.jsx`, `vite.config.js`, `package.json`
- Delete or isolate: Base44-only auth/MFA/error gateway modules once unused

- [ ] Remove client imports of the Base44 SDK.
- [ ] Keep public template loading local and SSR-safe.
- [ ] Run lint, tests and production build with no Base44 environment variables.

### Task 4: Capacitor Android shell

**Files:**
- Modify: `package.json`
- Create: `capacitor.config.json`, `android/` generated project, app icons/splash assets as needed

- [ ] Add Capacitor dependencies and scripts.
- [ ] Configure the web output and app identifier.
- [ ] Generate Android project without committing generated build artifacts unnecessarily.
- [ ] Run the Android debug build when SDK/Gradle are available.

### Task 5: APK validation

**Files:**
- Create: `docs/apk-validation.md`

- [ ] Install the debug APK on an available emulator/device or validate its artifact metadata.
- [ ] Test launch, public library, local card creation, persistence, export and deletion.
- [ ] Save the APK as a user-facing deliverable under `D:\ChatGPT\Projetos\CartoesTCC\outputs`.

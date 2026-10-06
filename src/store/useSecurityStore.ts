"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { devices } from "@/data/agencia-demo";
import { sanitizeRecords } from "@/lib/testRecords";
import type { CameraView, CoverageType, DeviceType, TestRecord, WallMode } from "@/types";

interface SecurityState {
  view: CameraView;
  wallMode: WallMode;
  viewRevision: number;
  coverage: Record<CoverageType, boolean>;
  visibleTypes: Record<DeviceType, boolean>;
  selectedId: string | null;
  records: Record<string, TestRecord>;
  testMode: boolean;
  hydrated: boolean;
  storageError: boolean;
  setView: (view: CameraView) => void;
  toggleWalls: () => void;
  toggleCoverage: (type: CoverageType) => void;
  selectDevice: (id: string | null) => void;
  toggleType: (type: DeviceType) => void;
  showAll: () => void;
  resetView: () => void;
  toggleTestMode: () => void;
  saveTest: (id: string, status: "ok" | "falla", observation: string) => void;
  resetTests: () => void;
  finishHydration: () => void;
}

const allVisible: Record<DeviceType, boolean> = {
  camara: true, pir: true, humo: true, contacto: true, pulsador: true,
};
const browserStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name),
};

/** La inyección del almacenamiento permite probar recargas sin depender del navegador. */
export function createSecurityStore(backingStorage: StateStorage = browserStorage) {
  let reportStorageError = () => {};
  const storage: StateStorage = {
    getItem: async (name) => {
      try { return await backingStorage.getItem(name); }
      catch { reportStorageError(); return null; }
    },
    setItem: async (name, value) => {
      try { await backingStorage.setItem(name, value); }
      catch { reportStorageError(); }
    },
    removeItem: async (name) => {
      try { await backingStorage.removeItem(name); }
      catch { reportStorageError(); }
    },
  };

  const store = create<SecurityState>()(persist((set, get) => ({
    view: "isometrica",
    wallMode: "recortada",
    viewRevision: 0,
    coverage: { camara: false, pir: false, humo: false },
    visibleTypes: { ...allVisible },
    selectedId: null,
    records: {},
    testMode: false,
    hydrated: false,
    storageError: false,
    setView: (view) => set((state) => ({ view, viewRevision: state.viewRevision + 1 })),
    toggleWalls: () => set((state) => ({ wallMode: state.wallMode === "completa" ? "recortada" : "completa" })),
    toggleCoverage: (type) => set((state) => ({ coverage: { ...state.coverage, [type]: !state.coverage[type] } })),
    selectDevice: (id) => set((state) => {
      const device = devices.find((device) => device.id === id);
      return {
        selectedId: device?.id ?? null,
        viewRevision: state.viewRevision + 1,
        visibleTypes: device ? { ...state.visibleTypes, [device.tipo]: true } : state.visibleTypes,
      };
    }),
    toggleType: (type) => set((state) => ({
      visibleTypes: { ...state.visibleTypes, [type]: !state.visibleTypes[type] },
      selectedId: state.visibleTypes[type] && devices.find((device) => device.id === state.selectedId)?.tipo === type ? null : state.selectedId,
    })),
    showAll: () => set({ visibleTypes: { ...allVisible } }),
    resetView: () => set((state) => ({ selectedId: null, view: "isometrica", viewRevision: state.viewRevision + 1 })),
    toggleTestMode: () => { if (get().hydrated) set((state) => ({ testMode: !state.testMode })); },
    saveTest: (id, status, observation) => {
      if (!get().testMode || !get().hydrated || !devices.some((device) => device.id === id)) return;
      set((state) => ({
        records: { ...state.records, [id]: {
          estado: status,
          fecha: new Date().toISOString(),
          observacion: observation.trim().slice(0, 2000) || undefined,
        } },
      }));
    },
    resetTests: () => { if (get().testMode && get().hydrated) set({ records: {} }); },
    finishHydration: () => set({ hydrated: true }),
  }), {
    name: "agencia-demo-walk-test",
    version: 1,
    storage: createJSONStorage(() => storage),
    skipHydration: true,
    partialize: (state) => ({ records: state.records }),
    merge: (persisted, current) => {
      const data = persisted && typeof persisted === "object" && "records" in persisted ? persisted.records : undefined;
      return { ...current, records: sanitizeRecords(data, devices.map((device) => device.id)) };
    },
    onRehydrateStorage: () => (_state, error) => { if (error) reportStorageError(); },
  }));

  reportStorageError = () => {
    if (!store.getState().storageError) store.setState({ storageError: true });
  };
  return store;
}

export const useSecurityStore = createSecurityStore();

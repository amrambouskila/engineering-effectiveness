import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectData } from "../types/ProjectData.ts";

interface ProjectStore {
  projects: ProjectData[];
  selectedProjectId: string | null;
  addProject: (project: ProjectData) => void;
  updateProject: (project: ProjectData) => void;
  deleteProject: (id: string) => void;
  selectProject: (id: string | null) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      selectedProjectId: null,
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === project.id ? project : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProjectId:
            state.selectedProjectId === id ? null : state.selectedProjectId,
        })),
      selectProject: (id) => set({ selectedProjectId: id }),
    }),
    { name: "ee-project-store" }
  )
);

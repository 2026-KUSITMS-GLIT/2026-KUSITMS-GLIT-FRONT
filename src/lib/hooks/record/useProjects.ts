import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  deleteProject,
  getProjects,
  type ProjectSummary,
  updateProject,
} from "@/lib/apis/record/project";

export type ProjectTag = {
  id: number;
  name: string;
  deletable: boolean;
};

const toProjectTag = (project: ProjectSummary): ProjectTag | null => {
  if (!project.projectId || !project.name) return null;

  return {
    id: project.projectId,
    name: project.name,
    deletable: project.deletable ?? false,
  };
};

const isProjectTag = (projectTag: ProjectTag | null): projectTag is ProjectTag =>
  projectTag !== null;

export const useProjects = () =>
  useQuery({
    queryKey: ["projects", { page: 0, size: 100 }],
    queryFn: async () => {
      const response = await getProjects({ page: 0, size: 100 });

      return response?.projects?.map(toProjectTag).filter(isProjectTag) ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: createdProject => {
      if (!createdProject?.projectId || !createdProject.name) return;

      queryClient.setQueryData<ProjectTag[]>(
        ["projects", { page: 0, size: 100 }],
        currentProjects => {
          if (currentProjects?.some(project => project.id === createdProject.projectId)) {
            return currentProjects;
          }

          return [
            {
              id: createdProject.projectId!,
              name: createdProject.name!,
              deletable: true,
            },
            ...(currentProjects ?? []),
          ];
        },
      );
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, name }: { projectId: number; name: string }) =>
      updateProject(projectId, { name }),
    onSuccess: (_, { projectId, name }) => {
      queryClient.setQueryData<ProjectTag[]>(
        ["projects", { page: 0, size: 100 }],
        currentProjects =>
          currentProjects?.map(project =>
            project.id === projectId ? { ...project, name } : project,
          ) ?? [],
      );
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, projectId) => {
      queryClient.setQueryData<ProjectTag[]>(
        ["projects", { page: 0, size: 100 }],
        currentProjects => currentProjects?.filter(project => project.id !== projectId) ?? [],
      );
    },
  });
};

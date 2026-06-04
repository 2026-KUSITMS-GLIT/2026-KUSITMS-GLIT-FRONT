import { type QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteProjectId,
  getProjects,
  patchProjectId,
  postProjects,
  type ProjectCreateResponse,
  type ProjectSummary,
} from "@/lib/apis/record/project";
import { getProjectIdFromResponse } from "@/lib/utils/projectId";
import { addCreatedProjectTag } from "@/lib/utils/recordCreatedProjectTags";

export type ProjectTag = {
  id: number;
  name: string;
  deletable: boolean;
};

const toProjectTag = (project: ProjectSummary): ProjectTag | null => {
  const projectId = getProjectIdFromResponse(project);
  if (projectId === null || !project.name) return null;

  return {
    id: projectId,
    name: project.name,
    deletable: project.deletable ?? false,
  };
};

const isProjectTag = (projectTag: ProjectTag | null): projectTag is ProjectTag =>
  projectTag !== null;

export const projectsQueryKey = ["projects", { page: 0, size: 100 }] as const;

export const resolveProjectIdAfterCreate = async (
  queryClient: QueryClient,
  createdProject: ProjectCreateResponse | null,
  name: string,
): Promise<number | null> => {
  const fromResponse = getProjectIdFromResponse(createdProject);
  if (fromResponse !== null) return fromResponse;

  const pickFromCache = () =>
    queryClient.getQueryData<ProjectTag[]>(projectsQueryKey)?.find(tag => tag.name === name)?.id ??
    null;

  const cachedId = pickFromCache();
  if (cachedId !== null) return cachedId;

  await queryClient.refetchQueries({ queryKey: projectsQueryKey });

  return pickFromCache();
};

export const useProjects = () =>
  useQuery({
    queryKey: projectsQueryKey,
    queryFn: async () => {
      const response = await getProjects({ page: 0, size: 100 });

      return response?.projects?.map(toProjectTag).filter(isProjectTag) ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postProjects,
    onSuccess: async (createdProject, variables) => {
      const tagName = createdProject?.name ?? variables.name;
      const createdProjectId = await resolveProjectIdAfterCreate(
        queryClient,
        createdProject,
        tagName,
      );
      if (createdProjectId === null || !tagName) return;

      addCreatedProjectTag({ projectId: createdProjectId, name: tagName });

      queryClient.setQueryData<ProjectTag[]>(projectsQueryKey, currentProjects => {
        if (currentProjects?.some(project => project.id === createdProjectId)) {
          return currentProjects;
        }

        return [
          {
            id: createdProjectId,
            name: tagName,
            deletable: true,
          },
          ...(currentProjects ?? []),
        ].slice(0, 100);
      });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, name }: { projectId: number; name: string }) =>
      patchProjectId(projectId, { name }),
    onSuccess: (_, { projectId, name }) => {
      queryClient.setQueryData<ProjectTag[]>(
        projectsQueryKey,
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
    mutationFn: deleteProjectId,
    onSuccess: (_, projectId) => {
      queryClient.setQueryData<ProjectTag[]>(
        projectsQueryKey,
        currentProjects => currentProjects?.filter(project => project.id !== projectId) ?? [],
      );
    },
  });
};

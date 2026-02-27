// hooks/useDirections.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDirections,
  createDirection,
  updateDirectionById,
  deleteDirectionById,
} from "../api/direction";
import type { Direction } from "../interfaces";

export const directionKeys = {
  all: ["directions"] as const,
  lists: () => [...directionKeys.all, "list"] as const,
  list: (filters: string) => [...directionKeys.lists(), filters] as const,
  details: () => [...directionKeys.all, "detail"] as const,
  detail: (id: number) => [...directionKeys.details(), id] as const,
};

export const useDirections = () => {
  return useQuery({
    queryKey: directionKeys.lists(),
    queryFn: async () => {
      const data = await getDirections();
      return Array.isArray(data) ? data : [];
    },
  });
};

export const useCreateDirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newDirection: Partial<Direction>) =>
      createDirection(newDirection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: directionKeys.lists() });
    },
  });
};

export const useUpdateDirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Direction> }) =>
      updateDirectionById(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: directionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: directionKeys.detail(Number(id)),
      });
    },
  });
};

export const useDeleteDirection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDirectionById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: directionKeys.lists() });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({
  baseURL: "/api",
});

// Fetch all posts
export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await api.get<Post[]>("/posts");
      return data;
    },
  });
};

// Fetch single post
export const usePost = (id: number) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await api.get<Post>(`/posts/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost: FormData | Omit<Post, "id" | "createdAt" | "updatedAt">) => {
      // if FormData is provided (contains file), send multipart/form-data
      if (newPost instanceof FormData) {
        const { data } = await api.post<Post>("/posts", newPost, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
      }

      const { data } = await api.post<Post>("/posts", newPost);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// Update post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Post> & { id: number }) => {
      const { data } = await api.put<Post>(`/posts/${id}`, updates);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", data.id] });
    },
  });
};

// Delete post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

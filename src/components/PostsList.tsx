"use client";

import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Plus } from "lucide-react";

export function PostsList() {
  const utils = trpc.useContext();
  const { data: posts, isLoading, error } = trpc.posts.getAll.useQuery();
  const createMutation = trpc.posts.create.useMutation({
    onSuccess: () => utils.posts.getAll.invalidate(),
  });
  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => utils.posts.getAll.invalidate(),
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) {
      alert("Please fill in all fields");
      return;
    }
    // If there's an image, convert to base64 and send via tRPC
    if (imageFile) {
      const base64 = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string | null;
          // data:<mime>;base64,<data>
          if (!result) return resolve(null);
          const parts = result.split(',');
          resolve(parts.length > 1 ? parts[1] : parts[0]);
        };
        reader.readAsDataURL(imageFile);
      });

      createMutation.mutate(
        {
          title: formData.title,
          content: formData.content,
          author: formData.author,
          imageBase64: base64 ?? undefined,
          imageName: imageFile.name,
        },
        {
          onSuccess: () => {
            setFormData({ title: "", content: "", author: "" });
            setImageFile(null);
            setShowForm(false);
          },
        }
      );

      return;
    }

    createMutation.mutate(
      {
        title: formData.title,
        content: formData.content,
        author: formData.author,
      },
      {
        onSuccess: () => {
          setFormData({ title: "", content: "", author: "" });
          setShowForm(false);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading posts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  placeholder="Post title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author</label>
                <Input
                  placeholder="Author name"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  placeholder="Post content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={(post as any)._id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle>{(post as any).title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        By {(post as any).author} • {new Date((post as any).createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete((post as any)._id)}
                      disabled={!!(deleteMutation as any).isLoading}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{(post as any).content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet</p>
              <p className="text-gray-400 text-sm">Click "New Post" to create your first post</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

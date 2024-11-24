"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2 } from "lucide-react";
import { toast } from "sonner";
import Image from "@/types/image";

interface Props {
    setImageSelected(image: null): void;
    imageSelected: Image | null;
    onImageGenerated(): void;
}

const schema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000),
});

type FormData = z.infer<typeof schema>;

export function ImageGenerator({ setImageSelected, imageSelected, onImageGenerated }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    useEffect(() => {
        if (imageSelected) {
            setGeneratedImage(imageSelected.url);
            } else {
                setGeneratedImage(null);
            }
    }, [imageSelected]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
        values: { prompt: imageSelected?.prompt || "" },
    resolver: zodResolver(schema),
  });

const processResponse = async (response: Response, message: string) => {
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      setGeneratedImage(result.imageUrl);
      toast.success(message);
      setImageSelected(null);
      onImageGenerated();
}

  const onSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
        await processResponse(response, "Image generated successfully!");
    } catch (error) {
        if (error instanceof Error) { toast.error(`${error.message}. Please try again.`); }
    } finally {
      setIsGenerating(false);
    }
  };

  const onEdit = async (data: FormData) => {
      try {
        setIsGenerating(true);
      await fetch(`/api/images/${imageSelected?.id}`, {
        method: "DELETE",
      });
      const create = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
        await processResponse(create, "Image edited successfully!");
    } catch (error) {
        if (error instanceof Error) { toast.error(`${error.message}. Please try again.`); }
      } finally {
        setIsGenerating(false);
      }
}

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8" id="generator">
      <form onSubmit={handleSubmit(imageSelected ? onEdit : onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Enter your prompt
          </label>
          <textarea
            {...register("prompt")}
            id="prompt"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={4}
            placeholder="A serene landscape with mountains..."
          />
          {errors.prompt && (
            <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Wand2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="-ml-1 mr-2 h-4 w-4" />
              {imageSelected ? 'Edit' : 'Generate'} Image
            </>
          )}
        </button>
{imageSelected ? (
            <button
                onClick={() => setImageSelected(null)}
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2"
            >
                Cancel
            </button>
        ) : null}
      </form>

      {generatedImage && (
        <div className="mt-6">
          <img
            src={generatedImage}
            alt="Generated"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

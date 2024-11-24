"use client";

import { useState, useEffect } from "react";
import { Share2, Trash2, Download, Edit } from "lucide-react";
import { toast } from "sonner";
import Image from "@/types/image";

interface Props {
  setImageSelected(image: Image): void;
  refreshGallery: boolean;
}

export function Gallery({setImageSelected, refreshGallery}: Props) {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onDelete, setOnDelete] = useState('');

  useEffect(() => {
    fetchImages();
  }, [refreshGallery]);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/images");
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast.error("Failed to load gallery images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
        setOnDelete(id);
      const response = await fetch(`/api/images/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await  response.text());
      setImages(images.filter((image) => image.id !== id));
      toast.success("Image deleted successfully");
      setOnDelete('');
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleDownload = async (image: Image) => {
      try {
          const response = await fetch(image.url);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = image.id + ".png";
          a.click();
          URL.revokeObjectURL(url);
      } catch (error) {
          toast.error("Failed to download image");
      }
  };


  const handleShare = async (image: Image) => {
    try {
      await navigator.share({
        title: "AI Generated Image",
        text: image.prompt,
        url: image.url,
      });
    } catch (error) {
      toast.error("Failed to share image");
    }
  };

  const handleZoom = async (image: Image) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to zoom image");
    }
  };

  const handleEdit = async (image: Image) => {
    setImageSelected(image);
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg overflow-hidden aspect-square relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-500">
        No images generated yet. Start by creating one!
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Your Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative bg-white rounded-lg overflow-hidden shadow-md"
          >
          <div className="relative">
          <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-64 object-cover"
          />
          <div onClick={() => handleZoom(image)} className="cursor-pointer absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          Zoom Image
          </div>
          </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 line-clamp-2">{image.prompt}</p>
              <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleDownload(image)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                >
                <Download className="h-5 w-5" />
                </button>
                <a
                    href="#generator"
                  onClick={() => handleEdit(image)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                >
                    <Edit className="h-5 w-5" />
                </a>
                <button
                  onClick={() => handleShare(image)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={onDelete === image.id}
                  className="p-2 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

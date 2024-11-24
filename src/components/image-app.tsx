'use client';

import React, { useState } from 'react';
import { ImageGenerator } from './image-generator';
import { Gallery } from './gallery';
import Image from '@/types/image';

const ImageApp = () => {
  const [refreshGallery, setRefreshGallery] = useState(true);
    const [imageSelected, setImageSelected] = useState<Image | null>(null);

  // Custom handler for successful image generation
  const handleImageGenerated = () => {
    // Trigger gallery refresh
    setRefreshGallery(prev => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ImageGenerator setImageSelected={setImageSelected} imageSelected={imageSelected} onImageGenerated={handleImageGenerated} />
      <Gallery setImageSelected={setImageSelected} refreshGallery={refreshGallery} />
    </div>
  );
};

export default ImageApp;

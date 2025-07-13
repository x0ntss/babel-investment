"use client";
import React, { useState } from 'react';
import { Box, Skeleton, Image as ChakraImage } from '@chakra-ui/react';
import NextImage from 'next/image';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  placeholder = "blur",
  blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==",
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <Box
        width={width}
        height={height}
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        {...props}
      >
        <Box textAlign="center" color="gray.500">
          <Box fontSize="2xl">📷</Box>
          <Box fontSize="sm">Image not found</Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box position="relative" width={width} height={height} {...props}>
      {isLoading && (
        <Skeleton
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          zIndex={1}
        />
      )}
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        style={{
          objectFit: 'contain',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </Box>
  );
};

export default OptimizedImage; 
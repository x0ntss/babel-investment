"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Flex, IconButton, Text, useBreakpointValue, Link } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import OptimizedImage from "./OptimizedImage";

const TopBannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        const activeBanners = data.filter(b => b.active !== false);
        setBanners(activeBanners);
        if (activeBanners.length > 0 && activeBanners[0].autoplay !== undefined) setAutoplay(activeBanners[0].autoplay);
      });
  }, []);

  useEffect(() => {
    if (autoplay && banners.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(intervalRef.current);
    }
    return () => {};
  }, [autoplay, banners.length]);

  const goTo = (idx) => setCurrent(idx);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  const next = () => setCurrent((prev) => (prev + 1) % banners.length);

  // Swipe support
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) prev();
    else if (dx < -50) next();
    touchStartX.current = null;
  };

  const height = useBreakpointValue({ base: "25vh", md: "25vh" });

  if (!banners.length) return null;

  const banner = banners[current];

  const imageContent = banner.link ? (
    <Link href={banner.link} isExternal _hover={{ opacity: 0.8 }}>
      <OptimizedImage
        src={banner.imageUrl}
        alt={banner.title || "Banner"}
        width={1920}
        height={400}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        priority
      />
    </Link>
  ) : (
    <OptimizedImage
      src={banner.imageUrl}
      alt={banner.title || "Banner"}
      width={1920}
      height={400}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      priority
    />
  );

  return (
    <Box
      w="100%"
      h={height}
      position="relative"
      overflow="hidden"
      bg="gray.100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      mb={4}
      borderRadius={{ base: "none", md: "xl" }}
      boxShadow={{ base: "none", md: "lg" }}
    >
      {imageContent}
      <Flex
        position="absolute"
        left={0}
        top={0}
        w="100%"
        h="100%"
        align="center"
        justify="center"
        direction="column"
        bg="rgba(0,0,0,0.3)"
        color="white"
        px={4}
        textAlign="center"
      >
        {banner.title && <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">{banner.title}</Text>}
        {banner.text && <Text fontSize={{ base: "sm", md: "lg" }} mt={2}>{banner.text}</Text>}
      </Flex>
      {banners.length > 1 && (
        <>
          <IconButton
            aria-label="Previous"
            icon={<ChevronLeftIcon boxSize={8} />}
            position="absolute"
            left={2}
            top="50%"
            transform="translateY(-50%)"
            onClick={prev}
            zIndex={2}
            bg="rgba(0,0,0,0.4)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.7)" }}
            size="lg"
            borderRadius="full"
          />
          <IconButton
            aria-label="Next"
            icon={<ChevronRightIcon boxSize={8} />}
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
            onClick={next}
            zIndex={2}
            bg="rgba(0,0,0,0.4)"
            color="white"
            _hover={{ bg: "rgba(0,0,0,0.7)" }}
            size="lg"
            borderRadius="full"
          />
        </>
      )}
      <Flex position="absolute" bottom={2} left="50%" transform="translateX(-50%)" gap={2}>
        {banners.map((_, idx) => (
          <Box
            key={idx}
            w={idx === current ? 3 : 2}
            h={idx === current ? 3 : 2}
            bg={idx === current ? "white" : "gray.400"}
            borderRadius="full"
            cursor="pointer"
            border={idx === current ? "2px solid #3182ce" : "none"}
            onClick={() => goTo(idx)}
            transition="all 0.2s"
          />
        ))}
      </Flex>
    </Box>
  );
};

export default TopBannerCarousel; 
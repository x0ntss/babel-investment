import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      // Web3 color palette
      primary: "#6366f1", // Indigo
      secondary: "#8b5cf6", // Purple
      accent: "#06b6d4", // Cyan
      success: "#10b981", // Emerald
      warning: "#f59e0b", // Amber
      error: "#ef4444", // Red
      
      // Dark gradients
      darkBg: "#0a0a0a",
      darkCard: "#111111",
      darkBorder: "#1f1f1f",
      
      // Neon accents
      neonBlue: "#00d4ff",
      neonPurple: "#a855f7",
      neonGreen: "#00ff88",
      neonPink: "#ff0080",
      
      // Glassmorphism
      glass: "rgba(255, 255, 255, 0.05)",
      glassBorder: "rgba(255, 255, 255, 0.1)",
    },
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        color: "white",
        fontFamily: "Inter, system-ui, sans-serif",
        minHeight: "100vh",
        backgroundAttachment: "fixed",
      },
      "*": {
        borderColor: "brand.darkBorder",
      },
      // Ensure text readability on dark backgrounds
      "h1, h2, h3, h4, h5, h6": {
        color: "white",
      },
      "p, span, div": {
        color: "white",
      },
      // Override any dark text on dark backgrounds
      ".dark-text": {
        color: "white !important",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "600",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        _focus: {
          boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.3)",
        },
      },
      variants: {
        solid: {
          bg: "linear-gradient(135deg, brand.primary 0%, brand.secondary 100%)",
          color: "white",
          _hover: {
            bg: "linear-gradient(135deg, brand.secondary 0%, brand.primary 100%)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)",
          },
          _active: {
            transform: "translateY(0)",
          },
        },
        outline: {
          border: "2px solid",
          borderColor: "brand.primary",
          color: "brand.primary",
          bg: "transparent",
          _hover: {
            bg: "brand.primary",
            color: "white",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
          },
        },
        ghost: {
          color: "white",
          _hover: {
            bg: "brand.glass",
            transform: "translateY(-1px)",
          },
        },
        neon: {
          bg: "transparent",
          border: "2px solid",
          borderColor: "brand.neonBlue",
          color: "brand.neonBlue",
          boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
          _hover: {
            bg: "brand.neonBlue",
            color: "black",
            boxShadow: "0 0 30px rgba(0, 212, 255, 0.6)",
            transform: "translateY(-2px)",
          },
        },
      },
      sizes: {
        lg: {
          px: 8,
          py: 4,
          fontSize: "lg",
        },
      },
    },
    Card: {
      baseStyle: {
        bg: "brand.glass",
        backdropFilter: "blur(20px)",
        border: "1px solid",
        borderColor: "brand.glassBorder",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        color: "white",
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: "brand.darkCard",
          border: "1px solid",
          borderColor: "brand.darkBorder",
          borderRadius: "12px",
          color: "white",
          _placeholder: {
            color: "gray.400",
          },
          _focus: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
          },
          _hover: {
            borderColor: "brand.primary",
          },
        },
      },
    },
    Textarea: {
      baseStyle: {
        bg: "brand.darkCard",
        border: "1px solid",
        borderColor: "brand.darkBorder",
        borderRadius: "12px",
        color: "white",
        _placeholder: {
          color: "gray.400",
        },
        _focus: {
          borderColor: "brand.primary",
          boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          bg: "brand.darkCard",
          border: "1px solid",
          borderColor: "brand.darkBorder",
          borderRadius: "12px",
          color: "white",
          _focus: {
            borderColor: "brand.primary",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)",
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "brand.darkCard",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: "brand.glassBorder",
          borderRadius: "16px",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
          color: "white",
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "8px",
        fontWeight: "600",
      },
      variants: {
        solid: {
          bg: "brand.primary",
          color: "white",
        },
        outline: {
          border: "1px solid",
          borderColor: "brand.primary",
          color: "brand.primary",
        },
        neon: {
          bg: "transparent",
          border: "1px solid",
          borderColor: "brand.neonGreen",
          color: "brand.neonGreen",
          boxShadow: "0 0 10px rgba(0, 255, 136, 0.3)",
        },
      },
    },
    Text: {
      baseStyle: {
        color: "white",
      },
    },
    Heading: {
      baseStyle: {
        color: "white",
      },
    },
  },
});

export default theme; 
// src/components/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      darkGreen: "#0d2f2f", // لون خلفية غامق أساسي
      gold: "#d4af37",      // لون ذهبي رئيسي
    },
  },
  styles: {
    global: {
      body: {
        bg: "brand.darkGreen",
        color: "brand.gold",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
      variants: {
        solid: {
          bg: "brand.gold",
          color: "brand.darkGreen",
          _hover: {
            bg: "#e5c765",
          },
        },
      },
    },
  },
});

export default theme;

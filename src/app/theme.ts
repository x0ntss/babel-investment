import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      darkGreen: "#0d2f2f",
      gold: "#d4af37",
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
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,  // Esto hace que Vite escuche en todas las interfaces de red
    allowedHosts: ['aroundthe.chickenkiller.com', 'www.aroundthe.chickenkiller.com'] // Aquí agregas tus dominios
  },
});

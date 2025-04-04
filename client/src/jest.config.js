export default {
  // La raíz del proyecto desde donde Jest debería escanear por archivos
  roots: ["<rootDir>/src"],

  // Extensiones de archivo que Jest debería buscar
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],

  // Transforma archivos con babel-jest
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!(@babel)/)"],

  // Mapea los alias que usas en tu proyecto
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Para manejar imports de estilos
  },

  // Patrón para encontrar archivos de test
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  // Configuración de pruebas
  testEnvironment: "jsdom",

  // Generar cobertura de código
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{js,ts}",
    "!src/serviceWorker.js",
    "!src/setupTests.{js,ts}",
  ],

  // Directorio para reportes de cobertura
  coverageDirectory: "coverage",

  // Configuración para react-testing-library
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};

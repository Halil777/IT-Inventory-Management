import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Dashboard": "Dashboard",
      "Cartridges": "Cartridges",
      "Devices": "Devices",
      "Employees": "Employees",
      "Printers": "Printers",
      "Reports": "Reports",
      "Export to Excel": "Export to Excel",
    }
  },
  es: {
    translation: {
      "Dashboard": "Tablero",
      "Cartridges": "Cartuchos",
      "Devices": "Dispositivos",
      "Employees": "Empleados",
      "Printers": "Impresoras",
      "Reports": "Informes",
      "Export to Excel": "Exportar a Excel",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

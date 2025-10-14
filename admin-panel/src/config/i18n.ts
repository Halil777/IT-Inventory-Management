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
      "Departments": "Departments",
      "Credentials": "Credentials",
      "Head": "Head",
      "Description": "Description",
      "Full Name": "Full Name",
      "Login": "Login",
      "Password": "Password",
      "Please input the department name!": "Please input the department name!",
      "Please input the full name!": "Please input the full name!",
      "Please input the login!": "Please input the login!",
      "Please input the password!": "Please input the password!",
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
      "Departments": "Departamentos",
      "Credentials": "Credenciales",
      "Head": "Jefe",
      "Description": "Descripción",
      "Full Name": "Nombre completo",
      "Login": "Usuario",
      "Password": "Contraseña",
      "Please input the department name!": "¡Por favor ingrese el nombre del departamento!",
      "Please input the full name!": "¡Por favor ingrese el nombre completo!",
      "Please input the login!": "¡Por favor ingrese el usuario!",
      "Please input the password!": "¡Por favor ingrese la contraseña!",
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

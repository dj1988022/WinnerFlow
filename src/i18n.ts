import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome back",
      "dashboard": "Mission Control",
      "trends": "Future Winners",
      "ad_decoder": "Ad Decoder",
      "intent_miner": "Intent Miner",
      "influencers": "Influencer Match",
      "automation": "Auto Workflow",
      "settings": "Settings",
      "feedback_title": "Help Us Improve",
      "feedback_desc": "We are building this for YOU. Tell us what sucks, what's missing, or what you love.",
      "leave_feedback": "Leave Feedback",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "email": "Email",
      "password": "Password",
      "name": "Name",
      "submit": "Submit",
      "language": "Language",
      "system_status": "System Status",
      "online": "ONLINE",
      "api_usage": "API Usage"
    }
  },
  es: {
    translation: {
      "welcome": "Bienvenido de nuevo",
      "dashboard": "Centro de Mando",
      "trends": "Futuros Ganadores",
      "ad_decoder": "Decodificador de Anuncios",
      "intent_miner": "Minero de Intención",
      "influencers": "Match de Influencers",
      "automation": "Flujo Automático",
      "settings": "Configuración",
      "feedback_title": "Ayúdanos a Mejorar",
      "feedback_desc": "Estamos construyendo esto para TI. Dinos qué apesta, qué falta o qué te encanta.",
      "leave_feedback": "Dejar Comentarios",
      "login": "Iniciar Sesión",
      "register": "Registrarse",
      "logout": "Cerrar Sesión",
      "email": "Correo",
      "password": "Contraseña",
      "name": "Nombre",
      "submit": "Enviar",
      "language": "Idioma",
      "system_status": "Estado del Sistema",
      "online": "EN LÍNEA",
      "api_usage": "Uso de API"
    }
  },
  fr: {
    translation: {
      "welcome": "Bon retour",
      "dashboard": "Centre de Contrôle",
      "trends": "Futurs Gagnants",
      "ad_decoder": "Décodeur de Pubs",
      "intent_miner": "Mineur d'Intention",
      "influencers": "Match d'Influenceurs",
      "automation": "Flux Automatique",
      "settings": "Paramètres",
      "feedback_title": "Aidez-nous à Améliorer",
      "feedback_desc": "Nous construisons ceci pour VOUS. Dites-nous ce qui ne va pas, ce qui manque ou ce que vous aimez.",
      "leave_feedback": "Laisser un Commentaire",
      "login": "Connexion",
      "register": "S'inscrire",
      "logout": "Déconnexion",
      "email": "Email",
      "password": "Mot de passe",
      "name": "Nom",
      "submit": "Soumettre",
      "language": "Langue",
      "system_status": "État du Système",
      "online": "EN LIGNE",
      "api_usage": "Utilisation API"
    }
  },
  de: {
    translation: {
      "welcome": "Willkommen zurück",
      "dashboard": "Kontrollzentrum",
      "trends": "Zukünftige Gewinner",
      "ad_decoder": "Anzeigen-Decoder",
      "intent_miner": "Absichts-Miner",
      "influencers": "Influencer Match",
      "automation": "Auto-Workflow",
      "settings": "Einstellungen",
      "feedback_title": "Helfen Sie uns",
      "feedback_desc": "Wir bauen das für SIE. Sagen Sie uns, was schlecht ist, was fehlt oder was Sie lieben.",
      "leave_feedback": "Feedback hinterlassen",
      "login": "Anmelden",
      "register": "Registrieren",
      "logout": "Abmelden",
      "email": "E-Mail",
      "password": "Passwort",
      "name": "Name",
      "submit": "Absenden",
      "language": "Sprache",
      "system_status": "Systemstatus",
      "online": "ONLINE",
      "api_usage": "API-Nutzung"
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

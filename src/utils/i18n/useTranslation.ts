import { useSettingStore } from "../../store/settingStore";
import { translations, LanguageCode } from "./translations";

export const useTranslation = () => {
    const language = useSettingStore((state) => state.language) as LanguageCode;
    const t = translations[language] || translations.en;
    return { t, language };
};

export default class Translation {
    constructor() {
        this.translations = {
            'play': {
                'zh': '按下播放',
                'es': 'presiona play',
                'en': 'press play',
                'hi': 'प्ले दबाएं',
                'ar': 'اضغط على تشغيل',
                'fr': 'appuyez sur jouer',
                'ru': 'нажмите play',
                'pt': 'aperte play',
                'de': 'drücke play',
                'jp': 'プレイを押して',
                'he': 'לחץ על play',
                'tr': 'play\'e basın',
                'ko': '플레이를 누르세요',
                'uk': 'натисніть play'
            },
            'choose variant': {
                'zh': '选择变体',
                'es': 'elige variante',
                'en': 'choose variant',
                'hi': 'वेरिएंट चुनें',
                'ar': 'اختر البديل',
                'fr': 'choisissez une variante',
                'ru': 'выберите вариант',
                'pt': 'escolha a variante',
                'de': 'wähle Variante',
                'jp': 'バリアントを選択',
                'he': 'בחר וריאנט',
                'tr': 'çeşidi seçin',
                'ko': '변형을 선택하세요',
                'uk': 'оберіть варіант'
            }
        };
    }

    make(langCode, code) {
        const phraseTranslations = this.translations[code];
        if (phraseTranslations) {
            return phraseTranslations[langCode] || phraseTranslations['en']; // Default to English if langCode not found
        }
        return ''; // Return empty string if code not found
    }
}
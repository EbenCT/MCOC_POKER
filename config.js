// config.js - Configuración del juego y parámetros personalizables
class GameConfig {
    static settings = {
        // Configuración del juego
        maxRounds: 3,
        handSize: 5,
        totalCards: 52,
        
        // Configuración de probabilidades
        probabilityPrecision: 1, // Decimales en probabilidades
        minProbabilityToShow: 2, // Probabilidad mínima para mostrar sugerencias
        
        // Configuración de análisis
        maxStrategiesShown: 3,
        enableAutoAnalysis: true,
        autoAnalysisDelay: 300,
        
        // Configuración de interfaz
        showDebugInfo: true,
        enableAnimations: true,
        showDetailedAdvice: true,
        
        // Configuración de sonidos (para futuras mejoras)
        enableSounds: false,
        soundVolume: 0.5,
        
        // Parámetros de dificultad
        expertMode: false, // Mostrar menos ayuda, más desafío
        showProbabilityHints: true,
        
        // Configuración visual
        theme: 'default', // 'default', 'dark', 'colorful'
        cardSize: 'medium', // 'small', 'medium', 'large'
        
        // Configuración de puntuación
        enableBonuses: true,
        earlyRetirementBonus: 0.1, // 10% bonus por retirarse en ronda 1
        highScoreBonus: 100, // Bonus por puntuación >= 1000
        
        // Límites y validaciones
        maxDiscardCards: 4,
        minCardsToAnalyze: 1,
        
        // Configuración de consejos
        adviceVerbosity: 'detailed', // 'simple', 'detailed', 'expert'
        showAlternativeStrategies: true,
        showRiskAssessment: true
    };
    
    static combinations = {
        fuerza_certificada: {
            points: 10000,
            name: 'Fuerza Certificada',
            description: '10, 11, 12, 13, * de la misma facción',
            rarity: 'legendary',
            color: '#FFD700'
        },
        super_trajes: {
            points: 5000,
            name: 'Super Trajes',
            description: '5 de la misma facción con valores secuenciales',
            rarity: 'epic',
            color: '#9370DB'
        },
        fantastico: {
            points: 1500,
            name: 'Fantástico',
            description: '4 del mismo valor + 1 de cualquier otro',
            rarity: 'rare',
            color: '#FF6347'
        },
        creador_reyes: {
            points: 850,
            name: 'Creador de Reyes',
            description: '3 del mismo valor + 2 de otro valor igual',
            rarity: 'uncommon',
            color: '#4169E1'
        },
        reaccion_faccion: {
            points: 800,
            name: 'Reacción de Facción',
            description: '5 de la misma facción',
            rarity: 'uncommon',
            color: '#32CD32'
        },
        orden_capitan: {
            points: 750,
            name: 'Orden del Capitán',
            description: '5 con valores secuenciales',
            rarity: 'uncommon',
            color: '#20B2AA'
        },
        amenaza_triple: {
            points: 425,
            name: 'Amenaza Triple',
            description: '3 iguales + 2 diferentes no iguales',
            rarity: 'common',
            color: '#FFA500'
        },
        doble_problema: {
            points: 325,
            name: 'Doble Problema',
            description: '2 iguales + 2 iguales + 1 diferente',
            rarity: 'common',
            color: '#CD853F'
        },
        el_impar: {
            points: 300,
            name: 'El Impar',
            description: '4 de la misma facción + 1 de otra',
            rarity: 'common',
            color: '#9932CC'
        },
        cuarto_escalon: {
            points: 275,
            name: 'Cuarto Escalón',
            description: '4 secuenciales + 1 no secuencial',
            rarity: 'common',
            color: '#8FBC8F'
        },
        duo_mortal: {
            points: 50,
            name: 'Dúo Mortal',
            description: '2 iguales + 3 diferentes',
            rarity: 'basic',
            color: '#696969'
        },
        lobos_solitarios: {
            points: 10,
            name: 'Lobos Solitarios',
            description: 'Sin combinaciones especiales',
            rarity: 'basic',
            color: '#808080'
        }
    };
    
    static suits = {
        '🔥': { name: 'Fuego', color: '#ff4500', element: 'fire' },
        '☄️': { name: 'Meteoro', color: '#ffd700', element: 'cosmic' },
        '🌩️': { name: 'Tormenta', color: '#1e90ff', element: 'storm' },
        '✊': { name: 'Fuerza', color: '#32cd32', element: 'earth' }
    };
    
    static riskLevels = {
        EXTREMO: { color: '#FF0000', weight: 5 },
        ALTO: { color: '#FF4500', weight: 4 },
        MEDIO: { color: '#FFA500', weight: 3 },
        BAJO: { color: '#32CD32', weight: 2 },
        JUSTIFICADO: { color: '#00CED1', weight: 1 }
    };
    
    // Métodos para gestionar configuración
    static getSetting(key) {
        return this.settings[key];
    }
    
    static setSetting(key, value) {
        if (key in this.settings) {
            this.settings[key] = value;
            this.saveToLocalStorage();
        }
    }
    
    static getCombination(type) {
        return this.combinations[type] || this.combinations.lobos_solitarios;
    }
    
    static getSuit(suitSymbol) {
        return this.suits[suitSymbol] || { name: 'Desconocido', color: '#FFFFFF' };
    }
    
    static saveToLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('pokerAdvisorConfig', JSON.stringify(this.settings));
        }
    }
    
    static loadFromLocalStorage() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('pokerAdvisorConfig');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    this.settings = { ...this.settings, ...parsed };
                } catch (e) {
                    console.warn('Error loading config from localStorage:', e);
                }
            }
        }
    }
    
    static resetToDefaults() {
        const defaults = {
            maxRounds: 3,
            handSize: 5,
            totalCards: 52,
            probabilityPrecision: 1,
            minProbabilityToShow: 2,
            maxStrategiesShown: 3,
            enableAutoAnalysis: true,
            autoAnalysisDelay: 300,
            showDebugInfo: true,
            enableAnimations: true,
            showDetailedAdvice: true,
            enableSounds: false,
            soundVolume: 0.5,
            expertMode: false,
            showProbabilityHints: true,
            theme: 'default',
            cardSize: 'medium',
            enableBonuses: true,
            earlyRetirementBonus: 0.1,
            highScoreBonus: 100,
            maxDiscardCards: 4,
            minCardsToAnalyze: 1,
            adviceVerbosity: 'detailed',
            showAlternativeStrategies: true,
            showRiskAssessment: true
        };
        
        this.settings = defaults;
        this.saveToLocalStorage();
    }
    
    static getThemeColors() {
        const themes = {
            default: {
                primary: '#ffd700',
                secondary: '#4a90e2',
                background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
                cardBorder: '#ffd700',
                text: '#ffffff'
            },
            dark: {
                primary: '#bb86fc',
                secondary: '#03dac6',
                background: 'linear-gradient(135deg, #121212, #1f1f1f)',
                cardBorder: '#bb86fc',
                text: '#ffffff'
            },
            colorful: {
                primary: '#ff6b6b',
                secondary: '#4ecdc4',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                cardBorder: '#ff6b6b',
                text: '#ffffff'
            }
        };
        
        return themes[this.settings.theme] || themes.default;
    }
    
    static getAdviceLevel() {
        if (this.settings.expertMode) {
            return 'expert';
        }
        return this.settings.adviceVerbosity;
    }
    
    static shouldShowProbability(probability) {
        return probability >= this.settings.minProbabilityToShow;
    }
    
    static getMaxStrategies() {
        return this.settings.expertMode ? 2 : this.settings.maxStrategiesShown;
    }
}

// Inicializar configuración al cargar
GameConfig.loadFromLocalStorage();
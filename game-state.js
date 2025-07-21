// game-state.js - Manejo del estado del juego
class GameState {
    constructor() {
        this.currentRound = 1;
        this.maxRounds = 3;
        this.totalCards = 52;
        this.handSize = 5;
        this.cardsRemaining = this.totalCards - this.handSize;
        this.discardedCards = [];
        this.usedCards = new Set();
    }
    
    reset() {
        this.currentRound = 1;
        this.cardsRemaining = this.totalCards - this.handSize;
        this.discardedCards = [];
        this.usedCards.clear();
    }
    
    nextRound(discardCount) {
        if (this.currentRound < this.maxRounds) {
            this.currentRound++;
            this.cardsRemaining -= discardCount;
            return true;
        }
        return false;
    }
    
    canContinue() {
        return this.currentRound < this.maxRounds;
    }
    
    getRoundProgress() {
        return `${this.currentRound}/${this.maxRounds}`;
    }
    
    getRemainingCards() {
        return this.cardsRemaining;
    }
    
    addUsedCard(card) {
        this.usedCards.add(`${card.value}-${card.suit}`);
    }
    
    isCardUsed(value, suit) {
        return this.usedCards.has(`${value}-${suit}`);
    }
    
    getAvailableCards() {
        const allCards = [];
        const suits = ['🔥', '☄️', '🌩️', '✊'];
        
        // Generar todas las cartas posibles
        for (let suit of suits) {
            for (let value = 2; value <= 13; value++) {
                if (!this.isCardUsed(value, suit)) {
                    allCards.push({ value, suit, display: value.toString() });
                }
            }
            // Agregar As (*)
            if (!this.isCardUsed(14, suit)) {
                allCards.push({ value: 14, suit, display: '*', isAce: true });
            }
        }
        
        return allCards;
    }
}

const handRankings = {
    'fuerza_certificada': { points: 10000, name: 'Fuerza Certificada', priority: 1 },
    'super_trajes': { points: 5000, name: 'Super Trajes', priority: 2 },
    'fantastico': { points: 1500, name: 'Fantástico', priority: 3 },
    'creador_reyes': { points: 850, name: 'Creador de Reyes', priority: 4 },
    'reaccion_faccion': { points: 800, name: 'Reacción de Facción', priority: 5 },
    'orden_capitan': { points: 750, name: 'Orden del Capitán', priority: 6 },
    'amenaza_triple': { points: 425, name: 'Amenaza Triple', priority: 7 },
    'doble_problema': { points: 325, name: 'Doble Problema', priority: 8 },
    'el_impar': { points: 300, name: 'El Impar', priority: 9 },
    'cuarto_escalon': { points: 275, name: 'Cuarto Escalón', priority: 10 },
    'duo_mortal': { points: 50, name: 'Dúo Mortal', priority: 11 },
    'lobos_solitarios': { points: 10, name: 'Lobos Solitarios', priority: 12 }
};

// Instancia global del estado del juego
const gameState = new GameState();
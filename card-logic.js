// card-logic.js - Lógica de evaluación de cartas
class CardLogic {
    static parseCard(value, suit) {
        if (!value || !suit) return null;
        
        let numValue;
        if (value === '*') {
            numValue = 14; // Por defecto como As alto
        } else {
            numValue = parseInt(value);
            if (isNaN(numValue) || numValue < 2 || numValue > 13) {
                return null;
            }
        }
        
        return { value: numValue, suit: suit, display: value, isAce: value === '*' };
    }
    
    static countSuits(cards) {
        const suitCounts = {};
        cards.forEach(card => {
            suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
        });
        return suitCounts;
    }
    
    static countValues(cards) {
        const valueCounts = {};
        cards.forEach(card => {
            valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
        });
        return valueCounts;
    }
    
    static isStraight(values) {
        const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
        
        if (uniqueValues.length !== 5) return false;
        
        // Verificar escalera normal
        let isNormalStraight = true;
        for (let i = 1; i < uniqueValues.length; i++) {
            if (uniqueValues[i] !== uniqueValues[i-1] + 1) {
                isNormalStraight = false;
                break;
            }
        }
        
        if (isNormalStraight) return true;
        
        // Verificar escalera con As bajo (*, 2, 3, 4, 5)
        const hasAce = values.includes(14);
        if (hasAce) {
            const aceAsOne = values.map(v => v === 14 ? 1 : v);
            const uniqueAceAsOne = [...new Set(aceAsOne)].sort((a, b) => a - b);
            
            if (uniqueAceAsOne.length === 5) {
                let isAceLowStraight = true;
                for (let i = 1; i < uniqueAceAsOne.length; i++) {
                    if (uniqueAceAsOne[i] !== uniqueAceAsOne[i-1] + 1) {
                        isAceLowStraight = false;
                        break;
                    }
                }
                if (isAceLowStraight) return true;
            }
        }
        
        return false;
    }
    
    static isRoyalStraight(values) {
        const sortedValues = [...values].sort((a, b) => a - b);
        return sortedValues.length === 5 && 
               sortedValues[0] === 10 && 
               sortedValues[1] === 11 && 
               sortedValues[2] === 12 && 
               sortedValues[3] === 13 && 
               sortedValues[4] === 14;
    }
    
    static hasFourConsecutive(values) {
        const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
        
        // Buscar 4 consecutivos
        for (let i = 0; i <= uniqueValues.length - 4; i++) {
            let consecutive = true;
            for (let j = 1; j < 4; j++) {
                if (uniqueValues[i + j] !== uniqueValues[i] + j) {
                    consecutive = false;
                    break;
                }
            }
            if (consecutive) return true;
        }
        
        // Verificar con As bajo
        const hasAce = values.includes(14);
        if (hasAce) {
            const aceAsOne = values.map(v => v === 14 ? 1 : v);
            const uniqueAceAsOne = [...new Set(aceAsOne)].sort((a, b) => a - b);
            
            for (let i = 0; i <= uniqueAceAsOne.length - 4; i++) {
                let consecutive = true;
                for (let j = 1; j < 4; j++) {
                    if (uniqueAceAsOne[i + j] !== uniqueAceAsOne[i] + j) {
                        consecutive = false;
                        break;
                    }
                }
                if (consecutive) return true;
            }
        }
        
        return false;
    }
    
    static evaluateHand(cards) {
        if (cards.length !== 5) return { type: 'lobos_solitarios', points: 10 };
        
        const values = cards.map(c => c.value);
        const suits = cards.map(c => c.suit);
        const suitCounts = this.countSuits(cards);
        const valueCounts = this.countValues(cards);
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        const suitCountValues = Object.values(suitCounts).sort((a, b) => b - a);
        
        const isAllSameSuit = suitCountValues[0] === 5;
        const isStraightHand = this.isStraight(values);
        const isRoyalStraightHand = this.isRoyalStraight(values);
        const hasFourConsecutiveCards = this.hasFourConsecutive(values);
        
        // 1. Fuerza Certificada: 10, 11, 12, 13, * de la misma facción
        if (isAllSameSuit && isRoyalStraightHand) {
            return { type: 'fuerza_certificada', points: 10000 };
        }
        
        // 2. Super Trajes: 5 de la misma facción con valores secuenciales
        if (isAllSameSuit && isStraightHand) {
            return { type: 'super_trajes', points: 5000 };
        }
        
        // 3. Fantástico: 4 del mismo valor + 1 de cualquier otro
        if (counts[0] === 4) {
            return { type: 'fantastico', points: 1500 };
        }
        
        // 4. Creador de Reyes: 3 del mismo valor + 2 de otro valor igual
        if (counts[0] === 3 && counts[1] === 2) {
            return { type: 'creador_reyes', points: 850 };
        }
        
        // 5. Reacción de Facción: 5 de la misma facción
        if (isAllSameSuit) {
            return { type: 'reaccion_faccion', points: 800 };
        }
        
        // 6. Orden del Capitán: 5 con valores secuenciales
        if (isStraightHand) {
            return { type: 'orden_capitan', points: 750 };
        }
        
        // 7. Amenaza Triple: 3 iguales + 2 diferentes no iguales
        if (counts[0] === 3 && counts[1] === 1 && counts[2] === 1) {
            return { type: 'amenaza_triple', points: 425 };
        }
        
        // 8. Doble Problema: 2 iguales + 2 iguales + 1 diferente
        if (counts[0] === 2 && counts[1] === 2 && counts[2] === 1) {
            return { type: 'doble_problema', points: 325 };
        }
        
        // 9. El Impar: 4 de la misma facción + 1 de otra facción
        if (suitCountValues[0] === 4 && suitCountValues[1] === 1) {
            return { type: 'el_impar', points: 300 };
        }
        
        // 10. Cuarto Escalón: 4 secuenciales + 1 no secuencial
        if (hasFourConsecutiveCards && !isStraightHand) {
            return { type: 'cuarto_escalon', points: 275 };
        }
        
        // 11. Dúo Mortal: 2 iguales + 3 diferentes
        if (counts[0] === 2 && counts[1] === 1 && counts[2] === 1 && counts[3] === 1) {
            return { type: 'duo_mortal', points: 50 };
        }
        
        // 12. Lobos Solitarios: Sin combinaciones especiales
        return { type: 'lobos_solitarios', points: 10 };
    }
    
    static analyzeHandPotential(cards) {
        const analysis = {
            currentEvaluation: this.evaluateHand(cards),
            improvements: [],
            patterns: {
                pairs: [],
                flushPotential: null,
                straightPotential: null,
                consecutiveCards: []
            }
        };
        
        if (cards.length < 5) return analysis;
        
        const values = cards.map(c => c.value);
        const suits = cards.map(c => c.suit);
        const suitCounts = this.countSuits(cards);
        const valueCounts = this.countValues(cards);
        
        // Analizar potencial de color
        Object.entries(suitCounts).forEach(([suit, count]) => {
            if (count >= 3) {
                analysis.patterns.flushPotential = {
                    suit: suit,
                    currentCount: count,
                    needed: 5 - count,
                    probability: this.calculateFlushProbability(count, gameState.getRemainingCards())
                };
            }
        });
        
        // Analizar potencial de escalera
        const sortedValues = [...new Set(values)].sort((a, b) => a - b);
        let maxConsecutive = 1;
        let currentConsecutive = 1;
        let consecutiveStart = sortedValues[0];
        
        for (let i = 1; i < sortedValues.length; i++) {
            if (sortedValues[i] === sortedValues[i-1] + 1) {
                currentConsecutive++;
                if (currentConsecutive > maxConsecutive) {
                    maxConsecutive = currentConsecutive;
                    consecutiveStart = sortedValues[i - currentConsecutive + 1];
                }
            } else {
                currentConsecutive = 1;
            }
        }
        
        if (maxConsecutive >= 3) {
            analysis.patterns.straightPotential = {
                consecutiveCount: maxConsecutive,
                startValue: consecutiveStart,
                needed: 5 - maxConsecutive,
                possibleCards: this.getStraightCompletionCards(sortedValues)
            };
        }
        
        // Analizar pares y tríos
        Object.entries(valueCounts).forEach(([value, count]) => {
            if (count >= 2) {
                analysis.patterns.pairs.push({
                    value: parseInt(value),
                    count: count,
                    improvementPotential: count < 4 ? (4 - count) : 0
                });
            }
        });
        
        return analysis;
    }
    
    static calculateFlushProbability(currentCount, remainingCards) {
        const needed = 5 - currentCount;
        const cardsOfSuit = 13 - currentCount; // Cartas restantes del palo
        
        if (needed === 1) {
            return Math.min(95, Math.round((cardsOfSuit / remainingCards) * 100));
        } else if (needed === 2) {
            return Math.min(80, Math.round((cardsOfSuit / remainingCards) * ((cardsOfSuit - 1) / (remainingCards - 1)) * 100));
        }
        
        return Math.min(50, Math.round((cardsOfSuit / remainingCards) * 100 / needed));
    }
    
    static getStraightCompletionCards(sortedValues) {
        const completionCards = [];
        const min = Math.min(...sortedValues);
        const max = Math.max(...sortedValues);
        
        // Cartas que completarían la escalera
        for (let i = min - 2; i <= max + 2; i++) {
            if (i >= 2 && i <= 14 && !sortedValues.includes(i)) {
                completionCards.push(i);
            }
        }
        
        return completionCards;
    }
}
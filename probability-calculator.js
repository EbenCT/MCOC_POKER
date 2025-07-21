// probability-calculator.js - Cálculos avanzados de probabilidades
class ProbabilityCalculator {
    static calculateSpecificCardProbability(targetValue, targetSuit, remainingCards) {
        // Probabilidad de sacar una carta específica
        return Math.round((1 / remainingCards) * 100);
    }
    
    static calculateMultipleCardProbabilities(targetCards, remainingCards, cardsToReplace) {
        // Probabilidad de sacar al menos una de varias cartas específicas
        const totalTargets = targetCards.length;
        const probability = 1 - Math.pow((remainingCards - totalTargets) / remainingCards, cardsToReplace);
        return Math.min(95, Math.round(probability * 100));
    }
    
    static analyzeDiscardOptions(currentHand, discardIndices) {
        const analysis = {
            discardedCards: [],
            keptCards: [],
            improvements: [],
            specificProbabilities: {}
        };
        
        // Separar cartas descartadas y mantenidas
        currentHand.forEach((card, index) => {
            if (discardIndices.includes(index)) {
                analysis.discardedCards.push(card);
            } else {
                analysis.keptCards.push(card);
            }
        });
        
        // Analizar cada posible mejora
        const cardsToReplace = analysis.discardedCards.length;
        const remainingCards = gameState.getRemainingCards();
        
        // 1. Analizar mejoras de color
        this.analyzeFlushImprovements(analysis, remainingCards, cardsToReplace);
        
        // 2. Analizar mejoras de escalera
        this.analyzeStraightImprovements(analysis, remainingCards, cardsToReplace);
        
        // 3. Analizar mejoras de pares/tríos
        this.analyzePairImprovements(analysis, remainingCards, cardsToReplace);
        
        // 4. Analizar mejoras específicas
        this.analyzeSpecificImprovements(analysis, remainingCards, cardsToReplace);
        
        return analysis;
    }
    
    static analyzeFlushImprovements(analysis, remainingCards, cardsToReplace) {
        const suitCounts = CardLogic.countSuits(analysis.keptCards);
        
        Object.entries(suitCounts).forEach(([suit, count]) => {
            const needed = 5 - count;
            
            if (needed <= cardsToReplace && needed > 0) {
                const availableInSuit = 13 - count; // Cartas restantes del palo
                const probability = this.calculateMultipleCardProbabilities(
                    Array(availableInSuit).fill(suit), 
                    remainingCards, 
                    cardsToReplace
                );
                
                let targetCombination = '';
                if (needed === cardsToReplace) {
                    // Verificar si sería escalera de color
                    const values = analysis.keptCards.filter(c => c.suit === suit).map(c => c.value);
                    if (CardLogic.isStraight([...values, ...Array(needed).fill(0)])) {
                        targetCombination = 'Super Trajes (5,000 pts)';
                    } else {
                        targetCombination = 'Reacción de Facción (800 pts)';
                    }
                } else {
                    targetCombination = 'El Impar (300 pts)';
                }
                
                analysis.improvements.push({
                    type: 'flush',
                    suit: suit,
                    needed: needed,
                    probability: probability,
                    targetCombination: targetCombination,
                    description: `Necesitas ${needed} carta(s) ${suit} para ${targetCombination}`,
                    priority: probability > 30 ? 'high' : probability > 15 ? 'medium' : 'low'
                });
            }
        });
    }
    
    static analyzeStraightImprovements(analysis, remainingCards, cardsToReplace) {
        const values = analysis.keptCards.map(c => c.value);
        const sortedValues = [...new Set(values)].sort((a, b) => a - b);
        
        // Buscar secuencias parciales
        for (let startVal = 2; startVal <= 10; startVal++) {
            const targetSequence = [startVal, startVal + 1, startVal + 2, startVal + 3, startVal + 4];
            const matchingCards = targetSequence.filter(val => sortedValues.includes(val));
            const needed = 5 - matchingCards.length;
            
            if (needed <= cardsToReplace && needed > 0 && matchingCards.length >= 2) {
                const missingCards = targetSequence.filter(val => !sortedValues.includes(val));
                const probability = this.calculateStraightProbability(missingCards, remainingCards, cardsToReplace);
                
                if (probability > 5) { // Solo mostrar si hay probabilidad razonable
                    analysis.improvements.push({
                        type: 'straight',
                        sequence: targetSequence,
                        needed: needed,
                        missingCards: missingCards,
                        probability: probability,
                        targetCombination: 'Orden del Capitán (750 pts)',
                        description: `Necesitas ${this.formatMissingCards(missingCards)} para escalera`,
                        priority: probability > 25 ? 'high' : probability > 10 ? 'medium' : 'low'
                    });
                }
            }
        }
        
        // Verificar escalera con As bajo
        const aceLowSequence = [1, 2, 3, 4, 5]; // As como 1
        const aceLowValues = values.map(v => v === 14 ? 1 : v);
        const matchingAceLow = aceLowSequence.filter(val => aceLowValues.includes(val));
        const neededAceLow = 5 - matchingAceLow.length;
        
        if (neededAceLow <= cardsToReplace && neededAceLow > 0 && matchingAceLow.length >= 2) {
            const missingAceLow = aceLowSequence.filter(val => !aceLowValues.includes(val));
            const probability = this.calculateStraightProbability(missingAceLow, remainingCards, cardsToReplace);
            
            if (probability > 5) {
                analysis.improvements.push({
                    type: 'straight_ace_low',
                    sequence: aceLowSequence,
                    needed: neededAceLow,
                    missingCards: missingAceLow.map(v => v === 1 ? '*' : v),
                    probability: probability,
                    targetCombination: 'Orden del Capitán (750 pts)',
                    description: `Necesitas ${this.formatMissingCards(missingAceLow.map(v => v === 1 ? '*' : v))} para escalera baja`,
                    priority: probability > 25 ? 'high' : probability > 10 ? 'medium' : 'low'
                });
            }
        }
    }
    
    static analyzePairImprovements(analysis, remainingCards, cardsToReplace) {
        const valueCounts = CardLogic.countValues(analysis.keptCards);
        
        Object.entries(valueCounts).forEach(([value, count]) => {
            const numValue = parseInt(value);
            const maxPossible = 4; // Máximo 4 cartas del mismo valor
            const needed = Math.min(maxPossible - count, cardsToReplace);
            
            if (needed > 0 && count >= 1) {
                const availableOfValue = maxPossible - count;
                const probability = this.calculateMultipleCardProbabilities(
                    Array(availableOfValue).fill(numValue),
                    remainingCards,
                    Math.min(needed, cardsToReplace)
                );
                
                let targetCombination = '';
                const finalCount = count + Math.min(needed, cardsToReplace);
                
                if (finalCount === 4) targetCombination = 'Fantástico (1,500 pts)';
                else if (finalCount === 3) targetCombination = 'Amenaza Triple (425 pts)';
                else if (finalCount === 2) targetCombination = 'Dúo Mortal (50 pts)';
                
                if (probability > 2) {
                    const displayValue = numValue === 14 ? '*' : numValue.toString();
                    analysis.improvements.push({
                        type: 'pair_improvement',
                        value: numValue,
                        currentCount: count,
                        needed: needed,
                        probability: probability,
                        targetCombination: targetCombination,
                        description: `Necesitas ${needed} carta(s) de valor ${displayValue} para ${targetCombination}`,
                        priority: probability > 20 ? 'high' : probability > 8 ? 'medium' : 'low'
                    });
                }
            }
        });
    }
    
    static analyzeSpecificImprovements(analysis, remainingCards, cardsToReplace) {
        // Analizar mejoras específicas como full house, four of a kind, etc.
        const valueCounts = CardLogic.countValues(analysis.keptCards);
        const pairs = Object.entries(valueCounts).filter(([_, count]) => count === 2);
        const trips = Object.entries(valueCounts).filter(([_, count]) => count === 3);
        
        // Si tienes una pareja, calcular probabilidad de full house
        if (pairs.length === 1 && cardsToReplace >= 2) {
            const pairValue = parseInt(pairs[0][0]);
            const otherValues = Object.keys(valueCounts).map(v => parseInt(v)).filter(v => v !== pairValue);
            
            // Probabilidad de conseguir trío con el valor de la pareja
            const tripProbability = this.calculateSpecificCardProbability(pairValue, null, remainingCards) * 2;
            
            if (tripProbability > 5) {
                analysis.improvements.push({
                    type: 'full_house',
                    pairValue: pairValue,
                    needed: 1,
                    probability: tripProbability,
                    targetCombination: 'Creador de Reyes (850 pts)',
                    description: `Si sacas otro ${pairValue === 14 ? '*' : pairValue}, obtienes Full House`,
                    priority: tripProbability > 15 ? 'high' : 'medium'
                });
            }
        }
        
        // Si tienes un trío, calcular probabilidad de poker
        if (trips.length === 1 && cardsToReplace >= 1) {
            const tripValue = parseInt(trips[0][0]);
            const pokerProbability = this.calculateSpecificCardProbability(tripValue, null, remainingCards);
            
            if (pokerProbability > 2) {
                analysis.improvements.push({
                    type: 'four_of_kind',
                    tripValue: tripValue,
                    needed: 1,
                    probability: pokerProbability,
                    targetCombination: 'Fantástico (1,500 pts)',
                    description: `Si sacas otro ${tripValue === 14 ? '*' : tripValue}, obtienes Poker`,
                    priority: 'high'
                });
            }
        }
    }
    
    static calculateStraightProbability(missingCards, remainingCards, cardsToReplace) {
        const totalMissingCards = missingCards.length * 4; // Cada valor tiene 4 palos
        return this.calculateMultipleCardProbabilities(
            Array(totalMissingCards).fill('any'),
            remainingCards,
            cardsToReplace
        );
    }
    
    static formatMissingCards(cards) {
        return cards.map(card => card === 14 ? '*' : card.toString()).join(', ');
    }
    
    static getBestDiscardStrategy(currentHand) {
        const strategies = [];
        
        // Evaluar todas las combinaciones posibles de descarte
        for (let mask = 1; mask < (1 << 5); mask++) {
            const discardIndices = [];
            for (let i = 0; i < 5; i++) {
                if (mask & (1 << i)) {
                    discardIndices.push(i);
                }
            }
            
            if (discardIndices.length > 0 && discardIndices.length <= 4) {
                const analysis = this.analyzeDiscardOptions(currentHand, discardIndices);
                const score = this.calculateStrategyScore(analysis);
                
                strategies.push({
                    discardIndices: discardIndices,
                    analysis: analysis,
                    score: score,
                    description: this.generateStrategyDescription(analysis, discardIndices, currentHand)
                });
            }
        }
        
        // Ordenar por puntuación y devolver las mejores
        return strategies.sort((a, b) => b.score - a.score).slice(0, 3);
    }
    
    static calculateStrategyScore(analysis) {
        let score = 0;
        
        analysis.improvements.forEach(improvement => {
            let weight = 1;
            if (improvement.priority === 'high') weight = 3;
            else if (improvement.priority === 'medium') weight = 2;
            
            // Ponderar por puntos potenciales
            const pointsWeight = this.getPointsWeight(improvement.targetCombination);
            score += improvement.probability * weight * pointsWeight;
        });
        
        return score;
    }
    
    static getPointsWeight(combination) {
        if (combination.includes('10,000')) return 10;
        if (combination.includes('5,000')) return 8;
        if (combination.includes('1,500')) return 6;
        if (combination.includes('850')) return 4;
        if (combination.includes('800')) return 3.5;
        if (combination.includes('750')) return 3;
        if (combination.includes('425')) return 2;
        if (combination.includes('325')) return 1.5;
        if (combination.includes('300')) return 1.3;
        if (combination.includes('275')) return 1.2;
        if (combination.includes('50')) return 0.5;
        return 0.1;
    }
    
    static generateStrategyDescription(analysis, discardIndices, currentHand) {
        const discardedCards = discardIndices.map(i => {
            const card = currentHand[i];
            return `${card.display}${card.suit}`;
        });
        
        const topImprovement = analysis.improvements
            .sort((a, b) => b.probability - a.probability)[0];
        
        if (topImprovement) {
            return `Descarta ${discardedCards.join(', ')} → ${topImprovement.description} (${topImprovement.probability}%)`;
        }
        
        return `Descarta ${discardedCards.join(', ')} → Mejora general`;
    }
}
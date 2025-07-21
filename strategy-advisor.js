// strategy-advisor.js - Sistema avanzado de consejos estratégicos
class StrategyAdvisor {
    static generateAdvancedAdvice(currentHand, evaluation, discardedIndices) {
        const currentRound = gameState.currentRound;
        const strategies = ProbabilityCalculator.getBestDiscardStrategy(currentHand);
        
        // Determinar estrategia según puntuación actual
        const advice = {
            decision: this.getDecisionRecommendation(evaluation, currentRound),
            specificStrategies: strategies,
            detailedAnalysis: this.generateDetailedAnalysis(currentHand, evaluation),
            riskAssessment: this.assessRisk(evaluation, currentRound),
            alternativeOptions: this.getAlternativeOptions(evaluation, currentRound)
        };
        
        return this.formatAdviceMessage(advice, evaluation, currentRound);
    }
    
    static getDecisionRecommendation(evaluation, currentRound) {
        const points = evaluation.points;
        
        if (points >= 5000) {
            return {
                action: 'RETIRARSE',
                confidence: 'EXTREMA',
                reason: 'Puntuación excepcional, riesgo innecesario continuar'
            };
        }
        
        if (points >= 1500) {
            return {
                action: 'RETIRARSE',
                confidence: 'ALTA',
                reason: 'Excelente puntuación, muy difícil de mejorar significativamente'
            };
        }
        
        if (points >= 800) {
            if (currentRound === 1) {
                return {
                    action: 'CONSIDERAR_CONTINUAR',
                    confidence: 'MEDIA',
                    reason: 'Buena puntuación pero aún hay 2 rondas para mejorar'
                };
            } else {
                return {
                    action: 'RETIRARSE',
                    confidence: 'ALTA',
                    reason: 'Buena puntuación y pocas rondas restantes'
                };
            }
        }
        
        if (points >= 300) {
            return {
                action: 'EVALUAR_PROBABILIDADES',
                confidence: 'MEDIA',
                reason: 'Puntuación decente, evaluar mejoras específicas'
            };
        }
        
        if (points >= 50) {
            return {
                action: 'CONTINUAR_CONSERVADOR',
                confidence: 'BAJA',
                reason: 'Puntuación mínima, intentar mejorar con riesgo controlado'
            };
        }
        
        return {
            action: 'CONTINUAR_AGRESIVO',
            confidence: 'BAJA',
            reason: 'Sin puntuación, necesario tomar riesgos'
        };
    }
    
    static generateDetailedAnalysis(currentHand, evaluation) {
        const analysis = CardLogic.analyzeHandPotential(currentHand);
        const detailedInfo = {
            currentStrength: this.analyzeCurrentStrength(currentHand, evaluation),
            improvementPaths: this.identifyImprovementPaths(analysis),
            specificOpportunities: this.findSpecificOpportunities(currentHand),
            optimalDiscards: this.recommendOptimalDiscards(currentHand)
        };
        
        return detailedInfo;
    }
    
    static analyzeCurrentStrength(currentHand, evaluation) {
        const suitCounts = CardLogic.countSuits(currentHand);
        const valueCounts = CardLogic.countValues(currentHand);
        
        const strengths = [];
        const weaknesses = [];
        
        // Analizar fortalezas
        Object.entries(suitCounts).forEach(([suit, count]) => {
            if (count >= 4) {
                strengths.push(`4 cartas ${suit} - muy cerca de color`);
            } else if (count >= 3) {
                strengths.push(`3 cartas ${suit} - base para color`);
            }
        });
        
        Object.entries(valueCounts).forEach(([value, count]) => {
            const displayValue = value == 14 ? '*' : value;
            if (count >= 3) {
                strengths.push(`Trío de ${displayValue} - base sólida`);
            } else if (count >= 2) {
                strengths.push(`Pareja de ${displayValue} - potencial mejora`);
            }
        });
        
        // Analizar secuencias
        const values = currentHand.map(c => c.value);
        const sortedValues = [...new Set(values)].sort((a, b) => a - b);
        let consecutiveCount = 1;
        let maxConsecutive = 1;
        
        for (let i = 1; i < sortedValues.length; i++) {
            if (sortedValues[i] === sortedValues[i-1] + 1) {
                consecutiveCount++;
                maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
            } else {
                consecutiveCount = 1;
            }
        }
        
        if (maxConsecutive >= 3) {
            strengths.push(`${maxConsecutive} cartas consecutivas - base para escalera`);
        }
        
        // Analizar debilidades
        if (strengths.length === 0) {
            weaknesses.push('Sin patrones evidentes - mano muy dispersa');
        }
        
        const uniqueSuits = Object.keys(suitCounts).length;
        if (uniqueSuits === 5) {
            weaknesses.push('Todas las cartas de palos diferentes - sin potencial de color');
        }
        
        return { strengths, weaknesses };
    }
    
    static identifyImprovementPaths(analysis) {
        const paths = [];
        
        // Caminos hacia color
        if (analysis.patterns.flushPotential) {
            const fp = analysis.patterns.flushPotential;
            paths.push({
                type: 'color',
                description: `Tienes ${fp.currentCount} cartas ${fp.suit}`,
                action: `Descarta cartas de otros palos y busca ${fp.needed} carta(s) ${fp.suit}`,
                probability: fp.probability,
                targetPoints: fp.currentCount === 4 ? 800 : 300
            });
        }
        
        // Caminos hacia escalera
        if (analysis.patterns.straightPotential) {
            const sp = analysis.patterns.straightPotential;
            paths.push({
                type: 'escalera',
                description: `Tienes ${sp.consecutiveCount} cartas consecutivas`,
                action: `Busca las cartas: ${sp.possibleCards.map(c => c === 14 ? '*' : c).join(', ')}`,
                probability: this.calculateStraightCompletionProbability(sp),
                targetPoints: 750
            });
        }
        
        // Caminos hacia múltiples
        analysis.patterns.pairs.forEach(pair => {
            if (pair.count === 2) {
                paths.push({
                    type: 'mejora_pareja',
                    description: `Tienes pareja de ${pair.value === 14 ? '*' : pair.value}`,
                    action: `Busca otra carta de valor ${pair.value === 14 ? '*' : pair.value} para trío`,
                    probability: this.calculatePairImprovementProbability(pair.value),
                    targetPoints: 425
                });
            }
        });
        
        return paths.sort((a, b) => (b.probability * b.targetPoints) - (a.probability * a.targetPoints));
    }
    
    static findSpecificOpportunities(currentHand) {
        const opportunities = [];
        const values = currentHand.map(c => c.value);
        const suits = currentHand.map(c => c.suit);
        
        // Oportunidades específicas de escalera real
        const royalCards = [10, 11, 12, 13, 14];
        const royalInHand = royalCards.filter(v => values.includes(v));
        
        if (royalInHand.length >= 3) {
            const sameSuitRoyal = suits.some(suit => {
                const cardsInSuit = currentHand.filter(c => c.suit === suit && royalCards.includes(c.value));
                return cardsInSuit.length >= 3;
            });
            
            if (sameSuitRoyal) {
                opportunities.push({
                    type: 'royal_flush',
                    description: 'Potencial escalera real detectado',
                    action: 'Mantén las cartas altas del mismo palo, descarta el resto',
                    targetPoints: 10000,
                    priority: 'MÁXIMA'
                });
            }
        }
        
        // Oportunidades de full house
        const valueCounts = CardLogic.countValues(currentHand);
        const pairs = Object.entries(valueCounts).filter(([_, count]) => count === 2);
        const trips = Object.entries(valueCounts).filter(([_, count]) => count === 3);
        
        if (pairs.length === 2) {
            opportunities.push({
                type: 'full_house',
                description: 'Dos parejas - oportunidad de full house',
                action: 'Descarta la quinta carta y busca completar cualquier trío',
                targetPoints: 850,
                priority: 'ALTA'
            });
        }
        
        if (trips.length === 1 && pairs.length === 0) {
            opportunities.push({
                type: 'full_house_from_trip',
                description: 'Trío presente - buscar pareja para full house',
                action: 'Mantén el trío, busca formar pareja con las cartas restantes',
                targetPoints: 850,
                priority: 'ALTA'
            });
        }
        
        return opportunities.sort((a, b) => b.targetPoints - a.targetPoints);
    }
    
    static recommendOptimalDiscards(currentHand) {
        const strategies = ProbabilityCalculator.getBestDiscardStrategy(currentHand);
        
        return strategies.map((strategy, index) => ({
            rank: index + 1,
            description: strategy.description,
            expectedValue: strategy.score,
            confidence: strategy.score > 100 ? 'ALTA' : strategy.score > 50 ? 'MEDIA' : 'BAJA',
            details: strategy.analysis.improvements.map(imp => ({
                improvement: imp.description,
                probability: imp.probability,
                points: imp.targetCombination
            }))
        }));
    }
    
    static assessRisk(evaluation, currentRound) {
        const points = evaluation.points;
        const roundsLeft = 3 - currentRound;
        
        let riskLevel = 'BAJO';
        let riskFactors = [];
        let mitigationSuggestions = [];
        
        if (points >= 800) {
            riskLevel = 'ALTO';
            riskFactors.push('Tienes una puntuación alta que podrías perder');
            mitigationSuggestions.push('Considera retirarte para asegurar la ganancia');
        }
        
        if (roundsLeft <= 1) {
            riskLevel = riskLevel === 'ALTO' ? 'EXTREMO' : 'ALTO';
            riskFactors.push('Última oportunidad de cambio');
            mitigationSuggestions.push('Sé muy conservador con los descartes');
        }
        
        if (points <= 50) {
            riskLevel = 'JUSTIFICADO';
            riskFactors.push('Puntuación muy baja, necesitas tomar riesgos');
            mitigationSuggestions.push('Descarte agresivo puede ser la única opción');
        }
        
        return {
            level: riskLevel,
            factors: riskFactors,
            mitigation: mitigationSuggestions
        };
    }
    
    static getAlternativeOptions(evaluation, currentRound) {
        const options = [];
        
        options.push({
            option: 'Retirarse ahora',
            pros: [`Aseguras ${evaluation.points} puntos`, 'Sin riesgo de pérdida'],
            cons: ['No hay oportunidad de mejora', 'Posible arrepentimiento'],
            recommendation: evaluation.points >= 500 ? 'RECOMENDADO' : 'NO RECOMENDADO'
        });
        
        if (currentRound < 3) {
            options.push({
                option: 'Descarte conservador (1-2 cartas)',
                pros: ['Riesgo controlado', 'Mantiene base actual', 'Aún quedan rondas'],
                cons: ['Mejora limitada', 'Puede no ser suficiente'],
                recommendation: evaluation.points >= 300 ? 'RECOMENDADO' : 'NEUTRAL'
            });
            
            options.push({
                option: 'Descarte agresivo (3-4 cartas)',
                pros: ['Mayor potencial de mejora', 'Oportunidad de gran cambio'],
                cons: ['Alto riesgo', 'Posible pérdida total'],
                recommendation: evaluation.points <= 100 ? 'CONSIDERARLO' : 'NO RECOMENDADO'
            });
        }
        
        return options;
    }
    
    static formatAdviceMessage(advice, evaluation, currentRound) {
        let message = `🎯 **ANÁLISIS ESTRATÉGICO - RONDA ${currentRound}/3**\n\n`;
        
        // Decisión principal
        message += `🔥 **RECOMENDACIÓN PRINCIPAL:**\n`;
        message += `${advice.decision.action} (Confianza: ${advice.decision.confidence})\n`;
        message += `*${advice.decision.reason}*\n\n`;
        
        // Mejores estrategias específicas
        if (advice.specificStrategies.length > 0) {
            message += `⚡ **MEJORES ESTRATEGIAS:**\n`;
            advice.specificStrategies.slice(0, 2).forEach((strategy, index) => {
                message += `${index + 1}. ${strategy.description}\n`;
            });
            message += `\n`;
        }
        
        // Análisis de fortalezas
        if (advice.detailedAnalysis.currentStrength.strengths.length > 0) {
            message += `💪 **FORTALEZAS ACTUALES:**\n`;
            advice.detailedAnalysis.currentStrength.strengths.forEach(strength => {
                message += `• ${strength}\n`;
            });
            message += `\n`;
        }
        
        // Oportunidades específicas
        if (advice.detailedAnalysis.specificOpportunities.length > 0) {
            message += `🎲 **OPORTUNIDADES DETECTADAS:**\n`;
            advice.detailedAnalysis.specificOpportunities.slice(0, 2).forEach(opp => {
                message += `• ${opp.description} → ${opp.action} (${opp.targetPoints} pts)\n`;
            });
            message += `\n`;
        }
        
        // Evaluación de riesgo
        message += `⚠️ **EVALUACIÓN DE RIESGO:** ${advice.riskAssessment.level}\n`;
        if (advice.riskAssessment.factors.length > 0) {
            message += `Factores: ${advice.riskAssessment.factors.join(', ')}\n`;
        }
        
        return message;
    }
    
    static calculateStraightCompletionProbability(straightPotential) {
        const needed = straightPotential.needed;
        const availableCards = straightPotential.possibleCards.length * 4;
        const remainingCards = gameState.getRemainingCards();
        
        return Math.min(85, Math.round((availableCards / remainingCards) * 100 * (1 / needed)));
    }
    
    static calculatePairImprovementProbability(value) {
        const remainingOfValue = 4 - 2; // Ya tienes 2, quedan 2
        const remainingCards = gameState.getRemainingCards();
        
        return Math.round((remainingOfValue / remainingCards) * 100);
    }
}
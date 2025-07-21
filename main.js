// main.js - Controlador principal del juego
class GameController {
    static analyzeHand() {
        const currentCards = UIController.getCurrentHand();
        
        if (currentCards.length === 0) {
            UIController.updateAdviceDisplay('⚠️ Introduce al menos algunas cartas para comenzar el análisis estratégico.');
            UIController.resetDisplay();
            return;
        }
        
        // Evaluar mano actual
        const evaluation = CardLogic.evaluateHand(currentCards);
        
        // Obtener índices de cartas marcadas para descarte
        const discardedIndices = UIController.getDiscardedIndices();
        
        // Calcular estrategias avanzadas
        const strategies = ProbabilityCalculator.getBestDiscardStrategy(currentCards);
        
        // Generar consejos estratégicos detallados
        const advancedAdvice = StrategyAdvisor.generateAdvancedAdvice(
            currentCards, 
            evaluation, 
            discardedIndices
        );
        
        // Registrar análisis en estadísticas si es experto
        if (GameConfig.getSetting('expertMode')) {
            gameStats.recordDecision(
                strategies[0]?.description || 'No strategy',
                'ANALYZE',
                { analyzed: true }
            );
        }
        
        // Actualizar interfaz
        UIController.updateCurrentHandDisplay(evaluation);
        
        // Generar probabilidades simplificadas para mostrar
        const simplifiedProbs = UIController.generateSimplifiedProbabilities(strategies);
        UIController.updateProbabilitiesDisplay(simplifiedProbs);
        
        // Mostrar consejos avanzados
        UIController.updateAdviceDisplay(advancedAdvice);
        
        // Actualizar visuales
        UIController.updateDiscardedCardsVisual();
        
        // Debug detallado (solo si está habilitado)
        if (GameConfig.getSetting('showDebugInfo')) {
            UIController.showDebugInfo(currentCards, evaluation, strategies);
        }
        
        // Agregar cartas usadas al estado del juego
        currentCards.forEach(card => {
            gameState.addUsedCard(card);
        });
    }
    
    static nextRound() {
        if (!gameState.canContinue()) {
            alert('¡Has completado las 3 rondas! Evalúa tu mano final y decide si retirarte.');
            return;
        }
        
        const discardedIndices = UIController.getDiscardedIndices();
        
        if (discardedIndices.length === 0) {
            alert('Debes seleccionar al menos una carta para descartar antes de continuar a la siguiente ronda.');
            return;
        }
        
        // Confirmar descarte
        const currentCards = UIController.getCurrentHand();
        const discardedCards = discardedIndices.map(i => currentCards[i]);
        const evaluation = CardLogic.evaluateHand(currentCards);
        
        // Registrar ronda en estadísticas
        gameStats.recordRound(
            gameState.currentRound,
            currentCards,
            evaluation,
            discardedCards,
            'manual_discard'
        );
        
        const discardedDescriptions = discardedCards.map(card => `${card.display}${card.suit}`);
        
        const confirmMessage = `¿Confirmas descartar: ${discardedDescriptions.join(', ')}?\n\nRonda ${gameState.currentRound} → ${gameState.currentRound + 1}`;
        
        if (!confirm(confirmMessage)) {
            return;
        }
        
        // Registrar decisión
        gameStats.recordDecision('CONTINUE', 'CONTINUE', { roundAdvanced: true });
        
        // Avanzar estado del juego
        gameState.nextRound(discardedIndices.length);
        
        // Limpiar cartas descartadas
        UIController.clearCards(true);
        
        // Actualizar display
        UIController.updateRoundDisplay();
        
        // Resetear análisis
        UIController.resetDisplay();
        
        // Mostrar mensaje de nueva ronda
        const newRoundMessage = gameState.currentRound === gameState.maxRounds 
            ? '🏁 ¡RONDA FINAL! Esta es tu última oportunidad de mejora.' 
            : `🎯 Ronda ${gameState.currentRound} iniciada. Introduce tus nuevas cartas.`;
            
        UIController.updateAdviceDisplay(newRoundMessage);
        
        console.log(`🎮 Ronda ${gameState.currentRound} iniciada. Cartas restantes en mazo: ${gameState.getRemainingCards()}`);
    }
    
    static cashOut() {
        const currentCards = UIController.getCurrentHand();
        
        if (currentCards.length < 5) {
            alert('Debes tener 5 cartas completas para retirarte.');
            return;
        }
        
        const evaluation = CardLogic.evaluateHand(currentCards);
        const finalScore = evaluation.points;
        
        // Análisis final
        const analysis = CardLogic.analyzeHandPotential(currentCards);
        const strategies = ProbabilityCalculator.getBestDiscardStrategy(currentCards);
        
        let potentialMessage = '';
        if (strategies.length > 0 && gameState.canContinue()) {
            const bestStrategy = strategies[0];
            potentialMessage = `\n\n💡 Potencial no explorado:\n${bestStrategy.description}`;
        }
        
        const confirmText = `🎊 RETIRARSE CON MANO FINAL\n\n` +
                          `🏆 Combinación: ${handRankings[evaluation.type].name}\n` +
                          `💰 Puntos Finales: ${finalScore}\n` +
                          `🎮 Ronda: ${gameState.currentRound}/${gameState.maxRounds}` +
                          potentialMessage +
                          `\n\n¿Confirmas retirarte con estos puntos?`;
        
        if (confirm(confirmText)) {
            // Calcular bonificaciones
            let bonus = 0;
            if (GameConfig.getSetting('enableBonuses')) {
                if (gameState.currentRound === 1) {
                    bonus += Math.round(finalScore * GameConfig.getSetting('earlyRetirementBonus'));
                }
                if (finalScore >= 1000) {
                    bonus += GameConfig.getSetting('highScoreBonus');
                }
            }
            
            const totalScore = finalScore + bonus;
            
            // Registrar juego completado
            gameStats.recordGameEnd(totalScore, evaluation.type, 'cashout');
            
            const finalMessage = `🎉 ¡JUEGO COMPLETADO!\n\n` +
                                `🏆 Puntuación Base: ${finalScore} pts\n` +
                                `🎁 Bonificaciones: ${bonus} pts\n` +
                                `💎 PUNTUACIÓN FINAL: ${totalScore} pts\n\n` +
                                `📊 Rendimiento: ${this.getPerformanceRating(totalScore)}`;
                                
            alert(finalMessage);
            
            this.resetGame();
        }
    }
    
    static resetGame() {
        // Finalizar juego anterior si existe
        if (gameStats.currentGame) {
            const currentCards = UIController.getCurrentHand();
            if (currentCards.length === 5) {
                const evaluation = CardLogic.evaluateHand(currentCards);
                gameStats.recordGameEnd(evaluation.points, evaluation.type, 'reset');
            }
        }
        
        // Resetear estado del juego
        gameState.reset();
        
        // Limpiar interfaz
        UIController.clearCards(false);
        UIController.resetDisplay();
        
        // Resetear botones
        const nextButton = document.querySelector('.btn-secondary');
        nextButton.textContent = '➡️ Siguiente Ronda';
        nextButton.disabled = false;
        
        // Iniciar nuevo juego en estadísticas
        gameStats.recordGameStart();
        
        console.log('🎮 Juego reiniciado. ¡Nuevo juego iniciado!');
    }
    
    static getPerformanceRating(score) {
        if (score >= 8000) return '🏆 LEGENDARIO - ¡Increíble estrategia!';
        if (score >= 5000) return '💎 EXCELENTE - Muy bien jugado';
        if (score >= 2000) return '⭐ MUY BUENO - Buen trabajo';
        if (score >= 1000) return '👍 BUENO - Estrategia sólida';
        if (score >= 500) return '📈 REGULAR - Puedes mejorar';
        if (score >= 100) return '📚 APRENDIZ - Sigue practicando';
        return '🎯 NOVATO - ¡La práctica hace al maestro!';
    }
    
    static showHelp() {
        const helpMessage = `🎓 GUÍA ESTRATÉGICA AVANZADA\n\n` +
                          `🎯 OBJETIVO: Maximizar puntos en máximo 3 rondas\n\n` +
                          `🎮 MECÁNICAS:\n` +
                          `• Cada ronda puedes descartar cartas\n` +
                          `• Análisis automático de probabilidades\n` +
                          `• Consejos específicos por carta\n` +
                          `• Puedes retirarte en cualquier momento\n\n` +
                          `🏆 ESTRATEGIAS CLAVE:\n` +
                          `• Busca patrones (colores, escaleras)\n` +
                          `• Evalúa riesgo vs recompensa\n` +
                          `• Usa el As (*) estratégicamente\n` +
                          `• Retírate con ganancias altas\n\n` +
                          `📊 EL SISTEMA TE DIRÁ:\n` +
                          `• Qué cartas descartar exactamente\n` +
                          `• Probabilidades específicas\n` +
                          `• Mejores oportunidades detectadas\n` +
                          `• Evaluación de riesgo personalizada`;
                          
        alert(helpMessage);
    }
    
    static init() {
        // Configurar event listeners
        UIController.addEventListeners();
        
        // Inicializar interfaz mejorada
        EnhancedUI.init();
        
        // Aplicar configuración inicial
        EnhancedUI.applyTheme(GameConfig.getSetting('theme'));
        
        // Configurar botones principales
        window.analyzeHand = () => this.analyzeHand();
        window.nextRound = () => this.nextRound();
        window.cashOut = () => this.cashOut();
        window.resetGame = () => this.resetGame();
        window.showHelp = () => this.showHelp();
        
        // Inicializar estado
        this.resetGame();
        
        // Registrar inicio de sesión en estadísticas
        gameStats.recordGameStart();
        
        console.log('🎮 Sistema de Poker Estratégico Avanzado inicializado');
        console.log('💡 Funcionalidades disponibles:');
        console.log('  - Análisis específico por carta con probabilidades exactas');
        console.log('  - Sistema de estadísticas y logros');
        console.log('  - Configuración personalizable');
        console.log('  - Tutorial interactivo');
        console.log('  - Múltiples temas visuales');
        console.log('📊 Usa Ctrl+S para estadísticas, Ctrl+H para tutorial');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    GameController.init();
});
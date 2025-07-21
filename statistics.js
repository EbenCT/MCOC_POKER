// statistics.js - Sistema de estadísticas y análisis de rendimiento
class Statistics {
    constructor() {
        this.currentSession = {
            gamesPlayed: 0,
            totalScore: 0,
            highestScore: 0,
            averageScore: 0,
            combinationsAchieved: {},
            roundsPlayed: 0,
            decisionsCorrect: 0,
            decisionsTotal: 0,
            startTime: Date.now()
        };
        
        this.allTimeStats = this.loadAllTimeStats();
        this.gameHistory = this.loadGameHistory();
        this.achievements = this.loadAchievements();
    }
    
    recordGameStart() {
        this.currentSession.gamesPlayed++;
        this.currentGame = {
            startTime: Date.now(),
            rounds: [],
            finalScore: 0,
            combination: 'lobos_solitarios',
            decisions: [],
            strategies: []
        };
    }
    
    recordRound(round, hand, evaluation, discardedCards, strategy) {
        if (!this.currentGame) return;
        
        const roundData = {
            round: round,
            hand: hand.map(c => ({ value: c.value, suit: c.suit, display: c.display })),
            evaluation: evaluation,
            discarded: discardedCards.map(c => ({ value: c.value, suit: c.suit, display: c.display })),
            strategy: strategy,
            timestamp: Date.now()
        };
        
        this.currentGame.rounds.push(roundData);
        this.currentSession.roundsPlayed++;
    }
    
    recordDecision(recommendedAction, actualAction, outcome) {
        if (!this.currentGame) return;
        
        const decision = {
            recommended: recommendedAction,
            actual: actualAction,
            outcome: outcome,
            timestamp: Date.now()
        };
        
        this.currentGame.decisions.push(decision);
        this.currentSession.decisionsTotal++;
        
        // Evaluar si la decisión fue correcta
        if (this.isDecisionCorrect(recommendedAction, actualAction, outcome)) {
            this.currentSession.decisionsCorrect++;
        }
    }
    
    recordGameEnd(finalScore, combination, reason) {
        if (!this.currentGame) return;
        
        this.currentGame.finalScore = finalScore;
        this.currentGame.combination = combination;
        this.currentGame.endTime = Date.now();
        this.currentGame.duration = this.currentGame.endTime - this.currentGame.startTime;
        this.currentGame.endReason = reason; // 'cashout', 'completed', 'reset'
        
        // Actualizar estadísticas de sesión
        this.currentSession.totalScore += finalScore;
        this.currentSession.highestScore = Math.max(this.currentSession.highestScore, finalScore);
        this.currentSession.averageScore = this.currentSession.totalScore / this.currentSession.gamesPlayed;
        
        // Registrar combinación lograda
        if (!this.currentSession.combinationsAchieved[combination]) {
            this.currentSession.combinationsAchieved[combination] = 0;
        }
        this.currentSession.combinationsAchieved[combination]++;
        
        // Guardar en historial
        this.gameHistory.push({ ...this.currentGame });
        
        // Actualizar estadísticas de todos los tiempos
        this.updateAllTimeStats();
        
        // Verificar logros
        this.checkAchievements();
        
        // Guardar en localStorage
        this.saveStats();
        
        this.currentGame = null;
    }
    
    updateAllTimeStats() {
        this.allTimeStats.gamesPlayed++;
        this.allTimeStats.totalScore += this.currentGame.finalScore;
        this.allTimeStats.highestScore = Math.max(this.allTimeStats.highestScore, this.currentGame.finalScore);
        this.allTimeStats.averageScore = this.allTimeStats.totalScore / this.allTimeStats.gamesPlayed;
        
        // Actualizar combinaciones de todos los tiempos
        const combination = this.currentGame.combination;
        if (!this.allTimeStats.combinationsAchieved[combination]) {
            this.allTimeStats.combinationsAchieved[combination] = 0;
        }
        this.allTimeStats.combinationsAchieved[combination]++;
        
        // Actualizar estadísticas avanzadas
        this.allTimeStats.totalPlayTime += this.currentGame.duration;
        this.allTimeStats.averageGameTime = this.allTimeStats.totalPlayTime / this.allTimeStats.gamesPlayed;
        
        const decisionAccuracy = this.currentGame.decisions.length > 0 
            ? this.currentGame.decisions.filter(d => this.isDecisionCorrect(d.recommended, d.actual, d.outcome)).length / this.currentGame.decisions.length
            : 0;
        
        this.allTimeStats.totalDecisionAccuracy = 
            (this.allTimeStats.totalDecisionAccuracy * (this.allTimeStats.gamesPlayed - 1) + decisionAccuracy) / this.allTimeStats.gamesPlayed;
    }
    
    isDecisionCorrect(recommended, actual, outcome) {
        // Lógica simplificada para evaluar decisiones
        if (recommended === 'RETIRARSE' && actual === 'RETIRARSE') return true;
        if (recommended === 'CONTINUAR_AGRESIVO' && actual === 'CONTINUAR' && outcome.improved) return true;
        if (recommended === 'CONTINUAR_CONSERVADOR' && actual === 'CONTINUAR' && !outcome.worsened) return true;
        return false;
    }
    
    checkAchievements() {
        const newAchievements = [];
        
        // Logros por puntuación
        if (this.currentGame.finalScore >= 10000 && !this.achievements.includes('legendary_hand')) {
            newAchievements.push({
                id: 'legendary_hand',
                name: '🏆 Mano Legendaria',
                description: 'Conseguiste Fuerza Certificada (10,000 pts)',
                rarity: 'legendary'
            });
        }
        
        if (this.currentGame.finalScore >= 5000 && !this.achievements.includes('epic_achievement')) {
            newAchievements.push({
                id: 'epic_achievement',
                name: '💎 Logro Épico',
                description: 'Conseguiste 5,000+ puntos',
                rarity: 'epic'
            });
        }
        
        // Logros por juegos jugados
        if (this.allTimeStats.gamesPlayed === 10 && !this.achievements.includes('veteran_player')) {
            newAchievements.push({
                id: 'veteran_player',
                name: '🎮 Jugador Veterano',
                description: 'Completaste 10 juegos',
                rarity: 'common'
            });
        }
        
        if (this.allTimeStats.gamesPlayed === 50 && !this.achievements.includes('master_player')) {
            newAchievements.push({
                id: 'master_player',
                name: '👑 Maestro del Juego',
                description: 'Completaste 50 juegos',
                rarity: 'rare'
            });
        }
        
        // Logros por precisión de decisiones
        if (this.allTimeStats.totalDecisionAccuracy >= 0.8 && this.allTimeStats.gamesPlayed >= 5 && !this.achievements.includes('strategic_mind')) {
            newAchievements.push({
                id: 'strategic_mind',
                name: '🧠 Mente Estratégica',
                description: 'Mantén 80%+ de decisiones correctas',
                rarity: 'rare'
            });
        }
        
        // Logros por combinaciones específicas
        Object.keys(GameConfig.combinations).forEach(combo => {
            const achievementId = `combo_${combo}`;
            if (this.currentGame.combination === combo && !this.achievements.includes(achievementId)) {
                newAchievements.push({
                    id: achievementId,
                    name: `🃏 ${GameConfig.combinations[combo].name}`,
                    description: `Conseguiste ${GameConfig.combinations[combo].name}`,
                    rarity: GameConfig.combinations[combo].rarity || 'common'
                });
            }
        });
        
        // Agregar nuevos logros
        newAchievements.forEach(achievement => {
            this.achievements.push(achievement.id);
            this.showAchievementNotification(achievement);
        });
    }
    
    showAchievementNotification(achievement) {
        // Crear notificación visual del logro
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                <span class="achievement-rarity ${achievement.rarity}">${achievement.rarity.toUpperCase()}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);
    }
    
    getSessionSummary() {
        const sessionDuration = (Date.now() - this.currentSession.startTime) / 1000 / 60; // minutos
        
        return {
            duration: Math.round(sessionDuration),
            gamesPlayed: this.currentSession.gamesPlayed,
            averageScore: Math.round(this.currentSession.averageScore),
            highestScore: this.currentSession.highestScore,
            decisionAccuracy: this.currentSession.decisionsTotal > 0 
                ? Math.round((this.currentSession.decisionsCorrect / this.currentSession.decisionsTotal) * 100)
                : 0,
            favoriteStrategy: this.getFavoriteStrategy(),
            improvement: this.getImprovementTrend()
        };
    }
    
    getAllTimeStats() {
        return {
            ...this.allTimeStats,
            decisionAccuracy: Math.round(this.allTimeStats.totalDecisionAccuracy * 100),
            averageGameTimeMinutes: Math.round(this.allTimeStats.averageGameTime / 1000 / 60),
            totalPlayTimeHours: Math.round(this.allTimeStats.totalPlayTime / 1000 / 60 / 60 * 10) / 10
        };
    }
    
    getFavoriteStrategy() {
        const strategies = {};
        this.gameHistory.forEach(game => {
            game.rounds.forEach(round => {
                if (round.strategy) {
                    strategies[round.strategy] = (strategies[round.strategy] || 0) + 1;
                }
            });
        });
        
        return Object.keys(strategies).length > 0 
            ? Object.keys(strategies).reduce((a, b) => strategies[a] > strategies[b] ? a : b)
            : 'Conservative';
    }
    
    getImprovementTrend() {
        if (this.gameHistory.length < 5) return 'Insuficientes datos';
        
        const recent = this.gameHistory.slice(-5);
        const older = this.gameHistory.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, game) => sum + game.finalScore, 0) / recent.length;
        const olderAvg = older.length > 0 
            ? older.reduce((sum, game) => sum + game.finalScore, 0) / older.length
            : recentAvg;
        
        const improvement = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        if (improvement > 10) return 'Mejorando significativamente';
        if (improvement > 5) return 'Mejorando';
        if (improvement > -5) return 'Estable';
        return 'Necesita práctica';
    }
    
    getRecommendations() {
        const recommendations = [];
        
        if (this.allTimeStats.totalDecisionAccuracy < 0.6) {
            recommendations.push('💡 Considera seguir más las recomendaciones del sistema');
        }
        
        if (this.allTimeStats.averageScore < 200) {
            recommendations.push('📈 Practica identificar patrones de color y escalera');
        }
        
        const mostCommon = Object.keys(this.allTimeStats.combinationsAchieved)
            .reduce((a, b) => this.allTimeStats.combinationsAchieved[a] > this.allTimeStats.combinationsAchieved[b] ? a : b);
        
        if (mostCommon === 'lobos_solitarios') {
            recommendations.push('🎯 Intenta ser más agresivo con los descartes');
        }
        
        return recommendations;
    }
    
    exportData() {
        return {
            version: '1.0',
            exportDate: new Date().toISOString(),
            allTimeStats: this.allTimeStats,
            gameHistory: this.gameHistory,
            achievements: this.achievements,
            currentSession: this.currentSession
        };
    }
    
    importData(data) {
        if (data.version && data.allTimeStats) {
            this.allTimeStats = data.allTimeStats;
            this.gameHistory = data.gameHistory || [];
            this.achievements = data.achievements || [];
            this.saveStats();
            return true;
        }
        return false;
    }
    
    saveStats() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('pokerAdvisorStats', JSON.stringify({
                allTimeStats: this.allTimeStats,
                gameHistory: this.gameHistory.slice(-50), // Mantener solo los últimos 50 juegos
                achievements: this.achievements
            }));
        }
    }
    
    loadAllTimeStats() {
        const defaultStats = {
            gamesPlayed: 0,
            totalScore: 0,
            highestScore: 0,
            averageScore: 0,
            combinationsAchieved: {},
            totalPlayTime: 0,
            averageGameTime: 0,
            totalDecisionAccuracy: 0,
            firstPlayDate: Date.now()
        };
        
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('pokerAdvisorStats');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return { ...defaultStats, ...parsed.allTimeStats };
                } catch (e) {
                    console.warn('Error loading stats:', e);
                }
            }
        }
        
        return defaultStats;
    }
    
    loadGameHistory() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('pokerAdvisorStats');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return parsed.gameHistory || [];
                } catch (e) {
                    console.warn('Error loading game history:', e);
                }
            }
        }
        return [];
    }
    
    loadAchievements() {
        if (typeof localStorage !== 'undefined') {
            const saved = localStorage.getItem('pokerAdvisorStats');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return parsed.achievements || [];
                } catch (e) {
                    console.warn('Error loading achievements:', e);
                }
            }
        }
        return [];
    }
    
    reset() {
        this.allTimeStats = this.loadAllTimeStats();
        this.gameHistory = [];
        this.achievements = [];
        this.currentSession = {
            gamesPlayed: 0,
            totalScore: 0,
            highestScore: 0,
            averageScore: 0,
            combinationsAchieved: {},
            roundsPlayed: 0,
            decisionsCorrect: 0,
            decisionsTotal: 0,
            startTime: Date.now()
        };
        
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('pokerAdvisorStats');
        }
    }
}

// Instancia global de estadísticas
const gameStats = new Statistics();
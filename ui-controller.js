// ui-controller.js - Control de la interfaz de usuario
class UIController {
    static getCurrentHand() {
        const cards = [];
        for (let i = 0; i < 5; i++) {
            const valueInput = document.querySelector(`[data-card="${i}"] .card-value`);
            const suitSelect = document.querySelector(`[data-card="${i}"] .card-suit`);
            const card = CardLogic.parseCard(valueInput.value.trim().toUpperCase(), suitSelect.value);
            if (card) cards.push(card);
        }
        return cards;
    }
    
    static getDiscardedIndices() {
        const indices = [];
        document.querySelectorAll('.discard-checkbox').forEach((checkbox, index) => {
            if (checkbox.checked) {
                indices.push(index);
            }
        });
        return indices;
    }
    
    static updateCardColors() {
        document.querySelectorAll('.card-input').forEach((input, index) => {
            const suitSelect = input.querySelector('.card-suit');
            const cardSlot = input.querySelector('.card-slot');
            
            // Remover atributos de palo anteriores
            cardSlot.removeAttribute('data-suit');
            
            // Aplicar nuevo palo si está seleccionado
            if (suitSelect.value) {
                cardSlot.setAttribute('data-suit', suitSelect.value);
            }
        });
    }
    
    static updateCurrentHandDisplay(evaluation) {
        document.getElementById('currentCombination').textContent = handRankings[evaluation.type].name;
        document.getElementById('currentPoints').textContent = `${evaluation.points} PTS`;
        
        // Destacar combinación actual
        document.querySelectorAll('.combination').forEach(el => {
            el.classList.remove('current');
        });
        const currentCombElement = document.querySelector(`[data-type="${evaluation.type}"]`);
        if (currentCombElement) {
            currentCombElement.classList.add('current');
        }
    }
    
    static updateProbabilitiesDisplay(probabilities) {
        let probHTML = '';
        
        if (Object.keys(probabilities).length === 0) {
            probHTML = '<div class="probability-item"><span>Introduce cartas para ver probabilidades</span><span>-</span></div>';
        } else {
            Object.entries(probabilities).forEach(([combo, prob]) => {
                const confidenceClass = prob > 60 ? 'high-prob' : prob > 30 ? 'med-prob' : 'low-prob';
                probHTML += `<div class="probability-item ${confidenceClass}"><span>${combo}</span><span>${prob}%</span></div>`;
            });
        }
        
        document.getElementById('probabilities').innerHTML = probHTML;
    }
    
    static updateAdviceDisplay(adviceText) {
        document.getElementById('adviceContent').innerHTML = adviceText.replace(/\n/g, '<br>');
    }
    
    static updateRoundDisplay() {
        document.getElementById('roundDisplay').textContent = `Ronda ${gameState.currentRound} de ${gameState.maxRounds}`;
        
        const nextButton = document.querySelector('.btn-secondary');
        if (gameState.currentRound >= gameState.maxRounds) {
            nextButton.textContent = '🏁 Juego Completado';
            nextButton.disabled = true;
        } else if (gameState.currentRound === gameState.maxRounds - 1) {
            nextButton.textContent = '🏁 Ronda Final';
            nextButton.disabled = false;
        } else {
            nextButton.textContent = '➡️ Siguiente Ronda';
            nextButton.disabled = false;
        }
    }
    
    static updateDiscardedCardsVisual() {
        document.querySelectorAll('.card-input').forEach((input, index) => {
            const checkbox = input.querySelector('.discard-checkbox');
            const cardSlot = input.querySelector('.card-slot');
            
            if (checkbox.checked) {
                cardSlot.classList.add('discarded');
            } else {
                cardSlot.classList.remove('discarded');
            }
        });
    }
    
    static clearCards(discardedOnly = true) {
        if (discardedOnly) {
            document.querySelectorAll('.discard-checkbox:checked').forEach(checkbox => {
                const cardInput = checkbox.closest('.card-input');
                cardInput.querySelector('.card-value').value = '';
                cardInput.querySelector('.card-suit').value = '';
                checkbox.checked = false;
            });
        } else {
            // Limpiar todas las cartas
            document.querySelectorAll('.card-value').forEach(input => input.value = '');
            document.querySelectorAll('.card-suit').forEach(select => select.value = '');
            document.querySelectorAll('.discard-checkbox').forEach(cb => cb.checked = false);
        }
        
        // Limpiar visuales
        document.querySelectorAll('.card-slot').forEach(slot => {
            slot.classList.remove('discarded');
            slot.removeAttribute('data-suit');
        });
    }
    
    static resetDisplay() {
        document.getElementById('currentCombination').textContent = '-';
        document.getElementById('currentPoints').textContent = '10 PTS';
        document.getElementById('probabilities').innerHTML = '';
        document.getElementById('adviceContent').innerHTML = 'Introduce tus cartas y analiza tu mano para recibir recomendaciones estratégicas avanzadas.';
        
        document.querySelectorAll('.combination').forEach(el => {
            el.classList.remove('current', 'possible');
        });
        
        this.updateCardColors();
        this.updateRoundDisplay();
    }
    
    static showDebugInfo(currentCards, evaluation, strategies) {
        if (currentCards.length > 0) {
            console.group('🔍 ANÁLISIS DETALLADO DE MANO');
            console.log('📋 Cartas:', currentCards.map(c => `${c.display}${c.suit}`));
            console.log('🎯 Valores:', currentCards.map(c => c.value));
            console.log('🎨 Palos:', currentCards.map(c => c.suit));
            console.log('📊 Conteo de palos:', CardLogic.countSuits(currentCards));
            console.log('📈 Conteo de valores:', CardLogic.countValues(currentCards));
            console.log('🏆 Evaluación:', evaluation);
            console.log('🎲 Estrategias sugeridas:', strategies);
            console.log('🎮 Estado del juego:', {
                ronda: gameState.currentRound,
                cartasRestantes: gameState.getRemainingCards()
            });
            console.groupEnd();
        }
    }
    
    static createProbabilityBreakdown(strategies) {
        const breakdown = {};
        
        strategies.forEach(strategy => {
            strategy.analysis.improvements.forEach(improvement => {
                const key = improvement.type;
                if (!breakdown[key]) {
                    breakdown[key] = {
                        description: improvement.description,
                        probability: improvement.probability,
                        points: improvement.targetCombination
                    };
                } else if (improvement.probability > breakdown[key].probability) {
                    breakdown[key] = {
                        description: improvement.description,
                        probability: improvement.probability,
                        points: improvement.targetCombination
                    };
                }
            });
        });
        
        return breakdown;
    }
    
    static generateSimplifiedProbabilities(strategies) {
        if (strategies.length === 0) return {};
        
        const breakdown = this.createProbabilityBreakdown(strategies);
        const simplified = {};
        
        // Agrupar por categorías principales
        Object.entries(breakdown).forEach(([type, data]) => {
            let category = '';
            
            if (type.includes('flush') || type === 'color') {
                category = 'Conseguir Color';
            } else if (type.includes('straight') || type === 'escalera') {
                category = 'Conseguir Escalera';
            } else if (type.includes('pair') || type.includes('trip') || type.includes('four')) {
                category = 'Mejorar Múltiples';
            } else if (type.includes('full')) {
                category = 'Conseguir Full House';
            } else {
                category = 'Otras Mejoras';
            }
            
            if (!simplified[category] || data.probability > simplified[category]) {
                simplified[category] = data.probability;
            }
        });
        
        return simplified;
    }
    
    static validateCardInput(cardIndex) {
        const valueInput = document.querySelector(`[data-card="${cardIndex}"] .card-value`);
        const suitSelect = document.querySelector(`[data-card="${cardIndex}"] .card-suit`);
        
        const value = valueInput.value.trim();
        const suit = suitSelect.value;
        
        let isValid = true;
        let errorMessage = '';
        
        if (value && !suit) {
            isValid = false;
            errorMessage = 'Selecciona un palo para esta carta';
        }
        
        if (value && value !== '*') {
            const numValue = parseInt(value);
            if (isNaN(numValue) || numValue < 2 || numValue > 13) {
                isValid = false;
                errorMessage = 'Valor debe ser 2-13 o *';
            }
        }
        
        // Mostrar error si es necesario
        const cardSlot = document.querySelector(`[data-card="${cardIndex}"] .card-slot`);
        if (!isValid) {
            cardSlot.style.borderColor = '#ff4444';
            cardSlot.title = errorMessage;
        } else {
            cardSlot.style.borderColor = '#ffd700';
            cardSlot.title = '';
        }
        
        return isValid;
    }
    
    static addEventListeners() {
        // Validación y análisis automático
        document.addEventListener('change', function(e) {
            if (e.target.matches('.card-value') || e.target.matches('.card-suit') || e.target.matches('.discard-checkbox')) {
                UIController.updateCardColors();
                UIController.updateDiscardedCardsVisual();
                
                // Validar entrada si es un input de valor
                if (e.target.matches('.card-value')) {
                    const cardIndex = parseInt(e.target.closest('.card-input').dataset.card);
                    UIController.validateCardInput(cardIndex);
                }
                
                // Auto-analizar después de un pequeño delay
                setTimeout(() => {
                    GameController.analyzeHand();
                }, 300);
            }
        });
        
        document.addEventListener('input', function(e) {
            if (e.target.matches('.card-value')) {
                UIController.updateCardColors();
                
                // Validación en tiempo real
                const cardIndex = parseInt(e.target.closest('.card-input').dataset.card);
                UIController.validateCardInput(cardIndex);
            }
        });
        
        // Prevenir valores inválidos
        document.addEventListener('keypress', function(e) {
            if (e.target.matches('.card-value')) {
                const char = String.fromCharCode(e.which);
                if (!/[0-9*]/.test(char) && e.which !== 8 && e.which !== 0) {
                    e.preventDefault();
                }
            }
        });
    }
}
let currentRound = 1;
let gameState = {
    round: 1,
    cardsRemaining: 47,
    discardedCards: []
};

const handRankings = {
    'fuerza_certificada': { points: 10000, name: 'Fuerza Certificada' },
    'super_trajes': { points: 5000, name: 'Super Trajes' },
    'fantastico': { points: 1500, name: 'Fantástico' },
    'creador_reyes': { points: 850, name: 'Creador de Reyes' },
    'reaccion_faccion': { points: 800, name: 'Reacción de Facción' },
    'orden_capitan': { points: 750, name: 'Orden del Capitán' },
    'amenaza_triple': { points: 425, name: 'Amenaza Triple' },
    'doble_problema': { points: 325, name: 'Doble Problema' },
    'el_impar': { points: 300, name: 'El Impar' },
    'cuarto_escalon': { points: 275, name: 'Cuarto Escalón' },
    'duo_mortal': { points: 50, name: 'Dúo Mortal' },
    'lobos_solitarios': { points: 10, name: 'Lobos Solitarios' }
};

function parseCard(value, suit) {
    if (!value || !suit) return null;
    
    let numValue;
    if (value === '*') {
        numValue = 14; // Por defecto como As alto, pero puede ser 1 en escaleras bajas
    } else {
        numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 2 || numValue > 13) {
            return null;
        }
    }
    
    return { value: numValue, suit: suit, display: value, isAce: value === '*' };
}

function getCurrentHand() {
    const cards = [];
    for (let i = 0; i < 5; i++) {
        const valueInput = document.querySelector(`[data-card="${i}"] .card-value`);
        const suitSelect = document.querySelector(`[data-card="${i}"] .card-suit`);
        const card = parseCard(valueInput.value.trim().toUpperCase(), suitSelect.value);
        if (card) cards.push(card);
    }
    return cards;
}

function countSuits(cards) {
    const suitCounts = {};
    cards.forEach(card => {
        suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    });
    return suitCounts;
}

function countValues(cards) {
    const valueCounts = {};
    cards.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });
    return valueCounts;
}

function isStraight(values) {
    // Ordenar valores únicos
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

function isRoyalStraight(values) {
    const sortedValues = [...values].sort((a, b) => a - b);
    return sortedValues.length === 5 && 
           sortedValues[0] === 10 && 
           sortedValues[1] === 11 && 
           sortedValues[2] === 12 && 
           sortedValues[3] === 13 && 
           sortedValues[4] === 14;
}

function hasFourConsecutive(values) {
    const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
    
    // Buscar 4 consecutivos en los valores únicos
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

function evaluateHand(cards) {
    if (cards.length !== 5) return { type: 'lobos_solitarios', points: 10 };
    
    const values = cards.map(c => c.value);
    const suits = cards.map(c => c.suit);
    const suitCounts = countSuits(cards);
    const valueCounts = countValues(cards);
    const counts = Object.values(valueCounts).sort((a, b) => b - a);
    const suitCountValues = Object.values(suitCounts).sort((a, b) => b - a);
    
    const isAllSameSuit = suitCountValues[0] === 5;
    const isStraightHand = isStraight(values);
    const isRoyalStraightHand = isRoyalStraight(values);
    const hasFourConsecutiveCards = hasFourConsecutive(values);
    
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
    
    // 4. Creador de Reyes: 3 del mismo valor + 2 de otro valor igual (Full House)
    if (counts[0] === 3 && counts[1] === 2) {
        return { type: 'creador_reyes', points: 850 };
    }
    
    // 5. Reacción de Facción: 5 de la misma facción (Color)
    if (isAllSameSuit) {
        return { type: 'reaccion_faccion', points: 800 };
    }
    
    // 6. Orden del Capitán: 5 con valores secuenciales (Escalera)
    if (isStraightHand) {
        return { type: 'orden_capitan', points: 750 };
    }
    
    // 7. Amenaza Triple: 3 iguales + 2 diferentes no iguales (Trío)
    if (counts[0] === 3 && counts[1] === 1 && counts[2] === 1) {
        return { type: 'amenaza_triple', points: 425 };
    }
    
    // 8. Doble Problema: 2 iguales + 2 iguales + 1 diferente (Doble Pareja)
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
    
    // 11. Dúo Mortal: 2 iguales + 3 diferentes (Una Pareja)
    if (counts[0] === 2 && counts[1] === 1 && counts[2] === 1 && counts[3] === 1) {
        return { type: 'duo_mortal', points: 50 };
    }
    
    // 12. Lobos Solitarios: Sin combinaciones especiales
    return { type: 'lobos_solitarios', points: 10 };
}

function calculateProbabilities(currentCards, evaluation) {
    const discardCount = document.querySelectorAll('.discard-checkbox:checked').length;
    const remainingCards = 47 - (currentRound - 1) * discardCount;
    
    if (currentCards.length < 5) {
        return {
            'Completar mano': 100,
            'Obtener pareja': 0,
            'Obtener trío': 0,
            'Obtener color': 0,
            'Obtener escalera': 0
        };
    }
    
    const suitCounts = countSuits(currentCards);
    const valueCounts = countValues(currentCards);
    const values = currentCards.map(c => c.value);
    const suits = currentCards.map(c => c.suit);
    
    // Cálculos más específicos basados en la mano actual
    let probabilities = {};
    
    // Probabilidad base según cartas descartadas
    const baseFactor = Math.min(1.5, 1 + (discardCount * 0.2));
    
    // Si ya tienes una pareja
    if (Object.values(valueCounts).includes(2)) {
        probabilities['Mejorar a trío'] = Math.min(85, Math.round(15 * baseFactor));
        probabilities['Obtener full house'] = Math.min(60, Math.round(8 * baseFactor));
        probabilities['Obtener poker'] = Math.min(40, Math.round(3 * baseFactor));
    } else {
        probabilities['Obtener pareja'] = Math.min(90, Math.round(35 * baseFactor));
        probabilities['Obtener trío'] = Math.min(70, Math.round(12 * baseFactor));
    }
    
    // Si tienes 4 del mismo palo
    if (Object.values(suitCounts).includes(4)) {
        probabilities['Completar color'] = Math.min(95, Math.round(25 * baseFactor));
        probabilities['Obtener escalera color'] = Math.min(40, Math.round(5 * baseFactor));
    } else if (Object.values(suitCounts).includes(3)) {
        probabilities['Obtener color'] = Math.min(70, Math.round(8 * baseFactor));
    } else {
        probabilities['Obtener color'] = Math.min(30, Math.round(3 * baseFactor));
    }
    
    // Probabilidad de escalera (buscar secuencias parciales)
    const sortedValues = [...new Set(values)].sort((a, b) => a - b);
    let maxConsecutive = 1;
    let currentConsecutive = 1;
    
    for (let i = 1; i < sortedValues.length; i++) {
        if (sortedValues[i] === sortedValues[i-1] + 1) {
            currentConsecutive++;
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
            currentConsecutive = 1;
        }
    }
    
    if (maxConsecutive >= 4) {
        probabilities['Completar escalera'] = Math.min(85, Math.round(20 * baseFactor));
    } else if (maxConsecutive >= 3) {
        probabilities['Obtener escalera'] = Math.min(60, Math.round(10 * baseFactor));
    } else {
        probabilities['Obtener escalera'] = Math.min(25, Math.round(4 * baseFactor));
    }
    
    // Ajustar según cartas restantes en el mazo
    const deckFactor = Math.min(1.2, remainingCards / 35);
    Object.keys(probabilities).forEach(key => {
        probabilities[key] = Math.round(probabilities[key] * deckFactor);
    });
    
    return probabilities;
}

function generateAdvice(currentHand, evaluation, probabilities) {
    const discardCount = document.querySelectorAll('.discard-checkbox:checked').length;
    const currentRoundNum = currentRound;
    
    // Consejos basados en puntuación actual
    if (evaluation.points >= 5000) {
        return `🏆 ¡JACKPOT! Tienes ${handRankings[evaluation.type].name} (${evaluation.points} puntos). RECOMENDACIÓN FUERTE: ¡RETÍRATE INMEDIATAMENTE! Es casi imposible conseguir algo mejor.`;
    }
    
    if (evaluation.points >= 1500) {
        return `🎉 ¡Excelente mano! ${handRankings[evaluation.type].name} (${evaluation.points} puntos). RECOMENDACIÓN: Retírate ahora y asegura esta gran ganancia. Riesgo vs recompensa no favorece continuar.`;
    }
    
    if (evaluation.points >= 800) {
        if (currentRoundNum === 1) {
            return `💎 Muy buena mano con ${handRankings[evaluation.type].name} (${evaluation.points} puntos). RECOMENDACIÓN: Puedes intentar una ronda más con descarte conservador (1-2 cartas) o retirarte con ganancia sólida.`;
        } else {
            return `💎 Excelente resultado con ${handRankings[evaluation.type].name} (${evaluation.points} puntos). RECOMENDACIÓN: Retírate ahora, has logrado una muy buena puntuación.`;
        }
    }
    
    if (evaluation.points >= 300) {
        const discardSuggestion = currentRoundNum <= 2 ? "1-3 cartas" : "máximo 2 cartas";
        return `⚡ Mano sólida con ${handRankings[evaluation.type].name} (${evaluation.points} puntos). RECOMENDACIÓN: Ronda ${currentRoundNum}/3 - Puedes arriesgar cambiando ${discardSuggestion} o retirarte con ganancia decente.`;
    }
    
    if (evaluation.points >= 50) {
        const risk = currentRoundNum >= 3 ? "ALTO" : "MODERADO";
        return `⚠️ Mano básica con ${handRankings[evaluation.type].name} (${evaluation.points} puntos). RIESGO ${risk}: Ronda ${currentRoundNum}/3. Puedes intentar mejorar cambiando hasta 3 cartas, pero podrías perder lo que tienes.`;
    }
    
    // Consejos específicos para manos sin puntuación
    if (evaluation.points <= 10) {
        if (discardCount === 0) {
            const suitCounts = countSuits(currentHand);
            const valueCounts = countValues(currentHand);
            const maxSuit = Math.max(...Object.values(suitCounts));
            const maxValue = Math.max(...Object.values(valueCounts));
            
            let specificAdvice = "";
            if (maxSuit >= 3) {
                specificAdvice = ` Tienes ${maxSuit} cartas del mismo palo - mantén esas y descarta las otras para buscar color.`;
            } else if (maxValue >= 2) {
                specificAdvice = ` Tienes una pareja incompleta - mantén las cartas iguales y descarta el resto.`;
            } else {
                specificAdvice = ` Mano muy débil - descarta 3-4 cartas para maximizar posibilidades.`;
            }
            
            return `❌ ${handRankings[evaluation.type].name} (${evaluation.points} puntos). RECOMENDACIÓN URGENTE: Ronda ${currentRoundNum}/3.${specificAdvice} Probabilidades: ${JSON.stringify(probabilities)}`;
        }
        
        if (discardCount >= 3) {
            const encouragement = currentRoundNum <= 2 ? "¡Vale la pena el riesgo!" : "Última oportunidad, pero muy arriesgado.";
            return `🎲 Estrategia de alto riesgo. Con ${discardCount} descartes en ronda ${currentRoundNum}/3 tienes posibilidades de mejora significativa. ${encouragement}`;
        }
        
        return `🤔 Mano débil, estrategia conservadora. Ronda ${currentRoundNum}/3 con ${discardCount} descartes. Considera ser más agresivo con los descartes para maximizar mejoras.`;
    }
    
    return `🎯 Analiza cuidadosamente tu estrategia. Ronda ${currentRoundNum}/3, mano actual: ${evaluation.points} puntos. Recuerda: * puede ser 1 o 14 según te convenga.`;
}

function analyzeHand() {
    const currentCards = getCurrentHand();
    
    if (currentCards.length === 0) {
        document.getElementById('adviceContent').innerHTML = '⚠️ Por favor, introduce al menos algunas cartas para el análisis.';
        document.getElementById('currentCombination').textContent = '-';
        document.getElementById('currentPoints').textContent = '10 PTS';
        document.getElementById('probabilities').innerHTML = '';
        return;
    }
    
    const evaluation = evaluateHand(currentCards);
    const probabilities = calculateProbabilities(currentCards, evaluation);
    
    // Actualizar display de mano actual
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
    
    // Mostrar probabilidades
    let probHTML = '';
    Object.entries(probabilities).forEach(([combo, prob]) => {
        probHTML += `<div class="probability-item"><span>${combo}</span><span>${prob}%</span></div>`;
    });
    document.getElementById('probabilities').innerHTML = probHTML;
    
    // Generar consejo
    const advice = generateAdvice(currentCards, evaluation, probabilities);
    document.getElementById('adviceContent').innerHTML = advice;
    
    // Actualizar visual de cartas descartadas
    document.querySelectorAll('.card-input').forEach((input, index) => {
        const checkbox = input.querySelector('.discard-checkbox');
        const cardSlot = input.querySelector('.card-slot');
        
        if (checkbox.checked) {
            cardSlot.classList.add('discarded');
        } else {
            cardSlot.classList.remove('discarded');
        }
    });
    
    // Debug info para verificar detección
    console.log('=== ANÁLISIS DE MANO ===');
    console.log('Cartas:', currentCards.map(c => `${c.display}${c.suit}`));
    console.log('Valores:', currentCards.map(c => c.value));
    console.log('Palos:', currentCards.map(c => c.suit));
    console.log('Conteo de palos:', countSuits(currentCards));
    console.log('Conteo de valores:', countValues(currentCards));
    console.log('Evaluación:', evaluation);
    console.log('Ronda actual:', currentRound);
    console.log('========================');
}

function updateCardColors() {
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

function nextRound() {
    if (currentRound >= 3) {
        alert('¡Has completado las 3 rondas! Tiempo de evaluar tu mano final.');
        return;
    }
    
    const discardCount = document.querySelectorAll('.discard-checkbox:checked').length;
    
    if (discardCount === 0) {
        alert('Selecciona al menos una carta para descartar antes de continuar.');
        return;
    }
    
    // Simular nuevas cartas
    document.querySelectorAll('.discard-checkbox:checked').forEach(checkbox => {
        const cardInput = checkbox.closest('.card-input');
        cardInput.querySelector('.card-value').value = '';
        cardInput.querySelector('.card-suit').value = '';
        checkbox.checked = false;
    });
    
    currentRound++;
    gameState.round = currentRound;
    gameState.cardsRemaining -= discardCount;
    
    document.getElementById('roundDisplay').textContent = `Ronda ${currentRound} de 3`;
    
    if (currentRound === 3) {
        document.querySelector('.btn-secondary').textContent = '🏁 Ronda Final';
    }
    
    // Limpiar análisis anterior
    document.getElementById('currentCombination').textContent = '-';
    document.getElementById('currentPoints').textContent = '10 PTS';
    document.getElementById('probabilities').innerHTML = '';
    document.getElementById('adviceContent').innerHTML = 'Introduce tus nuevas cartas y analiza tu mano actualizada.';
    
    document.querySelectorAll('.combination').forEach(el => {
        el.classList.remove('current');
    });
    
    // Actualizar colores
    updateCardColors();
}

function cashOut() {
    const currentCards = getCurrentHand();
    const evaluation = evaluateHand(currentCards);
    
    const confirmText = `¿Confirmas que quieres retirarte con tu mano actual?\n\nCombinación: ${handRankings[evaluation.type].name}\nPuntos: ${evaluation.points}\nRonda: ${currentRound}`;
    
    if (confirm(confirmText)) {
        alert(`🎊 ¡Te has retirado! Puntos finales: ${evaluation.points}\nCombinación: ${handRankings[evaluation.type].name}`);
        resetGame();
    }
}

function resetGame() {
    currentRound = 1;
    gameState = {
        round: 1,
        cardsRemaining: 47,
        discardedCards: []
    };
    
    document.getElementById('roundDisplay').textContent = 'Ronda 1 de 3';
    document.querySelector('.btn-secondary').textContent = '➡️ Siguiente Ronda';
    
    // Limpiar todas las entradas
    document.querySelectorAll('.card-value').forEach(input => input.value = '');
    document.querySelectorAll('.card-suit').forEach(select => select.value = '');
    document.querySelectorAll('.discard-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.card-slot').forEach(slot => {
        slot.classList.remove('discarded');
        slot.removeAttribute('data-suit');
    });
    
    document.getElementById('currentCombination').textContent = '-';
    document.getElementById('currentPoints').textContent = '10 PTS';
    document.getElementById('probabilities').innerHTML = '';
    document.getElementById('adviceContent').innerHTML = 'Introduce tus cartas y analiza tu mano para recibir recomendaciones estratégicas.';
    
    document.querySelectorAll('.combination').forEach(el => {
        el.classList.remove('current', 'possible');
    });
    
    // Actualizar colores
    updateCardColors();
}

// Event listeners para análisis automático y colores
document.addEventListener('change', function(e) {
    if (e.target.matches('.card-value') || e.target.matches('.card-suit') || e.target.matches('.discard-checkbox')) {
        // Actualizar colores de cartas
        updateCardColors();
        // Auto-analizar después de un pequeño delay
        setTimeout(analyzeHand, 300);
    }
});

document.addEventListener('input', function(e) {
    if (e.target.matches('.card-value')) {
        // Actualizar colores inmediatamente al escribir
        updateCardColors();
    }
});

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    resetGame();
});
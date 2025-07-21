// enhanced-ui.js - Interfaz mejorada con funcionalidades adicionales
class EnhancedUI {
    static init() {
        this.createFloatingMenu();
        this.createStatsPanel();
        this.createSettingsPanel();
        this.createTutorialSystem();
        this.enhanceExistingUI();
        this.addKeyboardShortcuts();
    }
    
    static createFloatingMenu() {
        const menu = document.createElement('div');
        menu.className = 'floating-menu';
        menu.innerHTML = `
            <div class="menu-toggle" onclick="EnhancedUI.toggleMenu()">
                <span>⚙️</span>
            </div>
            <div class="menu-items" id="floatingMenuItems">
                <button class="menu-item" onclick="EnhancedUI.showStats()" title="Estadísticas">
                    📊 <span>Estadísticas</span>
                </button>
                <button class="menu-item" onclick="EnhancedUI.showSettings()" title="Configuración">
                    ⚙️ <span>Config</span>
                </button>
                <button class="menu-item" onclick="EnhancedUI.showTutorial()" title="Tutorial">
                    🎓 <span>Tutorial</span>
                </button>
                <button class="menu-item" onclick="EnhancedUI.exportData()" title="Exportar Datos">
                    💾 <span>Exportar</span>
                </button>
                <button class="menu-item" onclick="EnhancedUI.toggleTheme()" title="Cambiar Tema">
                    🎨 <span>Tema</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(menu);
    }
    
    static createStatsPanel() {
        const panel = document.createElement('div');
        panel.className = 'stats-panel hidden';
        panel.id = 'statsPanel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2>📊 Estadísticas</h2>
                <button class="close-btn" onclick="EnhancedUI.hideStats()">✖</button>
            </div>
            <div class="panel-content">
                <div class="stats-tabs">
                    <button class="tab-btn active" onclick="EnhancedUI.showStatsTab('session')">Sesión</button>
                    <button class="tab-btn" onclick="EnhancedUI.showStatsTab('alltime')">Historial</button>
                    <button class="tab-btn" onclick="EnhancedUI.showStatsTab('achievements')">Logros</button>
                </div>
                
                <div class="stats-content" id="sessionStats">
                    <div class="stat-card">
                        <h3>Sesión Actual</h3>
                        <div class="stat-grid" id="sessionStatsData">
                            <!-- Datos de sesión -->
                        </div>
                    </div>
                </div>
                
                <div class="stats-content hidden" id="alltimeStats">
                    <div class="stat-card">
                        <h3>Estadísticas de Todos los Tiempos</h3>
                        <div class="stat-grid" id="alltimeStatsData">
                            <!-- Datos históricos -->
                        </div>
                    </div>
                </div>
                
                <div class="stats-content hidden" id="achievementsStats">
                    <div class="stat-card">
                        <h3>Logros Desbloqueados</h3>
                        <div class="achievements-grid" id="achievementsData">
                            <!-- Logros -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    static createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'settings-panel hidden';
        panel.id = 'settingsPanel';
        panel.innerHTML = `
            <div class="panel-header">
                <h2>⚙️ Configuración</h2>
                <button class="close-btn" onclick="EnhancedUI.hideSettings()">✖</button>
            </div>
            <div class="panel-content">
                <div class="settings-section">
                    <h3>🎮 Juego</h3>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="autoAnalysis" onchange="EnhancedUI.updateSetting('enableAutoAnalysis', this.checked)">
                            Análisis automático
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="expertMode" onchange="EnhancedUI.updateSetting('expertMode', this.checked)">
                            Modo experto (menos ayuda)
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="showDebug" onchange="EnhancedUI.updateSetting('showDebugInfo', this.checked)">
                            Mostrar información de debug
                        </label>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>🎨 Interfaz</h3>
                    <div class="setting-item">
                        <label>Tema:</label>
                        <select id="themeSelect" onchange="EnhancedUI.updateSetting('theme', this.value)">
                            <option value="default">Predeterminado</option>
                            <option value="dark">Oscuro</option>
                            <option value="colorful">Colorido</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="enableAnimations" onchange="EnhancedUI.updateSetting('enableAnimations', this.checked)">
                            Animaciones
                        </label>
                    </div>
                </div>
                
                <div class="settings-section">
                    <h3>📊 Consejos</h3>
                    <div class="setting-item">
                        <label>Nivel de detalle:</label>
                        <select id="adviceVerbosity" onchange="EnhancedUI.updateSetting('adviceVerbosity', this.value)">
                            <option value="simple">Simple</option>
                            <option value="detailed">Detallado</option>
                            <option value="expert">Experto</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="showProbHints" onchange="EnhancedUI.updateSetting('showProbabilityHints', this.checked)">
                            Mostrar pistas de probabilidad
                        </label>
                    </div>
                </div>
                
                <div class="settings-actions">
                    <button class="btn btn-secondary" onclick="EnhancedUI.resetSettings()">Restaurar Defaults</button>
                    <button class="btn btn-danger" onclick="EnhancedUI.resetAllData()">Reset Completo</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    static createTutorialSystem() {
        const tutorial = document.createElement('div');
        tutorial.className = 'tutorial-overlay hidden';
        tutorial.id = 'tutorialOverlay';
        tutorial.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-header">
                    <h2 id="tutorialTitle">🎓 Tutorial</h2>
                    <button class="close-btn" onclick="EnhancedUI.hideTutorial()">✖</button>
                </div>
                <div class="tutorial-body" id="tutorialBody">
                    <!-- Contenido del tutorial -->
                </div>
                <div class="tutorial-navigation">
                    <button class="btn btn-secondary" id="tutorialPrev" onclick="EnhancedUI.prevTutorialStep()">← Anterior</button>
                    <span id="tutorialProgress">1 / 5</span>
                    <button class="btn btn-primary" id="tutorialNext" onclick="EnhancedUI.nextTutorialStep()">Siguiente →</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(tutorial);
    }
    
    static enhanceExistingUI() {
        // Añadir indicadores de probabilidad visual
        this.addProbabilityIndicators();
        
        // Mejorar feedback visual
        this.enhanceVisualFeedback();
        
        // Añadir tooltips informativos
        this.addTooltips();
        
        // Mejorar animaciones de cartas
        this.enhanceCardAnimations();
    }
    
    static addProbabilityIndicators() {
        // Añadir barras de probabilidad visuales
        const probSection = document.getElementById('probabilities');
        if (probSection) {
            probSection.classList.add('enhanced-probabilities');
        }
    }
    
    static enhanceVisualFeedback() {
        // Añadir efectos visuales para diferentes estados
        const combinations = document.querySelectorAll('.combination');
        combinations.forEach(combo => {
            combo.addEventListener('mouseenter', function() {
                if (GameConfig.getSetting('enableAnimations')) {
                    this.style.transform = 'scale(1.05)';
                }
            });
            
            combo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    static addTooltips() {
        // Añadir tooltips informativos
        const cards = document.querySelectorAll('.card-input');
        cards.forEach(card => {
            card.title = 'Introduce un valor (2-13 o *) y selecciona un palo';
        });
    }
    
    static enhanceCardAnimations() {
        // Mejorar animaciones de las cartas
        const cardSlots = document.querySelectorAll('.card-slot');
        cardSlots.forEach(slot => {
            slot.addEventListener('transitionend', function() {
                if (this.classList.contains('discarded')) {
                    this.style.boxShadow = '0 0 20px rgba(255, 68, 68, 0.5)';
                } else {
                    this.style.boxShadow = '';
                }
            });
        });
    }
    
    static addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'a':
                        e.preventDefault();
                        GameController.analyzeHand();
                        break;
                    case 's':
                        e.preventDefault();
                        this.showStats();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showTutorial();
                        break;
                    case 'r':
                        e.preventDefault();
                        GameController.resetGame();
                        break;
                }
            }
            
            if (e.key === 'Escape') {
                this.hideAllPanels();
            }
        });
    }
    
    // Métodos de control de menú
    static toggleMenu() {
        const menuItems = document.getElementById('floatingMenuItems');
        menuItems.classList.toggle('show');
    }
    
    // Métodos de estadísticas
    static showStats() {
        this.hideAllPanels();
        document.getElementById('statsPanel').classList.remove('hidden');
        this.updateStatsDisplay();
    }
    
    static hideStats() {
        document.getElementById('statsPanel').classList.add('hidden');
    }
    
    static showStatsTab(tab) {
        // Cambiar tab activo
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Mostrar contenido correspondiente
        document.querySelectorAll('.stats-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(tab + 'Stats').classList.remove('hidden');
        
        this.updateStatsDisplay(tab);
    }
    
    static updateStatsDisplay(tab = 'session') {
        if (tab === 'session') {
            const sessionData = gameStats.getSessionSummary();
            document.getElementById('sessionStatsData').innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Juegos:</span>
                    <span class="stat-value">${sessionData.gamesPlayed}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Promedio:</span>
                    <span class="stat-value">${sessionData.averageScore} pts</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Mejor:</span>
                    <span class="stat-value">${sessionData.highestScore} pts</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Precisión:</span>
                    <span class="stat-value">${sessionData.decisionAccuracy}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tiempo:</span>
                    <span class="stat-value">${sessionData.duration} min</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tendencia:</span>
                    <span class="stat-value">${sessionData.improvement}</span>
                </div>
            `;
        } else if (tab === 'alltime') {
            const allTimeData = gameStats.getAllTimeStats();
            document.getElementById('alltimeStatsData').innerHTML = `
                <div class="stat-item">
                    <span class="stat-label">Total Juegos:</span>
                    <span class="stat-value">${allTimeData.gamesPlayed}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Puntuación Total:</span>
                    <span class="stat-value">${allTimeData.totalScore.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Mejor Puntuación:</span>
                    <span class="stat-value">${allTimeData.highestScore.toLocaleString()}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Promedio:</span>
                    <span class="stat-value">${Math.round(allTimeData.averageScore)} pts</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tiempo Total:</span>
                    <span class="stat-value">${allTimeData.totalPlayTimeHours} h</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Precisión General:</span>
                    <span class="stat-value">${allTimeData.decisionAccuracy}%</span>
                </div>
            `;
        } else if (tab === 'achievements') {
            // Mostrar logros desbloqueados
            this.displayAchievements();
        }
    }
    
    static displayAchievements() {
        const achievementsContainer = document.getElementById('achievementsData');
        const allAchievements = this.getAllPossibleAchievements();
        const unlockedIds = gameStats.achievements;
        
        achievementsContainer.innerHTML = allAchievements.map(achievement => `
            <div class="achievement-item ${unlockedIds.includes(achievement.id) ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${unlockedIds.includes(achievement.id) ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <span class="achievement-rarity ${achievement.rarity}">${achievement.rarity}</span>
                </div>
            </div>
        `).join('');
    }
    
    static getAllPossibleAchievements() {
        return [
            { id: 'legendary_hand', name: 'Mano Legendaria', description: 'Conseguiste Fuerza Certificada', icon: '🏆', rarity: 'legendary' },
            { id: 'epic_achievement', name: 'Logro Épico', description: 'Conseguiste 5,000+ puntos', icon: '💎', rarity: 'epic' },
            { id: 'veteran_player', name: 'Jugador Veterano', description: 'Completaste 10 juegos', icon: '🎮', rarity: 'common' },
            { id: 'master_player', name: 'Maestro del Juego', description: 'Completaste 50 juegos', icon: '👑', rarity: 'rare' },
            { id: 'strategic_mind', name: 'Mente Estratégica', description: 'Mantén 80%+ precisión', icon: '🧠', rarity: 'rare' }
        ];
    }
    
    // Métodos de configuración
    static showSettings() {
        this.hideAllPanels();
        document.getElementById('settingsPanel').classList.remove('hidden');
        this.loadCurrentSettings();
    }
    
    static hideSettings() {
        document.getElementById('settingsPanel').classList.add('hidden');
    }
    
    static loadCurrentSettings() {
        document.getElementById('autoAnalysis').checked = GameConfig.getSetting('enableAutoAnalysis');
        document.getElementById('expertMode').checked = GameConfig.getSetting('expertMode');
        document.getElementById('showDebug').checked = GameConfig.getSetting('showDebugInfo');
        document.getElementById('themeSelect').value = GameConfig.getSetting('theme');
        document.getElementById('enableAnimations').checked = GameConfig.getSetting('enableAnimations');
        document.getElementById('adviceVerbosity').value = GameConfig.getSetting('adviceVerbosity');
        document.getElementById('showProbHints').checked = GameConfig.getSetting('showProbabilityHints');
    }
    
    static updateSetting(key, value) {
        GameConfig.setSetting(key, value);
        
        // Aplicar cambios inmediatamente si es necesario
        if (key === 'theme') {
            this.applyTheme(value);
        }
    }
    
    static resetSettings() {
        if (confirm('¿Restaurar toda la configuración a valores predeterminados?')) {
            GameConfig.resetToDefaults();
            this.loadCurrentSettings();
        }
    }
    
    static resetAllData() {
        if (confirm('¿Estás seguro? Esto eliminará TODAS las estadísticas y configuraciones.')) {
            GameConfig.resetToDefaults();
            gameStats.reset();
            this.loadCurrentSettings();
            alert('Todos los datos han sido eliminados.');
        }
    }
    
    // Métodos de tutorial
    static showTutorial() {
        this.hideAllPanels();
        document.getElementById('tutorialOverlay').classList.remove('hidden');
        this.currentTutorialStep = 0;
        this.updateTutorialStep();
    }
    
    static hideTutorial() {
        document.getElementById('tutorialOverlay').classList.add('hidden');
    }
    
    static nextTutorialStep() {
        if (this.currentTutorialStep < this.tutorialSteps.length - 1) {
            this.currentTutorialStep++;
            this.updateTutorialStep();
        } else {
            this.hideTutorial();
        }
    }
    
    static prevTutorialStep() {
        if (this.currentTutorialStep > 0) {
            this.currentTutorialStep--;
            this.updateTutorialStep();
        }
    }
    
    static updateTutorialStep() {
        const step = this.tutorialSteps[this.currentTutorialStep];
        document.getElementById('tutorialTitle').textContent = step.title;
        document.getElementById('tutorialBody').innerHTML = step.content;
        document.getElementById('tutorialProgress').textContent = `${this.currentTutorialStep + 1} / ${this.tutorialSteps.length}`;
        
        document.getElementById('tutorialPrev').disabled = this.currentTutorialStep === 0;
        document.getElementById('tutorialNext').textContent = 
            this.currentTutorialStep === this.tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente →';
    }
    
    static tutorialSteps = [
        {
            title: '🎯 Bienvenido al Asesor de Poker',
            content: `
                <h3>¡Bienvenido al sistema más avanzado de análisis de poker!</h3>
                <p>Este tutorial te enseñará a usar todas las funcionalidades para maximizar tus puntos.</p>
                <div class="tutorial-highlight">
                    <strong>Características principales:</strong>
                    <ul>
                        <li>Análisis específico por carta</li>
                        <li>Probabilidades matemáticas exactas</li>
                        <li>Consejos estratégicos detallados</li>
                        <li>Sistema de 3 rondas opcionales</li>
                    </ul>
                </div>
            `
        },
        {
            title: '🃏 Introduciendo Cartas',
            content: `
                <h3>Cómo introducir tus cartas</h3>
                <p>Tienes 5 espacios para cartas. Para cada carta:</p>
                <ol>
                    <li>Escribe el valor: <strong>2-13</strong> o <strong>*</strong> (As)</li>
                    <li>Selecciona el palo: 🔥 ☄️ 🌩️ ✊</li>
                    <li>El análisis es automático</li>
                </ol>
                <div class="tutorial-tip">
                    💡 <strong>Tip:</strong> El As (*) puede valer 1 o 14 según te convenga para escaleras.
                </div>
            `
        },
        {
            title: '📊 Interpretando el Análisis',
            content: `
                <h3>Entendiendo los consejos</h3>
                <p>El sistema te dará consejos específicos como:</p>
                <div class="tutorial-example">
                    "Si descartas 13🌩️, puedes obtener 7🔥 y formar escalera (23% probabilidad)"
                </div>
                <p>Cada consejo incluye:</p>
                <ul>
                    <li><strong>Cartas específicas</strong> a descartar</li>
                    <li><strong>Objetivo</strong> de la estrategia</li>
                    <li><strong>Probabilidad exacta</strong> de éxito</li>
                    <li><strong>Puntos potenciales</strong> a ganar</li>
                </ul>
            `
        },
        {
            title: '🎲 Estrategias Avanzadas',
            content: `
                <h3>Usando las recomendaciones</h3>
                <p>El sistema analiza múltiples estrategias y te muestra las mejores:</p>
                <div class="tutorial-strategy">
                    <h4>🔥 RECOMENDACIÓN PRINCIPAL:</h4>
                    <p>EVALUAR_PROBABILIDADES (Confianza: MEDIA)</p>
                    
                    <h4>⚡ MEJORES ESTRATEGIAS:</h4>
                    <p>1. Descarta 2🌩️, 8✊ → El Impar (300 pts) - 31%</p>
                    <p>2. Descarta 8✊ → Escalera (750 pts) - 12%</p>
                </div>
                <p>Considera siempre el <strong>riesgo vs recompensa</strong> y la ronda actual.</p>
            `
        },
        {
            title: '🏆 Maximizando Puntos',
            content: `
                <h3>Consejos para ser exitoso</h3>
                <div class="tutorial-tips">
                    <div class="tip-item">
                        <strong>🎯 Reconoce patrones:</strong>
                        <p>Busca 4 cartas del mismo palo o valores consecutivos</p>
                    </div>
                    <div class="tip-item">
                        <strong>⚖️ Evalúa el riesgo:</strong>
                        <p>En ronda 1/3 puedes ser más agresivo que en 3/3</p>
                    </div>
                    <div class="tip-item">
                        <strong>💰 Retírate inteligentemente:</strong>
                        <p>Con 800+ puntos considera asegurar la ganancia</p>
                    </div>
                    <div class="tip-item">
                        <strong>📚 Usa las estadísticas:</strong>
                        <p>Revisa tu rendimiento para mejorar</p>
                    </div>
                </div>
            `
        }
    ];
    
    // Métodos utilitarios
    static hideAllPanels() {
        document.getElementById('statsPanel').classList.add('hidden');
        document.getElementById('settingsPanel').classList.add('hidden');
        document.getElementById('tutorialOverlay').classList.add('hidden');
        document.getElementById('floatingMenuItems').classList.remove('show');
    }
    
    static toggleTheme() {
        const themes = ['default', 'dark', 'colorful'];
        const current = GameConfig.getSetting('theme');
        const currentIndex = themes.indexOf(current);
        const next = themes[(currentIndex + 1) % themes.length];
        
        GameConfig.setSetting('theme', next);
        this.applyTheme(next);
    }
    
    static applyTheme(theme) {
        const colors = GameConfig.getThemeColors();
        const root = document.documentElement;
        
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--secondary-color', colors.secondary);
        root.style.setProperty('--background', colors.background);
        root.style.setProperty('--card-border', colors.cardBorder);
        root.style.setProperty('--text-color', colors.text);
        
        document.body.style.background = colors.background;
    }
    
    static exportData() {
        const data = gameStats.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `poker-advisor-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Datos exportados exitosamente');
    }
    
    static importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (gameStats.importData(data)) {
                            alert('Datos importados exitosamente');
                        } else {
                            alert('Error: Formato de archivo inválido');
                        }
                    } catch (error) {
                        alert('Error al leer el archivo');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
}

// Estilos CSS adicionales para la interfaz mejorada
const enhancedStyles = `
    <style>
    /* Floating Menu */
    .floating-menu {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
    }
    
    .menu-toggle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color, #ffd700);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }
    
    .menu-toggle:hover {
        transform: scale(1.1);
    }
    
    .menu-items {
        position: absolute;
        top: 60px;
        right: 0;
        background: rgba(0,0,0,0.9);
        border-radius: 10px;
        padding: 10px;
        min-width: 150px;
        opacity: 0;
        transform: translateY(-20px);
        pointer-events: none;
        transition: all 0.3s ease;
    }
    
    .menu-items.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
    }
    
    .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        border-radius: 5px;
        width: 100%;
        text-align: left;
        transition: background 0.2s ease;
    }
    
    .menu-item:hover {
        background: rgba(255,255,255,0.1);
    }
    
    /* Panels */
    .stats-panel, .settings-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.95);
        border-radius: 15px;
        border: 2px solid var(--primary-color, #ffd700);
        min-width: 600px;
        max-width: 80vw;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 2000;
        color: white;
    }
    
    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    
    .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 5px;
        border-radius: 3px;
        transition: background 0.2s ease;
    }
    
    .close-btn:hover {
        background: rgba(255,255,255,0.1);
    }
    
    .panel-content {
        padding: 20px;
    }
    
    /* Stats Tabs */
    .stats-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .tab-btn {
        padding: 10px 20px;
        background: rgba(255,255,255,0.1);
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .tab-btn.active {
        background: var(--primary-color, #ffd700);
        color: black;
    }
    
    /* Stat Cards */
    .stat-card {
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 15px;
    }
    
    .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }
    
    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: rgba(255,255,255,0.05);
        border-radius: 5px;
    }
    
    .stat-label {
        font-weight: bold;
        color: var(--primary-color, #ffd700);
    }
    
    /* Achievements */
    .achievements-grid {
        display: grid;
        gap: 15px;
    }
    
    .achievement-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: rgba(255,255,255,0.05);
        border-radius: 10px;
        transition: all 0.2s ease;
    }
    
    .achievement-item.unlocked {
        background: rgba(0,255,0,0.1);
        border-left: 3px solid #00ff00;
    }
    
    .achievement-item.locked {
        opacity: 0.5;
    }
    
    .achievement-icon {
        font-size: 24px;
        width: 40px;
        text-align: center;
    }
    
    .achievement-rarity {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 10px;
        text-transform: uppercase;
        font-weight: bold;
    }
    
    .achievement-rarity.legendary { background: #ffd700; color: black; }
    .achievement-rarity.epic { background: #9370db; color: white; }
    .achievement-rarity.rare { background: #4169e1; color: white; }
    .achievement-rarity.common { background: #32cd32; color: black; }
    .achievement-rarity.basic { background: #808080; color: white; }
    
    /* Settings */
    .settings-section {
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
    }
    
    .setting-item label {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .setting-item select {
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.3);
        border-radius: 5px;
        padding: 5px 10px;
        color: white;
    }
    
    .settings-actions {
        display: flex;
        gap: 15px;
        margin-top: 20px;
    }
    
    /* Tutorial */
    .tutorial-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .tutorial-content {
        background: rgba(0,0,0,0.95);
        border-radius: 15px;
        border: 2px solid var(--primary-color, #ffd700);
        max-width: 700px;
        max-height: 80vh;
        overflow-y: auto;
        color: white;
    }
    
    .tutorial-body {
        padding: 20px;
        min-height: 300px;
    }
    
    .tutorial-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-top: 1px solid rgba(255,255,255,0.2);
    }
    
    .tutorial-highlight {
        background: rgba(255,215,0,0.1);
        border-left: 3px solid #ffd700;
        padding: 15px;
        margin: 15px 0;
        border-radius: 5px;
    }
    
    .tutorial-tip {
        background: rgba(0,255,0,0.1);
        border-left: 3px solid #00ff00;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
    }
    
    .tutorial-example {
        background: rgba(255,255,255,0.1);
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        margin: 10px 0;
    }
    
    .tutorial-strategy {
        background: rgba(255,255,255,0.05);
        padding: 15px;
        border-radius: 5px;
        margin: 15px 0;
    }
    
    .tutorial-tips {
        display: grid;
        gap: 15px;
    }
    
    .tip-item {
        background: rgba(255,255,255,0.05);
        padding: 15px;
        border-radius: 5px;
    }
    
    /* Achievement Notifications */
    .achievement-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0,0,0,0.9);
        border: 2px solid #ffd700;
        border-radius: 10px;
        padding: 15px;
        min-width: 250px;
        z-index: 4000;
        transform: translateX(300px);
        transition: all 0.3s ease;
    }
    
    .achievement-notification.show {
        transform: translateX(0);
    }
    
    .achievement-content h3 {
        color: #ffd700;
        margin: 0 0 5px 0;
    }
    
    .achievement-content p {
        color: white;
        margin: 0 0 10px 0;
    }
    
    /* Hidden class */
    .hidden {
        display: none !important;
    }
    
    /* Enhanced probabilities */
    .enhanced-probabilities .probability-item {
        position: relative;
        overflow: hidden;
    }
    
    .enhanced-probabilities .probability-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1));
        width: var(--probability, 0%);
        transition: width 0.5s ease;
    }
    
    /* CSS Variables for theming */
    :root {
        --primary-color: #ffd700;
        --secondary-color: #4a90e2;
        --background: linear-gradient(135deg, #1e3c72, #2a5298);
        --card-border: #ffd700;
        --text-color: #ffffff;
    }
    </style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', enhancedStyles);
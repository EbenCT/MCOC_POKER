# 🃏 Asesor de Poker Estratégico

Un simulador y asesor estratégico para un juego de cartas tipo poker con mecánicas especiales.

## 📁 Estructura del Proyecto

```
poker-advisor/
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos y diseño visual
├── script.js       # Lógica del juego y análisis
└── README.md       # Este archivo
```

## 🎮 Sistema de Cartas

### Valores
- **Números:** 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
- **Carta Especial:** `*` (As que vale como 1 o 14)

### Palos
- **🔥** Fuego (números en naranja)
- **☄️** Meteoro (números en amarillo)
- **🌩️** Tormenta (números en azul)
- **✊** Fuerza (números en verde)

## 🏆 Combinaciones y Puntuaciones (CORREGIDAS)

| Nombre | Puntos | Descripción Correcta |
|--------|--------|---------------------|
| **Fuerza Certificada** | 10,000 | 10, 11, 12, 13, * de la misma facción |
| **Super Trajes** | 5,000 | 5 de la misma facción con valores secuenciales |
| **Fantástico** | 1,500 | **4 del mismo valor + 1 de cualquier otro** |
| **Creador de Reyes** | 850 | 3 del mismo valor + 2 de otro valor igual |
| **Reacción de Facción** | 800 | **5 de la misma facción** |
| **Orden del Capitán** | 750 | **5 con valores secuenciales** |
| **Amenaza Triple** | 425 | 3 iguales + 2 diferentes no iguales |
| **Doble Problema** | 325 | 2 iguales + 2 iguales + 1 diferente |
| **El Impar** | 300 | 4 de la misma facción + 1 de otra |
| **Cuarto Escalón** | 275 | 4 secuenciales + 1 no secuencial |
| **Dúo Mortal** | 50 | 2 iguales + 3 diferentes |
| **Lobos Solitarios** | 10 | Sin combinaciones especiales |

## 🔧 Correcciones Importantes Implementadas

### ❌ **Errores Anteriores:**
- **Fantástico** era detectado como "escalera" → **CORREGIDO:** Ahora es "4 iguales + 1 diferente"
- **Super Trajes** era "color simple" → **CORREGIDO:** Ahora es "escalera de color"
- **Reacción de Facción** era "escalera menor" → **CORREGIDO:** Ahora es "color simple"
- **Orden del Capitán** era "4 iguales" → **CORREGIDO:** Ahora es "escalera simple"
- Orden de prioridad incorrecto → **CORREGIDO:** Evaluación en orden descendente de puntos

### ✅ **Lógica Mejorada:**
1. **Prioridad Correcta:** Las combinaciones se evalúan del mayor al menor puntaje
2. **Detección Precisa:** Cada combinación tiene su algoritmo específico
3. **Manejo del As (\*):** Funciona correctamente como 1 o 14
4. **Debug Mejorado:** Información detallada en consola para verificar

## 🎯 Ejemplo de Caso Corregido

**Caso Problemático Anterior:**
- **Mano:** 11🔥, 12🔥, 13🔥, *🔥, 13🌩️
- **Error Anterior:** "Dúo Mortal" (50 pts) - detectaba solo la pareja de 13s
- **✅ Corrección:** "El Impar" (300 pts) - 4 cartas 🔥 + 1 carta 🌩️

**Verificación con Debug:**
```
Cartas: [11🔥, 12🔥, 13🔥, *🔥, 13🌩️]
Conteo de palos: {🔥: 4, 🌩️: 1}
Conteo de valores: {11: 1, 12: 1, 13: 2, 14: 1}
Evaluación: {type: 'el_impar', points: 300}
```

## 🧠 Sistema de Consejos Estratégicos Mejorado

### **Consejos Contextuales:**
- **Ronda 1/3:** Más agresivo, permite mayor riesgo
- **Ronda 2/3:** Equilibrio entre riesgo y seguridad  
- **Ronda 3/3:** Conservador, enfoque en asegurar puntos

### **Análisis Específico:**
- **Detección de patrones:** Identifica colores parciales, escaleras incompletas
- **Probabilidades dinámicas:** Calculadas según la mano actual y cartas descartadas
- **Recomendaciones de descarte:** Específicas según el potencial de la mano

### **Umbrales de Decisión:**
- **≥5000 pts:** ¡RETÍRATE INMEDIATAMENTE!
- **≥1500 pts:** Retírate, excelente ganancia
- **≥800 pts:** Considera retirarte o un descarte muy conservador
- **≥300 pts:** Equilibrio riesgo/recompensa según la ronda
- **≥50 pts:** Evalúa cuidadosamente el riesgo
- **≤10 pts:** Estrategia agresiva necesaria

## 🎯 Características del Sistema

### Análisis Estratégico
- Evaluación automática de la mano actual
- Cálculo de probabilidades de mejora
- Recomendaciones basadas en riesgo/recompensa
- Sistema de 3 rondas opcionales

### Interfaz Visual
- Colores dinámicos según el palo seleccionado
- Destacado de la combinación actual
- Indicadores visuales de cartas descartadas
- Diseño responsivo

### Funcionalidades
- **Analizar Mano:** Evaluación instantánea
- **Siguiente Ronda:** Descarte y nuevas cartas
- **Retirarse:** Asegurar puntos actuales
- **Nuevo Juego:** Reiniciar completamente

## 🚀 Uso

1. **Abrir** `index.html` en un navegador web
2. **Introducir** los valores de tus 5 cartas (2-13 o *)
3. **Seleccionar** el palo de cada carta
4. **Marcar** las cartas que quieres descartar
5. **Analizar** para recibir consejos estratégicos
6. **Decidir** si continuar o retirarte

## 🔍 Ejemplo de Uso Corregido

**Mano:** 11🔥, 12🔥, 13🔥, *🔥, 13🌩️
- **Palos:** 4 cartas 🔥, 1 carta 🌩️
- **Detección:** El Impar (300 PTS) ✅
- **Consejo:** "Mano sólida con El Impar (300 puntos). Puedes arriesgar un poco más o retirarte con una ganancia decente."

## 🛠️ Tecnologías

- **HTML5:** Estructura semántica
- **CSS3:** Diseño con gradientes y animaciones
- **JavaScript ES6+:** Lógica de juego y análisis
- **Responsive Design:** Compatible con móviles y desktop
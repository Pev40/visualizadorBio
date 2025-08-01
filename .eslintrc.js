module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Reglas de calidad de código
    'no-unused-vars': 'warn',
    'no-console': 'off', // Permitir console.log para debugging
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Reglas de estilo
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    
    // Reglas de buenas prácticas
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'arrow-spacing': 'error',
    'no-duplicate-imports': 'error',
    
    // Reglas de complejidad
    'complexity': ['warn', 10],
    'max-depth': ['warn', 4],
    'max-lines': ['warn', 300],
    'max-params': ['warn', 4],
    
    // Reglas de seguridad
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error'
  },
  globals: {
    // Variables globales de jQuery
    '$': 'readonly',
    'jQuery': 'readonly',
    
    // Variables globales de MSABrowser
    'MSABrowser': 'readonly',
    'MSAProcessor': 'readonly',
    
    // Variables globales de la aplicación
    'AlignmentScorer': 'readonly'
  }
}; 
// En HospitalSimulator.js, mejorar handleDecision:
handleDecision = (decisionType) => {
  const consequences = {
    'isolate': {
      message: '✅ Red aislada - ransomware contenido',
      score: 50,
      patientEffect: 'Algunos pacientes sin monitoreo → riesgo aumento',
      timeCost: '15min para restablecer sistemas alternativos'
    },
    'backup': {
      message: '✅ Energía reserva activada en UCI',
      score: 30, 
      patientEffect: 'Quirófanos cancelados - impacto económico',
      financialImpact: '$250,000 pérdidas'
    },
    'evacuate': {
      message: '✅ Evacuación UCI iniciada',
      score: 70,
      patientEffect: '2 pacientes murieron durante transporte',
      legalImpact: 'Demandas por negligencia'
    }
  };
  
  // Aplicar consecuencias
  const result = consequences[decisionType];
  this.setState({
    score: this.state.score + result.score,
    decisions: [...this.state.decisions, {
      type: decisionType,
      time: this.formatTime(this.state.time),
      consequence: result
    }]
  });
};

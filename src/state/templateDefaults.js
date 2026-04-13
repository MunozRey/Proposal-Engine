export function getTemplateDefaults(language = 'en') {
  const isEs = language === 'es';

  if (isEs) {
    return {
      coverBadge: 'PROPUESTA DE COLABORACION',
      coverLine1: 'Propuesta para',
      coverLine3: 'para',
      productTitle: 'tu producto o servicio',
      introText:
        'La solucion se activa en el momento de la calificacion crediticia dentro del flujo del cliente. El usuario completa el consentimiento de Open Banking en una pantalla con la marca del cliente.',
      setupFee: 'EUR 1.000',
      steps: [
        {
          num: '01',
          title: 'Recepcion de IBAN y datos del solicitante',
          desc: 'Envia el IBAN y los datos del solicitante dentro de tu flujo actual. La experiencia visual se mantiene para el usuario final.',
        },
        {
          num: '02',
          title: 'Conexion Open Banking para verificar ingresos y solvencia',
          desc: 'El solicitante recibe un enlace seguro para completar el flujo SCA. La pantalla muestra solo la identidad de tu marca.',
        },
        {
          num: '03',
          title: 'Resultado de elegibilidad en tiempo real',
          desc: 'El sistema devuelve: Elegible / No elegible / Revision manual, ingreso neto, ratio de esfuerzo y perfil de riesgo.',
        },
      ],
      featuresL: [
        'Resultado de elegibilidad con nivel de confianza',
        'Ingreso neto mensual verificado via Open Banking',
        'Cobertura en 19 paises europeos (~2.000 bancos)',
      ],
      featuresR: [
        'Deteccion de anomalias y patrones de riesgo',
        'Ratio de esfuerzo, DTI y perfil de riesgo',
        'API REST documentada + widget white-label',
      ],
      plans: [
        {
          name: 'Starter',
          price: '€49',
          per: '/mes',
          verifs: '50',
          avg: '€0,98',
          extra: '€1,20',
          rec: false,
        },
        {
          name: 'Growth',
          price: '€99',
          per: '/mes',
          verifs: '120',
          avg: '€0,825',
          extra: '€1,00',
          rec: true,
        },
        {
          name: 'Enterprise',
          price: '€199',
          per: '/mes',
          verifs: '300',
          avg: '€0,663',
          extra: '€0,85',
          rec: false,
        },
        {
          name: 'Custom',
          price: 'Custom',
          per: '',
          verifs: '300+',
          avg: 'Segun volumen',
          extra: 'Segun volumen',
          rec: false,
        },
      ],
      leads: {
        overviewIntro:
          'Captamos y entregamos leads verificados via Open Banking. Proponemos tres modelos de colaboracion adaptados a tu estrategia comercial y nivel de riesgo compartido.',
        cplIntro:
          'Fee fijo por lead entregado con Open Banking completado. Precio predecible sin riesgo de conversion para el cliente.',
        cplLeads: [
          {
            type: 'Lead Cualificado',
            price: '€12',
            desc: 'Open Banking completado · ingresos y solvencia verificados · perfil de riesgo basico',
          },
          {
            type: 'Lead Premium',
            price: '€20',
            desc: 'Scoring completo · ratio de esfuerzo · perfil de riesgo detallado',
          },
        ],
        cplFeatures: [
          'Lead entregado solo si el flujo OB se completa',
          'Ingreso neto mensual verificado',
          'Ratio de esfuerzo y DTI calculados',
          'Nombre, IBAN y datos de contacto validados',
        ],
        cplCalcTitle: 'Ejemplo de calculo mensual',
        cplCalcText:
          '50 Leads Cualificados × €12 = €600\n20 Leads Premium × €20 = €400\nTotal estimado: €1.000/mes',
        cplNotes: [
          'Lead entregado solo si el flujo de Open Banking se completa correctamente.',
          'Facturacion mensual por leads realmente entregados.',
          'Volumen minimo mensual y condiciones negociables.',
        ],
        cpaIntro:
          'Sin coste hasta formalizacion. Fee fijo por tramos segun importe del prestamo mas comision sobre el importe aprobado.',
        cpaTramos: [
          { importe: 'Hasta €5.000', fee: '€30' },
          { importe: '€5.001 – €15.000', fee: '€60' },
          { importe: '€15.001 – €30.000', fee: '€100' },
          { importe: 'Mas de €30.000', fee: '€150' },
        ],
        cpaCommission: '1.5%',
        cpaCommissionBase: 'importe aprobado',
        cpaFeatures: [
          'Sin coste si el lead no convierte',
          'Incentivos alineados entre cliente y proveedor',
          'Fee por tramos segun importe formalizado',
          'Maxima eficiencia en coste de adquisicion',
        ],
        cpaCalcTitle: 'Ejemplo de calculo',
        cpaCalcText:
          'Prestamo de €10.000 aprobado:\nFee fijo por tramo: €60\nComision 1.5% × €10.000 = €150\nTotal por operacion: €210',
        cpaNotes: [
          'Fee debido en el momento de la formalizacion del prestamo.',
          'Comision calculada sobre el importe neto formalizado.',
          'No aplica si la solicitud es rechazada o no se formaliza.',
        ],
        hybridIntro:
          'Combinacion de CPL base reducido y bonus CPA en formalizacion. Cubre costes de adquisicion y premia conversion real. Ideal para alto volumen con buena conversion.',
        hybridCPLPrice: '€8',
        hybridCPAFee: '€50',
        hybridCPAComm: '0.5%',
        hybridFeatures: [
          'El CPL base cubre costes garantizados de adquisicion',
          'El bonus CPA recompensa la conversion real del lead',
          'Modelo transparente y predecible para ambas partes',
          'Ideal para partners con buena tasa de conversion',
        ],
        hybridCalcTitle: 'Ejemplo de calculo',
        hybridCalcText:
          'Lead captado: €8 (CPL base)\nPrestamo €10.000 formalizado:\n  Bonus CPA fijo: €50\n  Comision 0.5% × €10.000 = €50\nTotal por lead convertido: €158',
        hybridNotes: [
          'El CPL base se factura al entregar el lead verificado.',
          'El bonus CPA se factura al formalizar la operacion.',
          'Comision calculada sobre el importe neto formalizado.',
        ],
      },
    };
  }

  return {
    coverBadge: 'PARTNERSHIP PROPOSAL',
    coverLine1: 'Proposal for',
    coverLine3: 'for',
    productTitle: 'your product or service',
    introText:
      'The solution activates at the point of credit qualification in the client flow. The user completes Open Banking consent on a fully client-branded screen.',
    setupFee: 'EUR 1.000',
    steps: [
      {
        num: '01',
        title: 'IBAN and applicant data received',
        desc: 'Send the IBAN and applicant details within your existing flow. The visual experience remains unchanged for the end user.',
      },
      {
        num: '02',
        title: 'Open Banking connection for income and solvency verification',
        desc: 'The applicant receives a secure link to complete the SCA flow. The screen shows only your brand identity.',
      },
      {
        num: '03',
        title: 'Real-time credit eligibility result',
        desc: 'The system returns: Eligible / Not eligible / Manual review, net income, effort ratio, and risk profile.',
      },
    ],
    featuresL: [
      'Eligibility result with confidence level',
      'Monthly net income verified via Open Banking',
      'Coverage in 19 European countries (~2,000 banks)',
    ],
    featuresR: [
      'Anomaly detection and risk pattern analysis',
      'Effort ratio, DTI, and risk profile',
      'Documented REST API + white-label widget',
    ],
    plans: [
      {
        name: 'Starter',
        price: '€49',
        per: '/month',
        verifs: '50',
        avg: '€0.98',
        extra: '€1.20',
        rec: false,
      },
      {
        name: 'Growth',
        price: '€99',
        per: '/month',
        verifs: '120',
        avg: '€0.825',
        extra: '€1.00',
        rec: true,
      },
      {
        name: 'Enterprise',
        price: '€199',
        per: '/month',
        verifs: '300',
        avg: '€0.663',
        extra: '€0.85',
        rec: false,
      },
      {
        name: 'Custom',
        price: 'Custom',
        per: '',
        verifs: '300+',
        avg: 'Volume-based',
        extra: 'Volume-based',
        rec: false,
      },
    ],
    leads: {
      overviewIntro:
        'The solution captures and delivers verified leads via Open Banking. We propose three collaboration models adapted to your commercial strategy and shared risk level.',
      cplIntro:
        'Fixed fee per delivered lead with completed Open Banking. Predictable pricing with no conversion risk for the client.',
      cplLeads: [
        {
          type: 'Qualified Lead',
          price: '€12',
          desc: 'Open Banking completed · income and solvency verified · basic risk profile',
        },
        {
          type: 'Premium Lead',
          price: '€20',
          desc: 'Full scoring · effort ratio · detailed risk profile',
        },
      ],
      cplFeatures: [
        'Lead delivered only if OB flow is completed',
        'Monthly net income verified',
        'Effort ratio and DTI calculated',
        'Name, IBAN, and contact details validated',
      ],
      cplCalcTitle: 'Monthly calculation example',
      cplCalcText:
        '50 Qualified Leads × €12 = €600\n20 Premium Leads × €20 = €400\nTotal estimated: €1,000/month',
      cplNotes: [
        'Lead delivered only if the Open Banking flow is completed successfully.',
        'Monthly billing for actually delivered leads.',
        'Minimum monthly volume and conditions are negotiable.',
      ],
      cpaIntro:
        'No cost until formalization. Fixed tiered fee based on loan amount plus commission on the approved amount.',
      cpaTramos: [
        { importe: 'Up to €5,000', fee: '€30' },
        { importe: '€5,001 – €15,000', fee: '€60' },
        { importe: '€15,001 – €30,000', fee: '€100' },
        { importe: 'Over €30,000', fee: '€150' },
      ],
      cpaCommission: '1.5%',
      cpaCommissionBase: 'approved amount',
      cpaFeatures: [
        'No cost if the lead does not convert',
        'Full incentive alignment between client and provider',
        'Tiered fee based on formalized amount',
        'Maximum efficiency in acquisition cost',
      ],
      cpaCalcTitle: 'Calculation example',
      cpaCalcText:
        'Loan €10,000 approved:\nFixed tier fee: €60\nCommission 1.5% × €10,000 = €150\nTotal per deal: €210',
      cpaNotes: [
        'Fee due at the time of loan formalization.',
        'Commission calculated on the net formalized amount.',
        'Not applicable if the application is rejected or not formalized.',
      ],
      hybridIntro:
        'Reduced base CPL plus CPA bonus upon formalization. Covers acquisition costs and rewards real conversion. Ideal model for high volume with a good conversion rate.',
      hybridCPLPrice: '€8',
      hybridCPAFee: '€50',
      hybridCPAComm: '0.5%',
      hybridFeatures: [
        'Base CPL covers guaranteed acquisition costs',
        'CPA bonus rewards real lead conversion',
        'Transparent and predictable model for both parties',
        'Ideal for partners with a high conversion rate',
      ],
      hybridCalcTitle: 'Calculation example',
      hybridCalcText:
        'Lead captured: €8 (base CPL)\nLoan €10,000 formalized:\n  Fixed CPA bonus: €50\n  Commission 0.5% × €10,000 = €50\nTotal per converted lead: €158',
      hybridNotes: [
        'Base CPL is billed at verified lead delivery.',
        'CPA bonus is billed upon deal formalization.',
        'Commission calculated on the net formalized amount.',
      ],
    },
  };
}

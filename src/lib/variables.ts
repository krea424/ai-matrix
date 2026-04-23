import { FeasibilityInputs, ImpactInputs } from './engine'

export interface VariableMeta {
  key: string
  label: string
  description: string
  scaleLabels: string[]
  hasMalus?: boolean
  malusNote?: string
}

export const feasibilityVariables: VariableMeta[] = [
  {
    key: 'technicalMaturity',
    label: 'Maturità tecnica',
    description:
      'Valuta il livello di maturità della tecnologia AI considerata. Si basa sul grado di sviluppo e adozione della soluzione nel mercato.',
    scaleLabels: ['Ricerca', 'Beta', 'Disponibilità iniziale', 'Disponibilità diffusa', 'Mainstream'],
  },
  {
    key: 'infrastructure',
    label: 'Coerenza infrastrutturale',
    description:
      "Esprime il grado di compatibilità tra l'infrastruttura IT esistente e quella necessaria per l'implementazione della soluzione AI.",
    scaleLabels: ['Ostile', 'Sfavorevole', 'Neutra', 'Abilitante', 'Compatibilità completa'],
    hasMalus: true,
    malusNote: 'Peso dimezzato se valore ≤ 2',
  },
  {
    key: 'dataConsistency',
    label: 'Coerenza dei dati',
    description:
      "Misura la qualità, disponibilità e coerenza dei dati necessari per alimentare l'applicazione AI.",
    scaleLabels: ['No coerenza', 'Sfavorevole', 'Neutra', 'Abilitante', 'Compatibilità completa'],
  },
  {
    key: 'regulation',
    label: 'Regolamentazione',
    description:
      "Valuta il contesto normativo e regolamentare in relazione all'adozione della soluzione AI nel settore di riferimento.",
    scaleLabels: ['Ostile', 'Sfavorevole', 'Neutra', 'Abilitante', 'Compatibilità completa'],
    hasMalus: true,
    malusNote: 'Peso dimezzato se valore ≤ 2',
  },
  {
    key: 'ethics',
    label: 'Implicazioni etiche e di trasparenza',
    description:
      "Esprime il livello di rischio etico e di trasparenza associato all'implementazione della soluzione AI.",
    scaleLabels: ['Limitazioni bloccanti', 'Rischi bassi', 'Neutrale', 'Nessun blocco', 'Abilitante'],
  },
  {
    key: 'finance',
    label: 'Compatibilità finanziaria',
    description:
      "Valuta la sostenibilità economica dell'investimento necessario per l'implementazione della soluzione AI.",
    scaleLabels: ['Non compatibile', 'Bassa', 'Media', 'Alta', 'Compatibilità completa'],
  },
  {
    key: 'competences',
    label: 'Disponibilità di competenze',
    description:
      "Misura la disponibilità interna ed esterna delle competenze necessarie per implementare e gestire l'applicazione AI.",
    scaleLabels: ['Assente', 'Limitata', 'Moderata', 'Diffusa', 'Mainstream'],
    hasMalus: true,
    malusNote: 'Peso dimezzato se valore ≤ 2',
  },
]

export const impactVariables: VariableMeta[] = [
  {
    key: 'businessConsistency',
    label: 'Coerenza di business',
    description:
      "Esprime il livello di coerenza tra l'applicazione e gli obiettivi dell'azienda, sia in termini di obiettivi strategici di alto livello che di input aziendali bottom-up. Questa valutazione si basa sugli input identificati nello step 2.",
    scaleLabels: ['Nessun impatto', 'Limitato', 'Moderato', 'Alto', 'Molto alto'],
  },
  {
    key: 'economicImpact',
    label: 'Impatto economico',
    description:
      "Esprime l'impatto positivo atteso in termini economici, sia legato all'aumento previsto dei ricavi che alla riduzione dei costi. È importante adottare una prospettiva a breve termine, minimizzando il rischio di basare la valutazione solo sul \"potenziale\" e riducendo le ipotesi.",
    scaleLabels: ['Nessun impatto', 'Limitato', 'Moderato', 'Alto', 'Molto alto'],
  },
  {
    key: 'organizationalImpact',
    label: 'Impatto organizzativo (interno)',
    description:
      "Esprime l'impatto sulle strutture e sui processi interni dopo l'adozione dell'applicazione di intelligenza artificiale. Come per l'impatto economico, la valutazione dovrebbe basarsi su una prospettiva a breve termine e ridurre per quanto possibile le ipotesi.",
    scaleLabels: ['Nessun impatto', 'Limitato', 'Moderato', 'Alto', 'Molto alto'],
  },
  {
    key: 'clientImpact',
    label: 'Impatto sui clienti',
    description:
      "Esprime l'impatto sull'esperienza dei clienti. A seconda dell'applicazione valutata, la valutazione potrebbe basarsi esclusivamente sull'impatto organizzativo interno (variabile precedente), solo sull'impatto sui clienti, o su entrambi. (ad esempio, questa variabile potrebbe essere 'disattivata').",
    scaleLabels: ['Nessun impatto', 'Limitato', 'Moderato', 'Alto', 'Molto alto'],
  },
  {
    key: 'learningImpact',
    label: "Impatto sull'apprendimento aziendale",
    description:
      "Valuta quanto l'adozione della soluzione AI contribuisce alla crescita delle competenze e alla capacità di apprendimento interno dell'organizzazione.",
    scaleLabels: ['Nessun impatto', 'Limitato', 'Moderato', 'Alto', 'Molto alto'],
    hasMalus: true,
    malusNote: 'Peso dimezzato se somma altre variabili ≤ 6',
  },
]

export type FeasibilityKey = keyof FeasibilityInputs
export type ImpactKey = keyof ImpactInputs

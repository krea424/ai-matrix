import { describe, it, expect } from 'vitest'
import { calculateFeasibility, calculateImpact } from '../engine'

describe('Bocconi Calculation Engine', () => {
  describe('calculateFeasibility', () => {
    it('should return 35 for all maximum scores', () => {
      const inputs = {
        technicalMaturity: 5,
        infrastructure: 5,
        dataConsistency: 5,
        regulation: 5,
        ethics: 5,
        finance: 5,
        competences: 5,
      }
      expect(calculateFeasibility(inputs)).toBe(35)
    })

    it('should apply 50% malus to Infrastructure, Regulation, and Competences if score <= 2', () => {
      const inputs = {
        technicalMaturity: 5,
        infrastructure: 2, // malus: 2 * 0.5 = 1
        dataConsistency: 5,
        regulation: 2, // malus: 2 * 0.5 = 1
        ethics: 5,
        finance: 5,
        competences: 2, // malus: 2 * 0.5 = 1
      }
      // 5 + 1 + 5 + 1 + 5 + 5 + 1 = 23
      expect(calculateFeasibility(inputs)).toBe(23)
    })

    it('should not apply malus if scores are > 2', () => {
      const inputs = {
        technicalMaturity: 3,
        infrastructure: 3,
        dataConsistency: 3,
        regulation: 3,
        ethics: 3,
        finance: 3,
        competences: 3,
      }
      expect(calculateFeasibility(inputs)).toBe(21)
    })
  })

  describe('calculateImpact', () => {
    it('should return 25 for all maximum scores', () => {
      const inputs = {
        businessConsistency: 5,
        economicImpact: 5,
        organizationalImpact: 5,
        clientImpact: 5,
        learningImpact: 5,
      }
      expect(calculateImpact(inputs)).toBe(25)
    })

    it('should halve Learning Impact if sum of others <= 6', () => {
      const inputs = {
        businessConsistency: 1,
        economicImpact: 1,
        organizationalImpact: 1,
        clientImpact: 1,
        learningImpact: 4, // sum others = 4 <= 6, so 4 * 0.5 = 2
      }
      // 4 + 2 = 6
      expect(calculateImpact(inputs)).toBe(6)
    })

    it('should not halve Learning Impact if sum of others > 6', () => {
      const inputs = {
        businessConsistency: 2,
        economicImpact: 2,
        organizationalImpact: 2,
        clientImpact: 1,
        learningImpact: 4, // sum others = 7 > 6
      }
      // 7 + 4 = 11
      expect(calculateImpact(inputs)).toBe(11)
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PaymentService } from './payment.service'
import { PaymentMethod } from '../models/payment.model'
import { Order } from '../models/order.model'

describe('PaymentService', () => {
  let service: PaymentService

  beforeEach(() => {
    service = new PaymentService()
  })

  describe('buildPaymentMethod', () => {
    it('returns all payment methods if totalPrice <= 300000', () => {
      const result = service.buildPaymentMethod(250000)
      expect(result).toBe([
        PaymentMethod.CREDIT,
        PaymentMethod.PAYPAY,
        PaymentMethod.AUPAY,
      ].join(','))
    })

    it('excludes AUPAY if totalPrice > 300000', () => {
      const result = service.buildPaymentMethod(350000)
      expect(result).toBe([
        PaymentMethod.CREDIT,
        PaymentMethod.PAYPAY,
      ].join(','))
    })

    it('excludes PAYPAY and AUPAY if totalPrice > 500000', () => {
      const result = service.buildPaymentMethod(600000)
      expect(result).toBe(PaymentMethod.CREDIT)
    })
  })

  describe('payViaLink', () => {
    beforeEach(() => {
      vi.stubGlobal('window', {
        open: vi.fn(),
      })
    })

    it('opens payment link in new tab', () => {
      const order: Order = {
        id: 'order123',
        totalPrice: 1000,
        items: [],
        paymentMethod: PaymentMethod.CREDIT,
      }

      service.payViaLink(order)

      expect(window.open).toHaveBeenCalledWith(
        'https://payment.example.com/pay?orderId=order123',
        '_blank'
      )
    })
  })
})

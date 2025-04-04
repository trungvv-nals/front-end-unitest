import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OrderService } from './order.service'
import { PaymentService } from './payment.service'
import { Order } from '../models/order.model'

globalThis.fetch = vi.fn()

const mockPaymentService = {
  buildPaymentMethod: vi.fn(),
  payViaLink: vi.fn(),
} as unknown as PaymentService

const sampleOrder: Partial<Order> = {
  items: [
    { id: '1', productId: 'p1', price: 100, quantity: 2 },
    { id: '2', productId: 'p2', price: 50, quantity: 1 },
  ]
}

describe('OrderService', () => {
  let orderService: OrderService

  beforeEach(() => {
    vi.clearAllMocks()
    orderService = new OrderService(mockPaymentService)
  })

  it('throws error if no order items', async () => {
    await expect(orderService.process({})).rejects.toThrow('Order items are required')
  })

  it('throws error if item has invalid price or quantity', async () => {
    const invalidOrder: Partial<Order> = {
      items: [
        { id: '1', productId: 'p1', price: 0, quantity: 1 },
      ]
    }
    await expect(orderService.process(invalidOrder)).rejects.toThrow('Order items are invalid')
  })

  it('applies coupon if valid', async () => {
    const coupon = { id: 'c1', discount: 50 }
    ;(fetch as any).mockResolvedValueOnce({
      json: async () => coupon
    })

    ;(fetch as any).mockResolvedValueOnce({
      json: async () => ({ id: '123', totalPrice: 200 })
    })

    mockPaymentService.buildPaymentMethod = vi.fn().mockReturnValue('CREDIT')

    const orderWithCoupon: Partial<Order> = {
      ...sampleOrder,
      couponId: 'c1'
    }

    await orderService.process(orderWithCoupon)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/coupons/c1'))
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/order'), expect.any(Object))
    expect(mockPaymentService.payViaLink).toHaveBeenCalled()
  })

  it('sets totalPrice = 0 if coupon discount is greater than total', async () => {
    const coupon = { id: 'big-discount', discount: 9999 }

    ;(fetch as any).mockResolvedValueOnce({
      json: async () => coupon
    })

    const mockCreatedOrder = { id: '999', totalPrice: 0 }
    ;(fetch as any).mockResolvedValueOnce({
      json: async () => mockCreatedOrder
    })
  
    mockPaymentService.buildPaymentMethod = vi.fn().mockReturnValue('PAYPAY')
  
    const orderWithHeavyCoupon: Partial<Order> = {
      items: [
        { id: '1', productId: 'p1', price: 100, quantity: 1 },
      ],
      couponId: 'big-discount',
    }
  
    await orderService.process(orderWithHeavyCoupon)

    const postCall = (fetch as any).mock.calls.find(call =>
      call[0].includes('/order')
    )
  
    const bodySent = JSON.parse(postCall[1].body)
  
    expect(bodySent.totalPrice).toBe(0)
    expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(0)
    expect(mockPaymentService.payViaLink).toHaveBeenCalledWith(mockCreatedOrder)
  })

  it('throws error if coupon is invalid (not found)', async () => {
    (fetch as any).mockResolvedValueOnce({ json: async () => null })

    const orderWithInvalidCoupon: Partial<Order> = {
      ...sampleOrder,
      couponId: 'invalid'
    }

    await expect(orderService.process(orderWithInvalidCoupon)).rejects.toThrow('Invalid coupon')
  })

  it('calls paymentService with correct total price', async () => {
    (fetch as any).mockResolvedValueOnce({ json: async () => null })
    ;(fetch as any).mockResolvedValueOnce({
      json: async () => ({ id: '123', totalPrice: 250 })
    })

    mockPaymentService.buildPaymentMethod = vi.fn().mockReturnValue('CREDIT')

    await orderService.process(sampleOrder)

    expect(mockPaymentService.buildPaymentMethod).toHaveBeenCalledWith(250)
    expect(mockPaymentService.payViaLink).toHaveBeenCalled()
  })
})

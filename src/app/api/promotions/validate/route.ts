import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PromotionService } from '@/domain/services/promotion-service';
import { CartService } from '@/domain/services/cart-service';

const validatePromotionSchema = z.object({
  promotionCode: z.string().min(1),
  cartId: z.string().optional(),
  userId: z.string().optional(),
  cartValue: z.number().min(0),
  cartItems: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
    categoryId: z.string().optional(),
    tags: z.array(z.string()).optional()
  }))
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = validatePromotionSchema.parse(body);

    // TODO: Get promotion from database by code
    // For now, create a mock promotion for demonstration
    const mockPromotion = {
      id: 'promo_1',
      name: 'Descuento de Verano',
      code: validatedData.promotionCode,
      type: 'coupon' as const,
      conditions: [
        {
          type: 'min_purchase' as const,
          value: 50000,
          operator: 'gte' as const
        }
      ],
      actions: [
        {
          type: 'percentage_discount' as const,
          value: 15,
          target: 'cart_total' as const
        }
      ],
      priority: 1,
      startDate: Date.now() - 86400000, // Yesterday
      endDate: Date.now() + 86400000 * 7, // Next week
      maxUses: 100,
      maxUsesPerUser: 1,
      stackable: false,
      isActive: true,
      usage: {
        totalUses: 25,
        userUses: validatedData.userId ? { [validatedData.userId]: 0 } : {},
        lastUsed: Date.now() - 3600000,
        revenue: 250000
      },
      metadata: {},
      createdAt: Date.now() - 86400000 * 7,
      updatedAt: Date.now()
    };

    // Create promotion entity
    const { Promotion } = await import('@/domain/entities/promotion');
    const promotion = new Promotion(
      mockPromotion.id,
      mockPromotion.name,
      'Descuento especial de verano',
      mockPromotion.code,
      mockPromotion.type,
      mockPromotion.conditions,
      mockPromotion.actions,
      mockPromotion.priority,
      mockPromotion.startDate,
      mockPromotion.endDate,
      mockPromotion.maxUses,
      mockPromotion.maxUsesPerUser,
      mockPromotion.stackable,
      mockPromotion.isActive,
      mockPromotion.usage,
      mockPromotion.metadata,
      mockPromotion.createdAt,
      mockPromotion.updatedAt
    );

    // Check if promotion code exists and is valid
    if (validatedData.promotionCode !== mockPromotion.code) {
      return NextResponse.json({
        success: false,
        error: 'Código de promoción no válido',
        errorCode: 'INVALID_CODE'
      }, { status: 400 });
    }

    // Validate promotion
    if (!promotion.isValidNow()) {
      return NextResponse.json({
        success: false,
        error: 'Esta promoción ha expirado o no está activa',
        errorCode: 'PROMOTION_EXPIRED'
      }, { status: 400 });
    }

    if (validatedData.userId && !promotion.canUserUse(validatedData.userId)) {
      return NextResponse.json({
        success: false,
        error: 'Ya has usado esta promoción el máximo número de veces',
        errorCode: 'USAGE_LIMIT_EXCEEDED'
      }, { status: 400 });
    }

    // Create mock cart for validation
    const { Cart } = await import('@/domain/entities/cart');
    const { Money } = await import('@/domain/value-objects/money');

    const cartValue = new Money(validatedData.cartValue);
    const cart = new Cart('temp_cart', {
      subtotal: cartValue,
      tax: Money.zero(),
      total: cartValue,
      currency: 'CLP'
    });

    // Add cart items
    validatedData.cartItems.forEach(item => {
      cart.addItem(item.productId, item.quantity, new Money(item.price));
    });

    // Create mock user if userId provided
    let user = null;
    if (validatedData.userId) {
      const { User } = await import('@/domain/entities/user');
      user = new User(
        validatedData.userId,
        'Test User',
        'test@example.com',
        undefined, // phone
        undefined, // address
        {
          language: 'es-CL',
          currency: 'CLP',
          notifications: true
        },
        'customer',
        Date.now() - 86400000 * 30, // Created 30 days ago
        Date.now()
      );
    }

    // Find applicable promotions
    const promotionResults = PromotionService.findApplicablePromotions(
      cart,
      user,
      [promotion]
    );

    const applicableResult = promotionResults.find(result => result.applied);

    if (!applicableResult) {
      const failedResult = promotionResults[0];
      return NextResponse.json({
        success: false,
        error: failedResult.description,
        errorCode: failedResult.reason?.toUpperCase() || 'CONDITIONS_NOT_MET'
      }, { status: 400 });
    }

    // Calculate final pricing
    const originalPrice = new Money(validatedData.cartValue);
    const finalPrice = originalPrice.subtract(applicableResult.discount);
    const savingsPercentage = validatedData.cartValue > 0
      ? (applicableResult.discount.amount / validatedData.cartValue) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        promotionId: promotion.id,
        promotionName: promotion.name,
        discountAmount: applicableResult.discount.amount,
        finalPrice: finalPrice.amount,
        originalPrice: validatedData.cartValue,
        savingsPercentage: Math.round(savingsPercentage * 100) / 100,
        description: applicableResult.description,
        conditions: promotion.conditions,
        expiresAt: promotion.endDate,
        remainingUses: promotion.getRemainingUses(),
        userRemainingUses: validatedData.userId ? promotion.getUserRemainingUses(validatedData.userId) : -1
      }
    });

  } catch (error) {
    console.error('Promotion validation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
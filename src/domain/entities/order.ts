import { BaseEntity } from './base-entity';
import { Order as OrderType, OrderItem, OrderPricing, OrderStatus, PaymentStatus, ContactInfo, Address } from '../types';

export class Order extends BaseEntity implements OrderType {
  private _orderNumber: string;
  private _userId?: string;
  private _customerInfo: ContactInfo;
  private _shippingAddress: Address;
  private _billingAddress?: Address;

  // Order items
  private _items: OrderItem[];

  // Pricing breakdown
  private _pricing: OrderPricing;

  // Status
  private _status: OrderStatus;
  private _paymentStatus: PaymentStatus;

  // Payment info
  private _paymentMethod?: string;
  private _paymentIntentId?: string;

  // Shipping info
  private _shippingMethod?: string;
  private _trackingNumber?: string;
  private _estimatedDeliveryDate?: number;
  private _shippedAt?: number;
  private _deliveredAt?: number;

  constructor(
    id: string,
    orderNumber: string,
    customerInfo: ContactInfo,
    shippingAddress: Address,
    items: OrderItem[],
    pricing: OrderPricing
  ) {
    super(id);
    this._orderNumber = orderNumber;
    this._customerInfo = customerInfo;
    this._shippingAddress = shippingAddress;
    this._items = items;
    this._pricing = pricing;
    this._status = 'pending';
    this._paymentStatus = 'pending';
  }

  // Getters
  get orderNumber(): string { return this._orderNumber; }
  get userId(): string | undefined { return this._userId; }
  get customerInfo(): ContactInfo { return { ...this._customerInfo }; }
  get shippingAddress(): Address { return { ...this._shippingAddress }; }
  get billingAddress(): Address | undefined { return this._billingAddress ? { ...this._billingAddress } : undefined; }
  get items(): OrderItem[] { return [...this._items]; }
  get pricing(): OrderPricing { return { ...this._pricing }; }
  get status(): OrderStatus { return this._status; }
  get paymentStatus(): PaymentStatus { return this._paymentStatus; }
  get paymentMethod(): string | undefined { return this._paymentMethod; }
  get paymentIntentId(): string | undefined { return this._paymentIntentId; }
  get shippingMethod(): string | undefined { return this._shippingMethod; }
  get trackingNumber(): string | undefined { return this._trackingNumber; }
  get estimatedDeliveryDate(): number | undefined { return this._estimatedDeliveryDate; }
  get shippedAt(): number | undefined { return this._shippedAt; }
  get deliveredAt(): number | undefined { return this._deliveredAt; }

  // Business logic methods
  isPending(): boolean {
    return this._status === 'pending';
  }

  isPaid(): boolean {
    return this._paymentStatus === 'paid';
  }

  isShipped(): boolean {
    return this._status === 'shipped';
  }

  isDelivered(): boolean {
    return this._status === 'delivered';
  }

  isCancelled(): boolean {
    return this._status === 'cancelled';
  }

  canBeCancelled(): boolean {
    return ['pending', 'paid', 'processing'].includes(this._status);
  }

  canBeShipped(): boolean {
    return this._status === 'paid' || this._status === 'processing';
  }

  canBeDelivered(): boolean {
    return this._status === 'shipped';
  }

  getTotalQuantity(): number {
    return this._items.reduce((total, item) => total + item.quantity, 0);
  }

  getItemByProductId(productId: string): OrderItem | undefined {
    return this._items.find(item => item.productId === productId);
  }

  // Business rules validation
  validate(): boolean {
    const rules = this.getBusinessRules();
    return rules.length === 0;
  }

  getBusinessRules(): string[] {
    const errors: string[] = [];

    if (!this._orderNumber.trim()) errors.push('Order number is required');
    if (!this._customerInfo.name.trim()) errors.push('Customer name is required');
    if (!this._customerInfo.email.trim()) errors.push('Customer email is required');
    if (this._items.length === 0) errors.push('Order must have at least one item');
    if (this._pricing.totalAmount <= 0) errors.push('Order total must be greater than 0');

    // Validate shipping address
    if (!this._shippingAddress.street.trim()) errors.push('Shipping street is required');
    if (!this._shippingAddress.city.trim()) errors.push('Shipping city is required');
    if (!this._shippingAddress.postalCode.trim()) errors.push('Shipping postal code is required');
    if (!this._shippingAddress.country.trim()) errors.push('Shipping country is required');

    return errors;
  }

  // Mutation methods
  setUserId(userId: string): void {
    this._userId = userId;
    this.setUpdatedBy('system');
  }

  updateCustomerInfo(customerInfo: ContactInfo): void {
    this._customerInfo = { ...customerInfo };
    this.setUpdatedBy('system');
  }

  updateShippingAddress(address: Address): void {
    this._shippingAddress = { ...address };
    this.setUpdatedBy('system');
  }

  updateBillingAddress(address: Address): void {
    this._billingAddress = { ...address };
    this.setUpdatedBy('system');
  }

  addItem(item: OrderItem): void {
    this._items.push(item);
    this.recalculatePricing();
    this.setUpdatedBy('system');
  }

  removeItem(productId: string): void {
    const index = this._items.findIndex(item => item.productId === productId);
    if (index !== -1) {
      this._items.splice(index, 1);
      this.recalculatePricing();
      this.setUpdatedBy('system');
    }
  }

  updateItemQuantity(productId: string, quantity: number): void {
    const item = this._items.find(item => item.productId === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      item.totalPrice = item.unitPrice * quantity;
      this.recalculatePricing();
      this.setUpdatedBy('system');
    }
  }

  private recalculatePricing(): void {
    const subtotal = this._items.reduce((total, item) => total + item.totalPrice, 0);
    const taxAmount = subtotal * (this._pricing.taxRate / 100);

    this._pricing.subtotal = subtotal;
    this._pricing.taxAmount = taxAmount;
    this._pricing.totalAmount = subtotal + taxAmount + this._pricing.shippingCost - (this._pricing.discountAmount || 0);
  }

  updatePricing(pricing: Partial<OrderPricing>): void {
    this._pricing = { ...this._pricing, ...pricing };
    this.setUpdatedBy('system');
  }

  setStatus(status: OrderStatus): void {
    this._status = status;
    this.setUpdatedBy('system');

    // Set timestamps based on status
    if (status === 'shipped') {
      this._shippedAt = Date.now();
    } else if (status === 'delivered') {
      this._deliveredAt = Date.now();
    }
  }

  setPaymentStatus(status: PaymentStatus): void {
    this._paymentStatus = status;
    this.setUpdatedBy('system');
  }

  setPaymentMethod(method: string): void {
    this._paymentMethod = method;
    this.setUpdatedBy('system');
  }

  setPaymentIntentId(intentId: string): void {
    this._paymentIntentId = intentId;
    this.setUpdatedBy('system');
  }

  setShippingMethod(method: string): void {
    this._shippingMethod = method;
    this.setUpdatedBy('system');
  }

  setTrackingNumber(number: string): void {
    this._trackingNumber = number;
    this.setUpdatedBy('system');
  }

  setEstimatedDeliveryDate(date: number): void {
    this._estimatedDeliveryDate = date;
    this.setUpdatedBy('system');
  }

  markAsPaid(): void {
    this.setPaymentStatus('paid');
    if (this._status === 'pending') {
      this.setStatus('paid');
    }
  }

  markAsShipped(): void {
    if (this.canBeShipped()) {
      this.setStatus('shipped');
    }
  }

  markAsDelivered(): void {
    if (this.canBeDelivered()) {
      this.setStatus('delivered');
    }
  }

  cancel(reason?: string): void {
    if (this.canBeCancelled()) {
      this.setStatus('cancelled');
    }
  }

  toJSON(): Record<string, any> {
    return {
      id: this._id,
      orderNumber: this._orderNumber,
      userId: this._userId,
      customerInfo: this._customerInfo,
      shippingAddress: this._shippingAddress,
      billingAddress: this._billingAddress,
      items: this._items,
      pricing: this._pricing,
      status: this._status,
      paymentStatus: this._paymentStatus,
      paymentMethod: this._paymentMethod,
      paymentIntentId: this._paymentIntentId,
      shippingMethod: this._shippingMethod,
      trackingNumber: this._trackingNumber,
      estimatedDeliveryDate: this._estimatedDeliveryDate,
      shippedAt: this._shippedAt,
      deliveredAt: this._deliveredAt,
      audit: this._audit,
    };
  }
}
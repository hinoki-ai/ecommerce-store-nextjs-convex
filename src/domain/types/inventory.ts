import { ID, Timestamp, InventoryType } from './common';

export interface InventoryLog {
  id: ID;
  productId: ID;
  type: InventoryType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  orderId?: ID;
  userId?: ID;
  audit: {
    createdAt: Timestamp;
  };
}
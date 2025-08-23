"use client"

import { useState } from "react"
import {
  XCircle,
  AlertTriangle,
  MessageSquare,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface OrderCancellationProps {
  orderId: string
  orderNumber: string
  orderStatus: string
  orderTotal: number
  canCancel: boolean
  onCancelSuccess?: () => void
}

const cancellationReasons = [
  { value: "changed_mind", label: "Changed my mind" },
  { value: "found_better_deal", label: "Found a better deal elsewhere" },
  { value: "wrong_item", label: "Ordered the wrong item" },
  { value: "delivery_too_slow", label: "Delivery time is too slow" },
  { value: "duplicate_order", label: "Accidentally placed duplicate order" },
  { value: "payment_issues", label: "Having payment issues" },
  { value: "other", label: "Other (please specify)" }
]

export function OrderCancellation({
  orderId,
  orderNumber,
  orderStatus,
  orderTotal,
  canCancel,
  onCancelSuccess
}: OrderCancellationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const [comments, setComments] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleCancelClick = () => {
    if (!selectedReason) {
      toast.error("Please select a cancellation reason")
      return
    }
    setShowConfirmation(true)
  }

  const handleConfirmCancellation = async () => {
    setIsProcessing(true)

    try {
      // Simulate API call to cancel order
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real implementation, this would call your backend API
      // const response = await cancelOrder({
      //   orderId,
      //   reason: selectedReason,
      //   comments
      // })

      toast.success(`Order ${orderNumber} has been cancelled successfully`)

      setIsOpen(false)
      setShowConfirmation(false)
      onCancelSuccess?.()

    } catch (error) {
      console.error("Error cancelling order:", error)
      toast.error("Failed to cancel order. Please try again or contact support.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setSelectedReason("")
    setComments("")
    setShowConfirmation(false)
    setIsProcessing(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    resetForm()
  }

  if (!canCancel) {
    return (
      <Button variant="outline" size="sm" disabled>
        <XCircle className="h-4 w-4 mr-2" />
        Cannot Cancel
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <XCircle className="h-4 w-4 mr-2" />
          Cancel Order
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Cancel Order {orderNumber}
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Order Summary */}
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Order Total:</span>
                    <span className="font-semibold">${orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="outline">{orderStatus}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Cancellation Reason */}
              <div className="space-y-2">
                <Label htmlFor="cancellation-reason">Reason for cancellation *</Label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {cancellationReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Comments */}
              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments (optional)</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Please provide any additional information about your cancellation..."
                  rows={3}
                />
              </div>

              {/* Important Information */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-orange-800 mb-1">Important Information:</p>
                      <ul className="text-orange-700 space-y-1">
                        <li>• Full refund will be processed within 3-5 business days</li>
                        <li>• Any discounts or coupons used will be restored to your account</li>
                        <li>• You can place a new order at any time</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelClick}
                disabled={!selectedReason}
              >
                Continue Cancellation
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Confirm Cancellation
              </DialogTitle>
              <DialogDescription>
                Please confirm that you want to cancel this order. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800 mb-2">Order to be cancelled:</p>
                      <div className="text-red-700 space-y-1">
                        <p><strong>Order:</strong> {orderNumber}</p>
                        <p><strong>Amount:</strong> ${orderTotal.toFixed(2)}</p>
                        <p><strong>Reason:</strong> {cancellationReasons.find(r => r.value === selectedReason)?.label}</p>
                        {comments && <p><strong>Comments:</strong> {comments}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 mb-1">What happens next:</p>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Order will be cancelled immediately</li>
                        <li>• Refund will be processed within 3-5 business days</li>
                        <li>• You&apos;ll receive a confirmation email</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Go Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmCancellation}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling Order...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Quick Cancel Component for use in order lists
export function QuickCancelButton({
  orderId,
  orderNumber,
  orderStatus,
  orderTotal,
  onCancelSuccess
}: OrderCancellationProps) {
  const canCancel = orderStatus === "processing"

  return (
    <OrderCancellation
      orderId={orderId}
      orderNumber={orderNumber}
      orderStatus={orderStatus}
      orderTotal={orderTotal}
      canCancel={canCancel}
      onCancelSuccess={onCancelSuccess}
    />
  )
}

// Cancellation Status Component
interface CancellationStatusProps {
  orderNumber: string
  cancellationDate: number
  refundAmount: number
  refundStatus: "pending" | "processing" | "completed"
}

export function CancellationStatus({
  orderNumber,
  cancellationDate,
  refundAmount,
  refundStatus
}: CancellationStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      case "pending":
      default:
        return <Clock className="h-4 w-4 text-orange-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      processing: "secondary",
      pending: "outline"
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(refundStatus)}
            <div>
              <p className="font-medium">Order {orderNumber} - Cancelled</p>
              <p className="text-sm text-muted-foreground">
                Cancelled on {new Date(cancellationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          {getStatusBadge(refundStatus)}
        </div>

        <div className="mt-3 pt-3 border-t border-orange-200">
          <div className="flex justify-between items-center text-sm">
            <span>Refund Amount:</span>
            <span className="font-semibold">${refundAmount.toFixed(2)}</span>
          </div>
          {refundStatus === "completed" && (
            <p className="text-xs text-muted-foreground mt-1">
              Refund has been processed to your original payment method
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
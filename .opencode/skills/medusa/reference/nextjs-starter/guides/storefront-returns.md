# Create Order Returns in the Storefront

In this tutorial, you'll learn how to let customers create order returns directly from your storefront.

Medusa supports automated Return Merchandise Authorization (RMA) flows for orders. Customers can create return requests for their orders, and merchants can manage these requests through the Medusa Admin dashboard. Medusa provides the necessary API routes and workflows to handle returns efficiently.

## Summary

In this tutorial, you'll customize the [Next.js Starter Storefront](https://docs.medusajs.com/resources/nextjs-starter) to let customers create return requests for their orders directly from the storefront.

You can follow this tutorial whether you're new to Medusa or an advanced Medusa developer.

![Request return page in storefront](https://res.cloudinary.com/dza7lstvk/image/upload/v1758009041/Medusa%20Resources/CleanShot_2025-09-16_at_10.50.27_2x_g4rwjr.png)

[Example Repository](https://github.com/medusajs/examples/tree/main/returns-storefront): Find the full code of the guide in this repository.

***

## Step 1: Install a Medusa Application

### Prerequisites

- [Node.js v20.19.0+ or v22.12.0+](https://nodejs.org/en/download)
- [Git CLI tool](https://git-scm.com/downloads)
- [PostgreSQL](https://www.postgresql.org/download/)

Start by installing the Medusa application on your machine with the following command:

```bash
npx create-medusa-app@latest
```

You'll first be asked for the project's name. Then, when asked whether you want to install the [Next.js Starter Storefront](https://docs.medusajs.com/resources/nextjs-starter), choose Yes.

Afterward, the installation process will start, which will install the Medusa application as a monorepository in a directory with your project's name. The backend is installed in the `apps/backend` directory, and the Next.js Starter Storefront is installed in the `apps/storefront` directory.

Once the installation finishes successfully, the Medusa Admin dashboard will open with a form to create a new user. Enter the user's credentials and submit the form. Afterward, you can log in with the new user and explore the dashboard.

Check out the [troubleshooting guides](https://docs.medusajs.com/resources/troubleshooting/create-medusa-app-errors) for help.

***

## Step 2: Add Return Server Functions

In this step, you'll add server functions to the Next.js Starter Storefront that let you send requests to the Medusa application for order returns. You'll use these functions later in the storefront pages.

The Next.js Starter Storefront is available in the `apps/storefront` directory of your project:

```bash
cd apps/storefront
```

### List Return Reasons Function

The first function sends a request to the [List Return Reasons](https://docs.medusajs.com/api/store/return-reasons/list-return-reasons) API route. It fetches the available return reasons, which customers can select from when creating a return request.

Create the file `src/lib/data/returns.ts` with the following content:

```ts title="src/lib/data/returns.ts"
"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheOptions } from "@lib/data/cookies"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"

export const listReturnReasons = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("return-reasons")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreReturnReasonListResponse>(`/store/return-reasons`, {
      method: "GET",
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ return_reasons }) => return_reasons)
    .catch((err) => medusaError(err))
}
```

You add the `listReturnReasons` function. It sends a `GET` request to the `/store/return-reasons` API route. The function returns the list of return reasons.

### List Return Shipping Options Function

Next, you'll add a function that sends a request to the [List Shipping Options](https://docs.medusajs.com/api/store/shipping-options/list-shipping-options-for-cart) API route. It fetches the available shipping options for returns, which customers can select from when creating a return request.

In the same `src/lib/data/returns.ts` file, add the following function:

```ts title="src/lib/data/returns.ts"
export const listReturnShippingOptions = async (cartId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("shipping-options")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreShippingOptionListResponse>(`/store/shipping-options`, {
      method: "GET",
      query: {
        cart_id: cartId,
        is_return: true,
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ shipping_options }) => shipping_options)
    .catch((err) => medusaError(err))
}
```

You add the `listReturnShippingOptions` function. It sends a `GET` request to the `/store/shipping-options` API route and returns the shipping options.

The API route accepts the following query parameters:

- `cart_id`: The ID of the cart associated with the order being returned.
- `is_return`: A boolean value set to `true` to retrieve only shipping options for returns.

### Create Return Function

Finally, you'll add a function that sends a request to the [Create Return](https://docs.medusajs.com/api/store/returns/create-return) API route. This creates a return request for an order.

The Create Return API route doesn't require customer authentication, so that guest customers can request a return for their orders. To add access rules to the route, refer to the [Restrict Return Creation guide](https://docs.medusajs.com/resources/commerce-modules/order/secure-return-creation).

In the same `src/lib/data/returns.ts` file, add the following function:

```ts title="src/lib/data/returns.ts"
export const createReturnRequest = async (
  state: {
    success: boolean
    error: string | null
    return: any | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  return: any | null
}> => {
  const orderId = formData.get("order_id") as string
  const items = JSON.parse(formData.get("items") as string)
  const returnShippingOptionId = formData.get("return_shipping_option_id") as string
  const locationId = formData.get("location_id") as string

  if (!orderId || !items || !returnShippingOptionId) {
    return { 
      success: false, 
      error: "Order ID, items, and return shipping option are required", 
      return: null, 
    }
  }

  const headers = await getAuthHeaders()

  return await sdk.client
    .fetch<HttpTypes.StoreReturnResponse>(`/store/returns`, {
      method: "POST",
      body: {
        order_id: orderId,
        items,
        return_shipping: {
          option_id: returnShippingOptionId,
        },
        location_id: locationId,
      },
      headers,
    })
    .then(({ return: returnData }) => ({ 
      success: true, 
      error: null, 
      return: returnData, 
    }))
    .catch((err) => ({ 
      success: false, 
      error: err.message, 
      return: null, 
    }))
}
```

You add the `createReturnRequest` function. It sends a `POST` request to the `/store/returns` API route. The function accepts a `FormData` object containing the order ID, the items to be returned, the selected return shipping option ID, and the stock location ID to which the returned items will be sent.

The function returns an object with the following properties:

- `success`: Whether the return request was created successfully.
- `error`: The error message if the request failed, or `null` if it succeeded.
- `return`: The created return object if the request succeeded, or `null` if it failed.

***

## Step 3: Add Return Utilities

In this step, you'll add a file with utility functions that will mainly help you determine whether an order and its items are eligible for return.

An item is eligible for return if it has been delivered and not yet returned. An order is eligible for return if it has at least one item that's eligible for return.

Create the file `src/lib/util/returns.ts` with the following content:

```ts title="src/lib/util/returns.ts"
import { HttpTypes } from "@medusajs/types"

export type ItemWithDeliveryStatus = HttpTypes.StoreOrderLineItem & {
  deliveredQuantity: number
  returnableQuantity: number
  isDelivered: boolean
  isReturnable: boolean
}

export const calculateReturnableQuantity = (item: HttpTypes.StoreOrderLineItem): number => {
  const deliveredQuantity = item.detail?.delivered_quantity || 0
  const returnRequestedQuantity = item.detail?.return_requested_quantity || 0
  const returnReceivedQuantity = item.detail?.return_received_quantity || 0
  const writtenOffQuantity = item.detail?.written_off_quantity || 0

  return Math.max(
    0, 
    deliveredQuantity - returnRequestedQuantity - returnReceivedQuantity - writtenOffQuantity
  )
}

export const isItemReturnable = (item: HttpTypes.StoreOrderLineItem): boolean => {
  return calculateReturnableQuantity(item) > 0
}

export const hasReturnableItems = (order: HttpTypes.StoreOrder): boolean => {
  return order.items?.some(isItemReturnable) || false
}

export const enhanceItemsWithReturnStatus = (items: HttpTypes.StoreOrderLineItem[]): ItemWithDeliveryStatus[] => {
  return items.map((item) => {
    const deliveredQuantity = item.detail?.delivered_quantity || 0
    const returnableQuantity = calculateReturnableQuantity(item)

    return {
      ...item,
      deliveredQuantity,
      returnableQuantity,
      isDelivered: deliveredQuantity > 0,
      isReturnable: returnableQuantity > 0,
    }
  })
}
```

You add the following utility functions:

- `calculateReturnableQuantity`: Calculates the returnable quantity for a given item. It subtracts quantities that have been returned, requested for return, or written off from the delivered quantity.
- `isItemReturnable`: Determines if a given item is returnable by checking if its returnable quantity is greater than zero.
- `hasReturnableItems`: Checks if an order has at least one item that is returnable.
- `enhanceItemsWithReturnStatus`: Adds return status information to each item in the order. It adds the following properties:
  - `deliveredQuantity`: The quantity of the item that has been delivered.
  - `returnableQuantity`: The quantity of the item that is returnable.
  - `isDelivered`: A boolean indicating whether any quantity of the item has been delivered.
  - `isReturnable`: A boolean indicating whether any quantity of the item is returnable.

You'll use these utility functions later in the storefront pages. They help determine whether to allow customers to create a return request for their order. They also help determine which items can be returned.

***

## Step 4: Add Return Item Selector

In this step, you'll add a component that lets customers select the quantity to return of items from their order. Later, you'll use this component in the return request page.

![Preview of the return item selector on the request return page](https://res.cloudinary.com/dza7lstvk/image/upload/v1758008962/Medusa%20Resources/CleanShot_2025-09-16_at_10.48.41_2x_myun8q.png)

The component displays each item's details. It lets customers specify the quantity to return based on the returnable quantity of the item. It also lets customers select a return reason for the item and provide an optional note.

To create the component, create the file `src/modules/account/components/return-item-selector/index.tsx` with the following content:

```tsx title="src/modules/account/components/return-item-selector/index.tsx"
"use client"

import { HttpTypes } from "@medusajs/types"
import { Badge, IconButton, Select, Textarea } from "@medusajs/ui"
import { Minus, Plus } from "@medusajs/icons"
import Thumbnail from "@modules/products/components/thumbnail"
import { convertToLocale } from "@lib/util/money"
import { ItemWithDeliveryStatus } from "../../../../lib/util/returns"

export type ReturnItemSelection = {
  id: string
  quantity: number
  return_reason_id?: string
  note?: string
}

type ReturnItemSelectorProps = {
  items: ItemWithDeliveryStatus[]
  returnReasons: HttpTypes.StoreReturnReason[]
  onItemSelectionChange: (item: ReturnItemSelection) => void
  selectedItems: ReturnItemSelection[]
}

const ReturnItemSelector: React.FC<ReturnItemSelectorProps> = ({
  items,
  returnReasons,
  onItemSelectionChange,
  selectedItems,
}) => {
  const handleQuantityChange = ({
    item_id,
    quantity,
    selected_item,
  }: {
    item_id: string
    quantity: number
    selected_item?: ReturnItemSelection
  }) => {
    const item = items.find((i) => i.id === item_id)
    if (!item || !item.isReturnable) {return}

    const maxQuantity = item.returnableQuantity
    const newQuantity = Math.max(0, Math.min(quantity, maxQuantity))
    
    onItemSelectionChange({
      id: item_id,
      quantity: newQuantity,
      return_reason_id: selected_item?.return_reason_id || "",
      note: selected_item?.note || "",
    })
  }

  const handleReturnReasonChange = ({
    item_id,
    return_reason_id,
    selected_item,
  }: {
    item_id: string
    return_reason_id: string
    selected_item?: ReturnItemSelection
  }) => {
    onItemSelectionChange({
      id: item_id,
      quantity: selected_item?.quantity || 0,
      return_reason_id,
      note: selected_item?.note || "",
    })
  }

  const handleNoteChange = ({
    item_id,
    note,
    selected_item,
  }: {
    item_id: string
    note: string
    selected_item?: ReturnItemSelection
  }) => {
    onItemSelectionChange({
      id: item_id,
      quantity: selected_item?.quantity || 0,
      return_reason_id: selected_item?.return_reason_id || "",
      note,
    })
  }

  // TODO render component
}

export default ReturnItemSelector
```

You create the `ReturnItemSelector` component that accepts the following props:

- `items`: The list of items in the order, enhanced with their delivery and return status.
- `returnReasons`: The list of available return reasons.
- `onItemSelectionChange`: A callback function that is called when the customer selects or updates an item to return.
- `selectedItems`: The list of items that the customer has selected to return.

In the component, you define three functions:

- `handleQuantityChange`: Called when the customer changes the quantity to return for an item.
- `handleReturnReasonChange`: Called when the customer selects a return reason for an item.
- `handleNoteChange`: Called when the customer adds or updates a note for an item.

Next, you'll add a `return` statement that renders the item selector. Replace the `TODO` in the `ReturnItemSelector` component with the following:

```tsx title="src/modules/account/components/return-item-selector/index.tsx"
return (
  <div className="space-y-4">
    {items.map((item) => {
      const itemSelection = selectedItems.find((si) => si.id === item.id)
      const currentQuantity = itemSelection?.quantity || 0
      const currentReturnReason = itemSelection?.return_reason_id || ""
      const currentNote = itemSelection?.note || ""

      return (
        <div
          key={item.id}
          className={`p-4 border rounded-lg ${
            !item.isReturnable ? "opacity-60 bg-gray-50" : ""
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex w-16">
                <Thumbnail thumbnail={item.thumbnail} images={[]} size="square" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="txt-medium truncate">
                  {item.title}
                </h4>
                {!item.isReturnable && (
                  // @ts-ignore
                  <Badge color="grey" size="small">
                    {!item.isDelivered ? "Not delivered" : "Not returnable"}
                  </Badge>
                )}
              </div>
              {item.variant && (
                <p className="txt-small text-ui-fg-subtle">
                  {item.variant.title}
                </p>
              )}
              <p className="txt-small text-ui-fg-subtle">
                {item.isReturnable ? (
                  <>Available to return: {item.returnableQuantity} {item.returnableQuantity === 1 ? "item" : "items"}</>
                ) : item.isDelivered ? (
                  <>Delivered: {item.deliveredQuantity} of {item.quantity} {item.quantity === 1 ? "item" : "items"} (already processed)</>
                ) : (
                  <>Delivered: 0 of {item.quantity} {item.quantity === 1 ? "item" : "items"}</>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="txt-small">
                {convertToLocale({
                  amount: item.unit_price,
                  currency_code: "USD", // Default currency, should be passed from parent
                })}
              </span>
              
              {item.isReturnable ? (
                <div className="flex items-center gap-2">
                  {/* @ts-ignore */}
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange({
                      item_id: item.id,
                      quantity: currentQuantity - 1,
                      selected_item: itemSelection,
                    })}
                    disabled={currentQuantity <= 0}
                  >
                    <Minus />
                  </IconButton>
                  
                  <span className="w-8 text-center txt-small">
                    {currentQuantity}
                  </span>
                  
                  {/* @ts-ignore */}
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange({
                      item_id: item.id,
                      quantity: currentQuantity + 1,
                      selected_item: itemSelection,
                    })}
                    disabled={currentQuantity >= item.returnableQuantity}
                  >
                    <Plus />
                  </IconButton>
                </div>
              ) : (
                <div className="txt-small text-ui-fg-subtle">
                  Not available
                </div>
              )}
            </div>
          </div>

          {item.isReturnable && currentQuantity > 0 && (
            <div className="mt-4 pt-4 border-t border-ui-border-base space-y-3">
              <div>
                <label className="block txt-small-plus mb-2">
                  Return Reason (Optional)
                </label>
                <Select
                  value={currentReturnReason}
                  onValueChange={(value) => handleReturnReasonChange({
                    item_id: item.id,
                    return_reason_id: value,
                    selected_item: itemSelection,
                  })}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select a reason..." />
                  </Select.Trigger>
                  <Select.Content>
                    {returnReasons.map((reason) => (
                      <Select.Item key={reason.id} value={reason.id}>
                        {reason.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              
              <div>
                <label className="block txt-small-plus mb-2">
                  Additional Note (Optional)
                </label>
                <Textarea
                  value={currentNote}
                  onChange={(e) => handleNoteChange({
                    item_id: item.id,
                    note: e.target.value,
                    selected_item: itemSelection,
                  })}
                  placeholder="Please provide any additional information about this return..."
                  rows={2}
                  maxLength={500}
                />
                <p className="txt-xsmall text-ui-fg-subtle mt-1">
                  {currentNote.length}/500 characters
                </p>
              </div>
            </div>
          )}
        </div>
      )
    })}
    
    {selectedItems.length > 0 && (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="txt-medium-plus mb-2">Selected Items Summary</h4>
        <div className="space-y-3">
          {selectedItems.map((selectedItem) => {
            const item = items.find((i) => i.id === selectedItem.id)
            if (!item) {return null}
            
            const returnReason = returnReasons.find((r) => r.id === selectedItem.return_reason_id)
            
            return (
              <div key={selectedItem.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                <div className="flex justify-between txt-small mb-1">
                  <span>{item.title} x {selectedItem.quantity}</span>
                  <span>
                    {convertToLocale({
                      amount: item.unit_price * selectedItem.quantity,
                      currency_code: "USD", // Default currency, should be passed from parent
                    })}
                  </span>
                </div>
                {returnReason && (
                  <p className="txt-xsmall text-ui-fg-subtle">
                    Reason: {returnReason.label}
                  </p>
                )}
                {selectedItem.note && (
                  <p className="txt-xsmall text-ui-fg-subtle">
                    Note: {selectedItem.note}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )}
  </div>
)
```

You render the list of items in the order. For each item, you display its details, including its title, variant, price, and returnable status.

If the item is returnable, you display controls that let customers select the quantity to return, choose a return reason from a dropdown, and provide an optional note.

You also display a summary of the selected items to return at the bottom of the component.

***

## Step 5: Add Return Shipping Selector

In this step, you'll add a component that lets customers select a shipping option for their return request. Later, you'll use this component in the return request page.

![Preview of the return shipping selector on the request return page](https://res.cloudinary.com/dza7lstvk/image/upload/v1758010574/Medusa%20Resources/CleanShot_2025-09-16_at_11.13.19_2x_tvxnrq.png)

The component will display the available shipping options for returns, along with their name and price. For shipping options whose price type is calculated by the associated fulfillment provider, the component will retrieve its calculated price from the Medusa application.

To create the component, create the file `src/modules/account/components/return-shipping-selector/index.tsx` with the following content:

```tsx title="src/modules/account/components/return-shipping-selector/index.tsx"
"use client"

import React, { 
  useEffect, 
  useState,
} from "react"
import { RadioGroup } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { Loader } from "@medusajs/icons"
import Radio from "@modules/common/components/radio"

type ReturnShippingSelectorProps = {
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  selectedOption: string
  onOptionSelect: (optionId: string) => void
  cartId: string
  currencyCode: string
}

const ReturnShippingSelector: React.FC<ReturnShippingSelectorProps> = ({
  shippingOptions,
  selectedOption,
  onOptionSelect,
  cartId,
  currencyCode,
}) => {
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})

  useEffect(() => {
    setIsLoadingPrices(true)

    if (shippingOptions?.length) {
      const promises = shippingOptions
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cartId))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }
  }, [shippingOptions, cartId])
  
  if (shippingOptions.length === 0) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800 text-sm">
          No return shipping options are currently available. Please contact customer service for assistance.
        </p>
      </div>
    )
  }

  // TODO render component
}

export default ReturnShippingSelector
```

You create the `ReturnShippingSelector` component that accepts the following props:

- `shippingOptions`: The list of available shipping options for returns.
- `selectedOption`: The ID of the currently selected shipping option.
- `onOptionSelect`: A callback function that is called when the customer selects a shipping option.
- `cartId`: The ID of the cart associated with the order being returned.
- `currencyCode`: The currency code to use for displaying prices.

In the component, you define a `useEffect` hook that retrieves the calculated prices for shipping options with price type `calculated`. The hook updates the component's state with the retrieved prices.

Next, you'll add a `return` statement that renders the shipping selector. Replace the `TODO` in the `ReturnShippingSelector` component with the following:

```tsx title="src/modules/account/components/return-shipping-selector/index.tsx"
return (
  <RadioGroup
    value={selectedOption}
    onChange={onOptionSelect}
  >
    <div className="space-y-3">
      {shippingOptions.map((option) => (
        <RadioGroup.Option
          key={option.id}
          value={option.id}
          className={clx(
            "p-4 border rounded-lg cursor-pointer transition-colors",
            {
              "border-ui-fg-interactive bg-ui-bg-interactive/5":
                selectedOption === option.id,
              "border-gray-200 hover:border-gray-300":
                selectedOption !== option.id,
            }
          )}
        >
          <div className="flex items-center gap-3">
            <Radio
              checked={selectedOption === option.id}
              data-testid={`shipping-option-${option.id}`}
            />
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="txt-medium">
                  {option.name}
                </h4>
                <span className="txt-medium">
                  {option.price_type === "flat" ? (
                    convertToLocale({
                      amount: option.amount!,
                      currency_code: currencyCode,
                    })
                  ) : calculatedPricesMap[option.id] ? (
                    convertToLocale({
                      amount: calculatedPricesMap[option.id],
                      currency_code: currencyCode,
                    })
                  ) : isLoadingPrices ? (
                    <Loader />
                  ) : (
                    "-"
                  )}
                </span>
              </div>
              
              {option.data && typeof option.data === "object" && option.data !== null && "description" in option.data && (
                <p className="txt-small mt-1">
                  {String(option.data.description)}
                </p>
              )}
            </div>
          </div>
        </RadioGroup.Option>
      ))}
    </div>
  </RadioGroup>
)
```

You render the list of available shipping options for returns. For each option, you display its name and price.

If a shipping option's price type is `calculated`, you display the calculated price retrieved from the Medusa application.

***

## Step 6: Add Request Return Page

In this step, you'll add the page that lets customers create a return request for their order. You'll add a template component that contains the main logic of the page, and a page component that fetches the necessary data and renders the template.

### Request Return Template

First, you'll add the template component. Create the file `src/modules/account/templates/return-request-template.tsx` with the following content:

```tsx title="src/modules/account/templates/return-request-template.tsx"
"use client"

import React, { useState, useActionState } from "react"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { createReturnRequest } from "@lib/data/returns"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ReturnItemSelector, { ReturnItemSelection } from "@modules/account/components/return-item-selector"
import ReturnShippingSelector from "@modules/account/components/return-shipping-selector"
import { convertToLocale } from "@lib/util/money"
import { enhanceItemsWithReturnStatus } from "@lib/util/returns"
import { Button } from "@medusajs/ui"

type ReturnRequestTemplateProps = {
  order: HttpTypes.StoreOrder
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  returnReasons: HttpTypes.StoreReturnReason[]
}

const ReturnRequestTemplate: React.FC<ReturnRequestTemplateProps> = ({
  order,
  shippingOptions,
  returnReasons,
}) => {
  const [selectedItems, setSelectedItems] = useState<ReturnItemSelection[]>([])
  const [selectedShippingOption, setSelectedShippingOption] = useState("")
  const [state, formAction] = useActionState(createReturnRequest, {
    success: false,
    error: null,
    return: null,
  })

  // Get all items and categorize them based on delivered quantity and returnable quantity
  const itemsWithDeliveryStatus = enhanceItemsWithReturnStatus(order.items || [])

  const handleItemSelection = ({
    id,
    quantity,
    return_reason_id,
    note,
  }: ReturnItemSelection) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        if (quantity === 0) {
          return prev.filter((item) => item.id !== id)
        }
        return prev.map((item) => {
          return item.id === id ? 
            { ...item, quantity, return_reason_id, note } : 
            item
        })
      } else if (quantity > 0) {
        return [...prev, { id, quantity, return_reason_id, note }]
      }
      return prev
    })
  }

  const handleSubmit = (formData: FormData) => {
    formData.append("order_id", order.id)
    formData.append("items", JSON.stringify(selectedItems))
    formData.append("return_shipping_option_id", selectedShippingOption)
    // @ts-expect-error issue in HTTP types
    const locationId = shippingOptions.find((opt) => opt.id === selectedShippingOption)?.service_zone.fulfillment_set.location.id
    formData.append("location_id", locationId)
    formAction(formData)
  }

  // TODO render component

}

export default ReturnRequestTemplate
```

You create the `ReturnRequestTemplate` component that accepts the following props:

- `order`: The order for which the return request is being created.
- `shippingOptions`: The list of available shipping options for returns.
- `returnReasons`: The list of available return reasons.

In the component, you define the following variables and functions:

- `selectedItems`: A state variable that holds the list of items customers have selected to return.
- `selectedShippingOption`: A state variable that holds the ID of the selected shipping option for the return.
- `state` and `formAction`: Variables returned by React's `useActionState` hook that manage the state of the return request creation action.
- `itemsWithDeliveryStatus`: A variable that holds the list of items in the order, enhanced with their delivery and return status using the `enhanceItemsWithReturnStatus` utility function.
- `handleItemSelection`: A function that updates the `selectedItems` state when customers select or update an item to return.
- `handleSubmit`: A function that handles the form submission to create the return request. It appends the necessary data to a `FormData` object and calls the `formAction` function.

Next, you'll add a `return` statement that shows a success message after the return request is created successfully. Replace the `TODO` in the `ReturnRequestTemplate` component with the following:

```tsx title="src/modules/account/templates/return-request-template.tsx"
if (state.success && state.return) {
  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-2xl-semi">Return Request Submitted</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
        >
          <XMark /> Back to orders
        </LocalizedClientLink>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <div className="text-center">
          <h2 className="text-xl-semi mb-4">Return Request Created Successfully</h2>
          <p className="text-base-regular mb-4">
            Your return request has been submitted. Return ID: <strong>{state.return.id}</strong>
          </p>
          <p className="text-small-regular text-ui-fg-subtle">
            Our support team may contact you for further information regarding your return.
          </p>
        </div>
      </div>
    </div>
  )
}

// TODO render component
```

If the return request was created successfully, you display a success message with the return ID and a link to go back to the orders page.

Finally, you'll add a `return` statement that renders the main content of the return request page. Replace the `TODO` in the `ReturnRequestTemplate` component with the following:

```tsx title="src/modules/account/templates/return-request-template.tsx"
return (
  <div className="flex flex-col justify-center gap-y-4">
    <div className="flex gap-2 justify-between items-center">
      <h1 className="text-2xl-semi">Request Return</h1>
      <LocalizedClientLink
        href={`/account/orders/details/${order.id}`}
        className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
      >
        <XMark /> Back to order details
      </LocalizedClientLink>
    </div>

    <div>
      <div className="mb-6">
        <h2 className="text-xl-semi mb-2">Order #{order.display_id}</h2>
        <div className="flex items-center gap-4 text-small-regular text-ui-fg-subtle mb-4">
          <span>Ordered: {new Date(order.created_at).toDateString()}</span>
          <span>Total: {convertToLocale({
            amount: order.total,
            currency_code: order.currency_code,
          })}</span>
        </div>
        <p className="text-base-regular text-ui-fg-subtle">
          You can request a return for items that have been delivered. Select the items you'd like to return and choose a return shipping option.
        </p>
      </div>

      {itemsWithDeliveryStatus.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-base-regular text-ui-fg-subtle">
            No items available in this order.
          </p>
        </div>
      ) : (
        <form action={handleSubmit} className="space-y-6">
          <div>
            <h3 className="txt-medium-plus mb-4">Items to Return</h3>
            <ReturnItemSelector
              items={itemsWithDeliveryStatus}
              returnReasons={returnReasons}
              onItemSelectionChange={handleItemSelection}
              selectedItems={selectedItems}
            />
          </div>

          <div>
            <h3 className="txt-medium-plus mb-4">Choose Return Shipping</h3>
            <ReturnShippingSelector
              shippingOptions={shippingOptions}
              selectedOption={selectedShippingOption}
              onOptionSelect={setSelectedShippingOption}
              cartId={(order as any).cart.id}
              currencyCode={order.currency_code}
            />
          </div>


          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{state.error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button 
              type="submit" 
              variant="primary"
              disabled={selectedItems.length === 0 || selectedShippingOption === ""}
            >
              Request Return
            </Button>
          </div>
        </form>
      )}
    </div>
  </div>
)
```

You render the main content of the return request page. You display the order details, including the order ID, order date, and total amount.

You also display the item and shipping selector components that you created earlier.

Finally, you show a submit button that lets customers submit the return request.

### Request Return Page

Next, you'll add the page component that fetches the necessary data and renders the `ReturnRequestTemplate` component.

Create the file `src/app/[countryCode]/(main)/account/@dashboard/orders/return/[id]/page.tsx` with the following content:

```tsx title="src/app/[countryCode]/(main)/account/@dashboard/orders/return/[id]/page.tsx"
import { retrieveOrder } from "@lib/data/orders"
import { listReturnShippingOptions, listReturnReasons } from "@lib/data/returns"
import ReturnRequestTemplate from "@modules/account/templates/return-request-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Return Request - Order #${order.display_id}`,
    description: `Request a return for your order`,
  }
}

export default async function ReturnRequestPage(props: Props) {
  const params = await props.params
  
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return notFound()
  }

  // Get shipping options and return reasons
  const [shippingOptions, returnReasons] = await Promise.all([
    listReturnShippingOptions((order as any).cart.id),
    listReturnReasons(),
  ])

  return <ReturnRequestTemplate order={order} shippingOptions={shippingOptions} returnReasons={returnReasons} />
}
```

You create the `ReturnRequestPage` component that fetches the order details, available return shipping options, and return reasons.

If the order is not found, you return a 404 page. Otherwise, you render the `ReturnRequestTemplate` component with the fetched data.

### Retrieve Cart with Order Data

Since you need the cart ID to retrieve data like return shipping options, you need to retrieve the cart along with the order data. You can do this by adding `+cart.id` to the `fields` query parameter when retrieving the order.

In `src/lib/data/orders.ts`, update the `retrieveOrder` function to include the cart in the `fields` parameter:

```ts title="src/lib/data/orders.ts"
export const retrieveOrder = async (id: string) => {
  // ...

  return sdk.client
    .fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product,+cart.id",
      },
      // ...
    })
    // ...
}
```

You add `+cart.id` to the `fields` parameter to ensure that the cart ID is included in the order data.

***

## Step 7: Add Link to Request Return Page

Before you test the return request page, you'll add a link to the page from the order details page.

In `src/modules/order/templates/order-details-template.tsx`, add the following imports at the top of the file:

```tsx title="src/modules/order/templates/order-details-template.tsx"
import { Button } from "@medusajs/ui"
import { hasReturnableItems } from "@lib/util/returns"
```

Then, in the `OrderDetailsTemplate` component, add the following variable:

```tsx title="src/modules/order/templates/order-details-template.tsx"
const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  // ...

  const hasReturnableItemsInOrder = hasReturnableItems(order)

  // ...
}
```

You add a variable to check whether the order has any returnable items using the `hasReturnableItems` utility function.

Finally, in the `return` statement, find the following lines that display a button to go back to the orders page:

```tsx title="src/modules/order/templates/order-details-template.tsx"
<LocalizedClientLink
  href="/account/orders"
  className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
  data-testid="back-to-overview-button"
>
  <XMark /> Back to overview
</LocalizedClientLink>
```

And replace them with the following:

```tsx title="src/modules/order/templates/order-details-template.tsx"
<div className="flex gap-2 items-center">
  {hasReturnableItemsInOrder && (
    <LocalizedClientLink href={`/account/orders/return/${order.id}`}>
      {/* @ts-ignore */}
      <Button variant="secondary" size="small">
        Request Return
      </Button>
    </LocalizedClientLink>
  )}
  <LocalizedClientLink
    href="/account/orders"
    className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
    data-testid="back-to-overview-button"
  >
    <XMark /> Back to overview
  </LocalizedClientLink>
</div>
```

You add a button that links to the return request page next to the "Back to overview" link. The button is displayed only if the order has returnable items.

***

## Test the Return Request Page

Now that you've added the return request page and the necessary components, you can test the functionality.

First, run the following command from the `apps/backend` directory to start the development server:

```bash
npm run dev
```

And run the following command from the storefront directory to start the storefront development server:

```bash
npm run dev
```

### Prerequisites

#### Create Return Shipping Options

Before you can test the return request page, you need to create return shipping options in the Medusa Admin. To do that:

1. Open the Medusa Admin in your browser at `localhost:9000/app` and log in.
2. Go to Settings -> Locations & Shipping.
3. Click on "View details" of a location to add the shipping options to.
4. In the Shipping Options section, find the "Return options" subsection and click "Create option".
5. In the form, enter the shipping option's details and price.
6. Click "Save" to create the return shipping option.

You can learn more about creating a shipping option in the [Manage Locations](https://docs.medusajs.com/user-guide/settings/locations-and-shipping/locations) user guide.

![Form to create a return shipping option in the Medusa Admin](https://res.cloudinary.com/dza7lstvk/image/upload/v1758012545/Medusa%20Resources/CleanShot_2025-09-16_at_11.47.47_2x_fx6tan.png)

#### Create Return Reasons

Next, you need to create return reasons in the Medusa Admin. To do that:

1. In the Medusa Admin, go to Settings -> Return Reasons.
2. Click "Create" to add a new return reason.
3. In the form, enter the return reason's label and value.
4. Click "Save" to create the return reason.

You can learn more about creating return reasons in the [Manage Return Reasons](https://docs.medusajs.com/user-guide/settings/return-reasons) user guide.

![Form to create a return reason in the Medusa Admin](https://res.cloudinary.com/dza7lstvk/image/upload/v1758012657/Medusa%20Resources/CleanShot_2025-09-16_at_11.50.47_2x_qcrqj6.png)

#### Create Customer Account

Next, you need to create a customer account from the Next.js Starter Storefront. To do that:

1. Go to Account.
2. Click the `Join us` link.
3. Enter the customer's details like email and password.
4. Click "Join" to create the account.

![Form to create a customer account in the Next.js Starter Storefront](https://res.cloudinary.com/dza7lstvk/image/upload/v1758012811/Medusa%20Resources/CleanShot_2025-09-16_at_11.52.58_2x_msuuqx.png)

#### Place an Order

As a logged-in customer, place an order from the Next.js Starter Storefront. You can add an item to the cart, proceed to checkout, and complete the order. You'll see an order confirmation page afterward.

![Order confirmation page in the Next.js Starter Storefront](https://res.cloudinary.com/dza7lstvk/image/upload/v1758012923/Medusa%20Resources/CleanShot_2025-09-16_at_11.55.12_2x_zyat0i.png)

#### Deliver Items in the Order

Finally, you need to deliver the items in the order from the Medusa Admin to make them returnable. To do that:

1. In the Medusa Admin, go to Orders.
2. Click on the order you just placed from the storefront.
3. Under the "Unfulfilled Items" section, click the <InlineIcon Icon={EllipsisHorizontal} alt="three-dots" /> icon and choose "Fulfill Items" from the dropdown.
4. In the form, choose a location, a shipping method, and the quantity to fulfill.
5. Click "Create Fulfillment" to create the fulfillment.
6. In the "Fulfillment #1" section, click the "Mark as delivered" button to mark the fulfillment as delivered.

The order's fulfillment status will change to "Delivered", and the items will become returnable.

Learn more about creating fulfillments and marking them as delivered in the [Manage Order Fulfillments](https://docs.medusajs.com/user-guide/orders/fulfillments) user guide.

![Order details page in the Medusa Admin showing the fulfillment status as "Delivered"](https://res.cloudinary.com/dza7lstvk/image/upload/v1758013188/Medusa%20Resources/CleanShot_2025-09-16_at_11.59.29_2x_tlqaoo.png)

### Test the Return Request Flow

You can now request a return from the storefront as the logged-in customer. To do that:

1. In the storefront, go to Account -> Orders.
2. Click the "See details" button of the order.
3. Click the "Request Return" button to go to the return request page.

If you don't see the "Request Return" button, try hard-refreshing the page or clearing the browser cache.

![Order details page in the Next.js Starter Storefront showing the "Request Return" button](https://res.cloudinary.com/dza7lstvk/image/upload/v1758013344/Medusa%20Resources/CleanShot_2025-09-16_at_12.02.03_2x_ehirsj.png)

4. In the Request Return page, increment the quantity of an item to return, select a return reason, and provide an optional note.
5. Choose a return shipping option.
6. Click the "Request Return" button to submit the return request.

![Request Return page in the Next.js Starter Storefront showing the item and shipping selectors](https://res.cloudinary.com/dza7lstvk/image/upload/v1758013438/Medusa%20Resources/CleanShot_2025-09-16_at_12.03.41_2x_ksmlpt.png)

You should see a success message after submitting the return request.

If you open the order's details page in the Medusa Admin, you'll see the requested return in the Activity section. You'll also see a note below the order's items that were requested for return.

![Order details page in the Medusa Admin showing the requested return in the Activity section](https://res.cloudinary.com/dza7lstvk/image/upload/v1758013557/Medusa%20Resources/CleanShot_2025-09-16_at_12.05.31_2x_wv9z8o.png)

***

## Next Steps

### Handle Return Requests in the Medusa Admin

As a merchant, you can now handle return requests from the Medusa Admin. You can:

1. [Mark Return Items as Received](https://docs.medusajs.com/user-guide/orders/returns#mark-return-items-as-received). This is equivalent to approving the return request. This sets the return's status to "received" and restocks the returned items.

![Form to mark return items as received in the Medusa Admin](https://res.cloudinary.com/dza7lstvk/image/upload/v1758013778/Medusa%20Resources/CleanShot_2025-09-16_at_12.09.23_2x_r07tcb.png)

2. If you've previously captured the order's payment and there's an outstanding amount, you can [refund the outstanding amount](https://docs.medusajs.com/user-guide/orders/payments#refund-payment).

![Button to refund the outstanding amount in the Medusa Admin](https://res.cloudinary.com/dza7lstvk/image/upload/v1758014212/Medusa%20Resources/CleanShot_2025-09-16_at_12.16.35_2x_ibmkdq.png)

3. [Cancel a return request](https://docs.medusajs.com/user-guide/orders/returns#cancel-requested-return). This sets the return's status to "canceled". The customer can request a new return if needed.

![Button to cancel a return request in the Medusa Admin](https://res.cloudinary.com/dza7lstvk/image/upload/v1758013651/Medusa%20Resources/CleanShot_2025-09-16_at_12.07.09_2x_husdak.png)

### Customize the Return Request Page

You can customize the return request page to fit your storefront's design and requirements. You can also change how returns are created. For example, you can let guest customers request returns, set custom prices for return shipping options, or specify a stock location to return the items to.

Refer to the [Create Return API reference](https://docs.medusajs.com/api/api/store/returns/create-return) to see the available parameters when creating a return request.

### Learn More about Medusa

If you're new to Medusa, check out the [main documentation](https://docs.medusajs.com/docs/learn), where you'll get a more in-depth understanding of all the concepts you've used in this guide and more.

To learn more about the commerce features that Medusa provides, check out Medusa's [Commerce Modules](https://docs.medusajs.com/resources/commerce-modules).

### Troubleshooting

If you encounter issues during your development, check out the [troubleshooting guides](https://docs.medusajs.com/resources/troubleshooting).

### Getting Help

If you encounter issues not covered in the troubleshooting guides:

1. Visit the [Medusa GitHub repository](https://github.com/medusajs/medusa) to report issues or ask questions.
2. Join the [Medusa Discord community](https://discord.gg/medusajs) for real-time support from community members.




<H3 className="!mt-0">Just Getting Started?</H3>

Check out the [Medusa v2 Documentation](https://docs.medusajs.com/docs).

<H3 className="!mt-0">Medusa JS SDK</H3>

To use Medusa's JS SDK library, install the following packages in your project (not required for admin customizations):

```bash
npm install @medusajs/js-sdk@latest @medusajs/types@latest
```

Learn more about the JS SDK and how to configure it in [this documentation](https://docs.medusajs.com/resources/js-sdk).

### Download Full Reference

Download this reference as an OpenApi YAML file. You can import this file to tools like Postman and start sending requests directly to your Medusa application.




## Admin API Reference

- [GET /admin/api-keys](https://docs.medusajs.com/api/admin#api-keys_getapikeys)
- [POST /admin/api-keys](https://docs.medusajs.com/api/admin#api-keys_postapikeys)
- [GET /admin/api-keys/](https://docs.medusajs.com/api/admin#api-keys_getapikeysid)
- [POST /admin/api-keys/](https://docs.medusajs.com/api/admin#api-keys_postapikeysid)
- [DELETE /admin/api-keys/](https://docs.medusajs.com/api/admin#api-keys_deleteapikeysid)
- [POST /admin/api-keys//revoke](https://docs.medusajs.com/api/admin#api-keys_postapikeysidrevoke)
- [POST /admin/api-keys//sales-channels](https://docs.medusajs.com/api/admin#api-keys_postapikeysidsaleschannels)
- [GET /admin/campaigns](https://docs.medusajs.com/api/admin#campaigns_getcampaigns)
- [POST /admin/campaigns](https://docs.medusajs.com/api/admin#campaigns_postcampaigns)
- [GET /admin/campaigns/](https://docs.medusajs.com/api/admin#campaigns_getcampaignsid)
- [POST /admin/campaigns/](https://docs.medusajs.com/api/admin#campaigns_postcampaignsid)
- [DELETE /admin/campaigns/](https://docs.medusajs.com/api/admin#campaigns_deletecampaignsid)
- [POST /admin/campaigns//promotions](https://docs.medusajs.com/api/admin#campaigns_postcampaignsidpromotions)
- [GET /admin/claims](https://docs.medusajs.com/api/admin#claims_getclaims)
- [POST /admin/claims](https://docs.medusajs.com/api/admin#claims_postclaims)
- [GET /admin/claims/](https://docs.medusajs.com/api/admin#claims_getclaimsid)
- [POST /admin/claims//cancel](https://docs.medusajs.com/api/admin#claims_postclaimsidcancel)
- [POST /admin/claims//claim-items](https://docs.medusajs.com/api/admin#claims_postclaimsidclaimitems)
- [POST /admin/claims//claim-items/](https://docs.medusajs.com/api/admin#claims_postclaimsidclaimitemsaction_id)
- [DELETE /admin/claims//claim-items/](https://docs.medusajs.com/api/admin#claims_deleteclaimsidclaimitemsaction_id)
- [POST /admin/claims//inbound/items](https://docs.medusajs.com/api/admin#claims_postclaimsidinbounditems)
- [POST /admin/claims//inbound/items/](https://docs.medusajs.com/api/admin#claims_postclaimsidinbounditemsaction_id)
- [DELETE /admin/claims//inbound/items/](https://docs.medusajs.com/api/admin#claims_deleteclaimsidinbounditemsaction_id)
- [POST /admin/claims//inbound/shipping-method](https://docs.medusajs.com/api/admin#claims_postclaimsidinboundshippingmethod)
- [POST /admin/claims//inbound/shipping-method/](https://docs.medusajs.com/api/admin#claims_postclaimsidinboundshippingmethodaction_id)
- [DELETE /admin/claims//inbound/shipping-method/](https://docs.medusajs.com/api/admin#claims_deleteclaimsidinboundshippingmethodaction_id)
- [POST /admin/claims//outbound/items](https://docs.medusajs.com/api/admin#claims_postclaimsidoutbounditems)
- [POST /admin/claims//outbound/items/](https://docs.medusajs.com/api/admin#claims_postclaimsidoutbounditemsaction_id)
- [DELETE /admin/claims//outbound/items/](https://docs.medusajs.com/api/admin#claims_deleteclaimsidoutbounditemsaction_id)
- [POST /admin/claims//outbound/shipping-method](https://docs.medusajs.com/api/admin#claims_postclaimsidoutboundshippingmethod)
- [POST /admin/claims//outbound/shipping-method/](https://docs.medusajs.com/api/admin#claims_postclaimsidoutboundshippingmethodaction_id)
- [DELETE /admin/claims//outbound/shipping-method/](https://docs.medusajs.com/api/admin#claims_deleteclaimsidoutboundshippingmethodaction_id)
- [POST /admin/claims//request](https://docs.medusajs.com/api/admin#claims_postclaimsidrequest)
- [DELETE /admin/claims//request](https://docs.medusajs.com/api/admin#claims_deleteclaimsidrequest)
- [GET /admin/collections](https://docs.medusajs.com/api/admin#collections_getcollections)
- [POST /admin/collections](https://docs.medusajs.com/api/admin#collections_postcollections)
- [GET /admin/collections/](https://docs.medusajs.com/api/admin#collections_getcollectionsid)
- [POST /admin/collections/](https://docs.medusajs.com/api/admin#collections_postcollectionsid)
- [DELETE /admin/collections/](https://docs.medusajs.com/api/admin#collections_deletecollectionsid)
- [POST /admin/collections//products](https://docs.medusajs.com/api/admin#collections_postcollectionsidproducts)
- [GET /admin/currencies](https://docs.medusajs.com/api/admin#currencies_getcurrencies)
- [GET /admin/currencies/](https://docs.medusajs.com/api/admin#currencies_getcurrenciescode)
- [GET /admin/customer-groups](https://docs.medusajs.com/api/admin#customer-groups_getcustomergroups)
- [POST /admin/customer-groups](https://docs.medusajs.com/api/admin#customer-groups_postcustomergroups)
- [GET /admin/customer-groups/](https://docs.medusajs.com/api/admin#customer-groups_getcustomergroupsid)
- [POST /admin/customer-groups/](https://docs.medusajs.com/api/admin#customer-groups_postcustomergroupsid)
- [DELETE /admin/customer-groups/](https://docs.medusajs.com/api/admin#customer-groups_deletecustomergroupsid)
- [POST /admin/customer-groups//customers](https://docs.medusajs.com/api/admin#customer-groups_postcustomergroupsidcustomers)
- [GET /admin/customers](https://docs.medusajs.com/api/admin#customers_getcustomers)
- [POST /admin/customers](https://docs.medusajs.com/api/admin#customers_postcustomers)
- [GET /admin/customers/](https://docs.medusajs.com/api/admin#customers_getcustomersid)
- [POST /admin/customers/](https://docs.medusajs.com/api/admin#customers_postcustomersid)
- [DELETE /admin/customers/](https://docs.medusajs.com/api/admin#customers_deletecustomersid)
- [GET /admin/customers//addresses](https://docs.medusajs.com/api/admin#customers_getcustomersidaddresses)
- [POST /admin/customers//addresses](https://docs.medusajs.com/api/admin#customers_postcustomersidaddresses)
- [GET /admin/customers//addresses/](https://docs.medusajs.com/api/admin#customers_getcustomersidaddressesaddress_id)
- [POST /admin/customers//addresses/](https://docs.medusajs.com/api/admin#customers_postcustomersidaddressesaddress_id)
- [DELETE /admin/customers//addresses/](https://docs.medusajs.com/api/admin#customers_deletecustomersidaddressesaddress_id)
- [POST /admin/customers//customer-groups](https://docs.medusajs.com/api/admin#customers_postcustomersidcustomergroups)
- [GET /admin/draft-orders](https://docs.medusajs.com/api/admin#draft-orders_getdraftorders)
- [POST /admin/draft-orders](https://docs.medusajs.com/api/admin#draft-orders_postdraftorders)
- [GET /admin/draft-orders/](https://docs.medusajs.com/api/admin#draft-orders_getdraftordersid)
- [POST /admin/draft-orders/](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersid)
- [DELETE /admin/draft-orders/](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersid)
- [POST /admin/draft-orders//convert-to-order](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidconverttoorder)
- [POST /admin/draft-orders//edit](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedit)
- [DELETE /admin/draft-orders//edit](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersidedit)
- [POST /admin/draft-orders//edit/confirm](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditconfirm)
- [POST /admin/draft-orders//edit/items](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedititems)
- [POST /admin/draft-orders//edit/items/item/](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedititemsitemitem_id)
- [POST /admin/draft-orders//edit/items/](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersidedititemsaction_id)
- [DELETE /admin/draft-orders//edit/items/](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersidedititemsaction_id)
- [POST /admin/draft-orders//edit/promotions](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditpromotions)
- [DELETE /admin/draft-orders//edit/promotions](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersideditpromotions)
- [POST /admin/draft-orders//edit/request](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditrequest)
- [POST /admin/draft-orders//edit/shipping-methods](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethods)
- [POST /admin/draft-orders//edit/shipping-methods/method/](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethodsmethodmethod_id)
- [DELETE /admin/draft-orders//edit/shipping-methods/method/](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersideditshippingmethodsmethodmethod_id)
- [POST /admin/draft-orders//edit/shipping-methods/](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethodsaction_id)
- [DELETE /admin/draft-orders//edit/shipping-methods/](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersideditshippingmethodsaction_id)
- [GET /admin/exchanges](https://docs.medusajs.com/api/admin#exchanges_getexchanges)
- [POST /admin/exchanges](https://docs.medusajs.com/api/admin#exchanges_postexchanges)
- [GET /admin/exchanges/](https://docs.medusajs.com/api/admin#exchanges_getexchangesid)
- [POST /admin/exchanges//cancel](https://docs.medusajs.com/api/admin#exchanges_postexchangesidcancel)
- [POST /admin/exchanges//inbound/items](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinbounditems)
- [POST /admin/exchanges//inbound/items/](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinbounditemsaction_id)
- [DELETE /admin/exchanges//inbound/items/](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidinbounditemsaction_id)
- [POST /admin/exchanges//inbound/shipping-method](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinboundshippingmethod)
- [POST /admin/exchanges//inbound/shipping-method/](https://docs.medusajs.com/api/admin#exchanges_postexchangesidinboundshippingmethodaction_id)
- [DELETE /admin/exchanges//inbound/shipping-method/](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidinboundshippingmethodaction_id)
- [POST /admin/exchanges//outbound/items](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutbounditems)
- [POST /admin/exchanges//outbound/items/](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutbounditemsaction_id)
- [DELETE /admin/exchanges//outbound/items/](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidoutbounditemsaction_id)
- [POST /admin/exchanges//outbound/shipping-method](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutboundshippingmethod)
- [POST /admin/exchanges//outbound/shipping-method/](https://docs.medusajs.com/api/admin#exchanges_postexchangesidoutboundshippingmethodaction_id)
- [DELETE /admin/exchanges//outbound/shipping-method/](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidoutboundshippingmethodaction_id)
- [POST /admin/exchanges//request](https://docs.medusajs.com/api/admin#exchanges_postexchangesidrequest)
- [DELETE /admin/exchanges//request](https://docs.medusajs.com/api/admin#exchanges_deleteexchangesidrequest)
- [GET /admin/feature-flags](https://docs.medusajs.com/api/admin#feature-flags_getfeatureflags)
- [GET /admin/fulfillment-providers](https://docs.medusajs.com/api/admin#fulfillment-providers_getfulfillmentproviders)
- [GET /admin/fulfillment-providers//options](https://docs.medusajs.com/api/admin#fulfillment-providers_getfulfillmentprovidersidoptions)
- [DELETE /admin/fulfillment-sets/](https://docs.medusajs.com/api/admin#fulfillment-sets_deletefulfillmentsetsid)
- [POST /admin/fulfillment-sets//service-zones](https://docs.medusajs.com/api/admin#fulfillment-sets_postfulfillmentsetsidservicezones)
- [GET /admin/fulfillment-sets//service-zones/](https://docs.medusajs.com/api/admin#fulfillment-sets_getfulfillmentsetsidservicezoneszone_id)
- [POST /admin/fulfillment-sets//service-zones/](https://docs.medusajs.com/api/admin#fulfillment-sets_postfulfillmentsetsidservicezoneszone_id)
- [DELETE /admin/fulfillment-sets//service-zones/](https://docs.medusajs.com/api/admin#fulfillment-sets_deletefulfillmentsetsidservicezoneszone_id)
- [POST /admin/fulfillments](https://docs.medusajs.com/api/admin#fulfillments_postfulfillments)
- [POST /admin/fulfillments//cancel](https://docs.medusajs.com/api/admin#fulfillments_postfulfillmentsidcancel)
- [POST /admin/fulfillments//shipment](https://docs.medusajs.com/api/admin#fulfillments_postfulfillmentsidshipment)
- [GET /admin/gift-cards](https://docs.medusajs.com/api/admin#gift-cards_getgiftcards)
- [POST /admin/gift-cards](https://docs.medusajs.com/api/admin#gift-cards_postgiftcards)
- [GET /admin/gift-cards/](https://docs.medusajs.com/api/admin#gift-cards_getgiftcardsid)
- [POST /admin/gift-cards/](https://docs.medusajs.com/api/admin#gift-cards_postgiftcardsid)
- [GET /admin/gift-cards//orders](https://docs.medusajs.com/api/admin#gift-cards_getgiftcardsidorders)
- [GET /admin/index/details](https://docs.medusajs.com/api/admin#index_getindexdetails)
- [POST /admin/index/sync](https://docs.medusajs.com/api/admin#index_postindexsync)
- [GET /admin/inventory-items](https://docs.medusajs.com/api/admin#inventory-items_getinventoryitems)
- [POST /admin/inventory-items](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitems)
- [POST /admin/inventory-items/export](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsexport)
- [POST /admin/inventory-items/location-levels/batch](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemslocationlevelsbatch)
- [GET /admin/inventory-items/](https://docs.medusajs.com/api/admin#inventory-items_getinventoryitemsid)
- [POST /admin/inventory-items/](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsid)
- [DELETE /admin/inventory-items/](https://docs.medusajs.com/api/admin#inventory-items_deleteinventoryitemsid)
- [GET /admin/inventory-items//location-levels](https://docs.medusajs.com/api/admin#inventory-items_getinventoryitemsidlocationlevels)
- [POST /admin/inventory-items//location-levels](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsidlocationlevels)
- [POST /admin/inventory-items//location-levels/batch](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsidlocationlevelsbatch)
- [POST /admin/inventory-items//location-levels/](https://docs.medusajs.com/api/admin#inventory-items_postinventoryitemsidlocationlevelslocation_id)
- [DELETE /admin/inventory-items//location-levels/](https://docs.medusajs.com/api/admin#inventory-items_deleteinventoryitemsidlocationlevelslocation_id)
- [GET /admin/invites](https://docs.medusajs.com/api/admin#invites_getinvites)
- [POST /admin/invites](https://docs.medusajs.com/api/admin#invites_postinvites)
- [POST /admin/invites/accept](https://docs.medusajs.com/api/admin#invites_postinvitesaccept)
- [GET /admin/invites/](https://docs.medusajs.com/api/admin#invites_getinvitesid)
- [DELETE /admin/invites/](https://docs.medusajs.com/api/admin#invites_deleteinvitesid)
- [POST /admin/invites//resend](https://docs.medusajs.com/api/admin#invites_postinvitesidresend)
- [GET /admin/layouts/configurations](https://docs.medusajs.com/api/admin#layouts_getlayoutsconfigurations)
- [GET /admin/layouts//configuration](https://docs.medusajs.com/api/admin#layouts_getlayoutszoneconfiguration)
- [POST /admin/layouts//configuration](https://docs.medusajs.com/api/admin#layouts_postlayoutszoneconfiguration)
- [DELETE /admin/layouts//configuration](https://docs.medusajs.com/api/admin#layouts_deletelayoutszoneconfiguration)
- [GET /admin/locales](https://docs.medusajs.com/api/admin#locales_getlocales)
- [GET /admin/locales/](https://docs.medusajs.com/api/admin#locales_getlocalescode)
- [GET /admin/notifications](https://docs.medusajs.com/api/admin#notifications_getnotifications)
- [GET /admin/notifications/](https://docs.medusajs.com/api/admin#notifications_getnotificationsid)
- [POST /admin/order-changes/](https://docs.medusajs.com/api/admin#order-changes_postorderchangesid)
- [POST /admin/order-edits](https://docs.medusajs.com/api/admin#order-edits_postorderedits)
- [DELETE /admin/order-edits/](https://docs.medusajs.com/api/admin#order-edits_deleteordereditsid)
- [POST /admin/order-edits//confirm](https://docs.medusajs.com/api/admin#order-edits_postordereditsidconfirm)
- [POST /admin/order-edits//items](https://docs.medusajs.com/api/admin#order-edits_postordereditsiditems)
- [POST /admin/order-edits//items/item/](https://docs.medusajs.com/api/admin#order-edits_postordereditsiditemsitemitem_id)
- [POST /admin/order-edits//items/](https://docs.medusajs.com/api/admin#order-edits_postordereditsiditemsaction_id)
- [DELETE /admin/order-edits//items/](https://docs.medusajs.com/api/admin#order-edits_deleteordereditsiditemsaction_id)
- [POST /admin/order-edits//request](https://docs.medusajs.com/api/admin#order-edits_postordereditsidrequest)
- [POST /admin/order-edits//shipping-method](https://docs.medusajs.com/api/admin#order-edits_postordereditsidshippingmethod)
- [POST /admin/order-edits//shipping-method/](https://docs.medusajs.com/api/admin#order-edits_postordereditsidshippingmethodaction_id)
- [DELETE /admin/order-edits//shipping-method/](https://docs.medusajs.com/api/admin#order-edits_deleteordereditsidshippingmethodaction_id)
- [GET /admin/orders](https://docs.medusajs.com/api/admin#orders_getorders)
- [POST /admin/orders/export](https://docs.medusajs.com/api/admin#orders_postordersexport)
- [GET /admin/orders/](https://docs.medusajs.com/api/admin#orders_getordersid)
- [POST /admin/orders/](https://docs.medusajs.com/api/admin#orders_postordersid)
- [POST /admin/orders//archive](https://docs.medusajs.com/api/admin#orders_postordersidarchive)
- [POST /admin/orders//cancel](https://docs.medusajs.com/api/admin#orders_postordersidcancel)
- [GET /admin/orders//changes](https://docs.medusajs.com/api/admin#orders_getordersidchanges)
- [POST /admin/orders//complete](https://docs.medusajs.com/api/admin#orders_postordersidcomplete)
- [POST /admin/orders//credit-lines](https://docs.medusajs.com/api/admin#orders_postordersidcreditlines)
- [POST /admin/orders//fulfillments](https://docs.medusajs.com/api/admin#orders_postordersidfulfillments)
- [POST /admin/orders//fulfillments//cancel](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idcancel)
- [POST /admin/orders//fulfillments//mark-as-delivered](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idmarkasdelivered)
- [POST /admin/orders//fulfillments//shipments](https://docs.medusajs.com/api/admin#orders_postordersidfulfillmentsfulfillment_idshipments)
- [GET /admin/orders//line-items](https://docs.medusajs.com/api/admin#orders_getordersidlineitems)
- [POST /admin/orders//payment-sessions/authorize](https://docs.medusajs.com/api/admin#orders_postordersidpaymentsessionsauthorize)
- [GET /admin/orders//preview](https://docs.medusajs.com/api/admin#orders_getordersidpreview)
- [GET /admin/orders//shipping-options](https://docs.medusajs.com/api/admin#orders_getordersidshippingoptions)
- [POST /admin/orders//transfer](https://docs.medusajs.com/api/admin#orders_postordersidtransfer)
- [POST /admin/orders//transfer/cancel](https://docs.medusajs.com/api/admin#orders_postordersidtransfercancel)
- [POST /admin/orders//transfer/guest](https://docs.medusajs.com/api/admin#orders_postordersidtransferguest)
- [POST /admin/payment-collections](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollections)
- [DELETE /admin/payment-collections/](https://docs.medusajs.com/api/admin#payment-collections_deletepaymentcollectionsid)
- [POST /admin/payment-collections//mark-as-paid](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollectionsidmarkaspaid)
- [POST /admin/payment-collections//payment-sessions](https://docs.medusajs.com/api/admin#payment-collections_postpaymentcollectionsidpaymentsessions)
- [GET /admin/payments](https://docs.medusajs.com/api/admin#payments_getpayments)
- [GET /admin/payments/payment-providers](https://docs.medusajs.com/api/admin#payments_getpaymentspaymentproviders)
- [GET /admin/payments/](https://docs.medusajs.com/api/admin#payments_getpaymentsid)
- [POST /admin/payments//capture](https://docs.medusajs.com/api/admin#payments_postpaymentsidcapture)
- [POST /admin/payments//refund](https://docs.medusajs.com/api/admin#payments_postpaymentsidrefund)
- [GET /admin/plugins](https://docs.medusajs.com/api/admin#plugins_getplugins)
- [GET /admin/price-lists](https://docs.medusajs.com/api/admin#price-lists_getpricelists)
- [POST /admin/price-lists](https://docs.medusajs.com/api/admin#price-lists_postpricelists)
- [GET /admin/price-lists/](https://docs.medusajs.com/api/admin#price-lists_getpricelistsid)
- [POST /admin/price-lists/](https://docs.medusajs.com/api/admin#price-lists_postpricelistsid)
- [DELETE /admin/price-lists/](https://docs.medusajs.com/api/admin#price-lists_deletepricelistsid)
- [GET /admin/price-lists//prices](https://docs.medusajs.com/api/admin#price-lists_getpricelistsidprices)
- [POST /admin/price-lists//prices/batch](https://docs.medusajs.com/api/admin#price-lists_postpricelistsidpricesbatch)
- [POST /admin/price-lists//products](https://docs.medusajs.com/api/admin#price-lists_postpricelistsidproducts)
- [GET /admin/price-preferences](https://docs.medusajs.com/api/admin#price-preferences_getpricepreferences)
- [POST /admin/price-preferences](https://docs.medusajs.com/api/admin#price-preferences_postpricepreferences)
- [GET /admin/price-preferences/](https://docs.medusajs.com/api/admin#price-preferences_getpricepreferencesid)
- [POST /admin/price-preferences/](https://docs.medusajs.com/api/admin#price-preferences_postpricepreferencesid)
- [DELETE /admin/price-preferences/](https://docs.medusajs.com/api/admin#price-preferences_deletepricepreferencesid)
- [GET /admin/product-categories](https://docs.medusajs.com/api/admin#product-categories_getproductcategories)
- [POST /admin/product-categories](https://docs.medusajs.com/api/admin#product-categories_postproductcategories)
- [GET /admin/product-categories/](https://docs.medusajs.com/api/admin#product-categories_getproductcategoriesid)
- [POST /admin/product-categories/](https://docs.medusajs.com/api/admin#product-categories_postproductcategoriesid)
- [DELETE /admin/product-categories/](https://docs.medusajs.com/api/admin#product-categories_deleteproductcategoriesid)
- [POST /admin/product-categories//products](https://docs.medusajs.com/api/admin#product-categories_postproductcategoriesidproducts)
- [GET /admin/product-options](https://docs.medusajs.com/api/admin#product-options_getproductoptions)
- [POST /admin/product-options](https://docs.medusajs.com/api/admin#product-options_postproductoptions)
- [GET /admin/product-options/](https://docs.medusajs.com/api/admin#product-options_getproductoptionsid)
- [POST /admin/product-options/](https://docs.medusajs.com/api/admin#product-options_postproductoptionsid)
- [DELETE /admin/product-options/](https://docs.medusajs.com/api/admin#product-options_deleteproductoptionsid)
- [GET /admin/product-options//values](https://docs.medusajs.com/api/admin#product-options_getproductoptionsidvalues)
- [GET /admin/product-options//values/](https://docs.medusajs.com/api/admin#product-options_getproductoptionsidvaluesvalue_id)
- [POST /admin/product-options//values/](https://docs.medusajs.com/api/admin#product-options_postproductoptionsidvaluesvalue_id)
- [DELETE /admin/product-options//values/](https://docs.medusajs.com/api/admin#product-options_deleteproductoptionsidvaluesvalue_id)
- [GET /admin/product-tags](https://docs.medusajs.com/api/admin#product-tags_getproducttags)
- [POST /admin/product-tags](https://docs.medusajs.com/api/admin#product-tags_postproducttags)
- [GET /admin/product-tags/](https://docs.medusajs.com/api/admin#product-tags_getproducttagsid)
- [POST /admin/product-tags/](https://docs.medusajs.com/api/admin#product-tags_postproducttagsid)
- [DELETE /admin/product-tags/](https://docs.medusajs.com/api/admin#product-tags_deleteproducttagsid)
- [GET /admin/product-types](https://docs.medusajs.com/api/admin#product-types_getproducttypes)
- [POST /admin/product-types](https://docs.medusajs.com/api/admin#product-types_postproducttypes)
- [GET /admin/product-types/](https://docs.medusajs.com/api/admin#product-types_getproducttypesid)
- [POST /admin/product-types/](https://docs.medusajs.com/api/admin#product-types_postproducttypesid)
- [DELETE /admin/product-types/](https://docs.medusajs.com/api/admin#product-types_deleteproducttypesid)
- [GET /admin/product-variants](https://docs.medusajs.com/api/admin#product-variants_getproductvariants)
- [GET /admin/products](https://docs.medusajs.com/api/admin#products_getproducts)
- [POST /admin/products](https://docs.medusajs.com/api/admin#products_postproducts)
- [POST /admin/products/batch](https://docs.medusajs.com/api/admin#products_postproductsbatch)
- [POST /admin/products/export](https://docs.medusajs.com/api/admin#products_postproductsexport)
- [POST /admin/products/import](https://docs.medusajs.com/api/admin#products_postproductsimport)
- [POST /admin/products/import//confirm](https://docs.medusajs.com/api/admin#products_postproductsimporttransaction_idconfirm)
- [POST /admin/products/imports](https://docs.medusajs.com/api/admin#products_postproductsimports)
- [POST /admin/products/imports//confirm](https://docs.medusajs.com/api/admin#products_postproductsimportstransaction_idconfirm)
- [GET /admin/products/](https://docs.medusajs.com/api/admin#products_getproductsid)
- [POST /admin/products/](https://docs.medusajs.com/api/admin#products_postproductsid)
- [DELETE /admin/products/](https://docs.medusajs.com/api/admin#products_deleteproductsid)
- [POST /admin/products//images//variants/batch](https://docs.medusajs.com/api/admin#products_postproductsidimagesimage_idvariantsbatch)
- [GET /admin/products//options](https://docs.medusajs.com/api/admin#products_getproductsidoptions)
- [POST /admin/products//options/batch](https://docs.medusajs.com/api/admin#products_postproductsidoptionsbatch)
- [GET /admin/products//variants](https://docs.medusajs.com/api/admin#products_getproductsidvariants)
- [POST /admin/products//variants](https://docs.medusajs.com/api/admin#products_postproductsidvariants)
- [POST /admin/products//variants/batch](https://docs.medusajs.com/api/admin#products_postproductsidvariantsbatch)
- [POST /admin/products//variants/inventory-items/batch](https://docs.medusajs.com/api/admin#products_postproductsidvariantsinventoryitemsbatch)
- [GET /admin/products//variants/](https://docs.medusajs.com/api/admin#products_getproductsidvariantsvariant_id)
- [POST /admin/products//variants/](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_id)
- [DELETE /admin/products//variants/](https://docs.medusajs.com/api/admin#products_deleteproductsidvariantsvariant_id)
- [POST /admin/products//variants//images/batch](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_idimagesbatch)
- [POST /admin/products//variants//inventory-items](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_idinventoryitems)
- [POST /admin/products//variants//inventory-items/](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_idinventoryitemsinventory_item_id)
- [DELETE /admin/products//variants//inventory-items/](https://docs.medusajs.com/api/admin#products_deleteproductsidvariantsvariant_idinventoryitemsinventory_item_id)
- [GET /admin/promotions](https://docs.medusajs.com/api/admin#promotions_getpromotions)
- [POST /admin/promotions](https://docs.medusajs.com/api/admin#promotions_postpromotions)
- [GET /admin/promotions/rule-attribute-options/](https://docs.medusajs.com/api/admin#promotions_getpromotionsruleattributeoptionsrule_type)
- [GET /admin/promotions/rule-value-options//](https://docs.medusajs.com/api/admin#promotions_getpromotionsrulevalueoptionsrule_typerule_attribute_id)
- [GET /admin/promotions/](https://docs.medusajs.com/api/admin#promotions_getpromotionsid)
- [POST /admin/promotions/](https://docs.medusajs.com/api/admin#promotions_postpromotionsid)
- [DELETE /admin/promotions/](https://docs.medusajs.com/api/admin#promotions_deletepromotionsid)
- [POST /admin/promotions//buy-rules/batch](https://docs.medusajs.com/api/admin#promotions_postpromotionsidbuyrulesbatch)
- [POST /admin/promotions//rules/batch](https://docs.medusajs.com/api/admin#promotions_postpromotionsidrulesbatch)
- [POST /admin/promotions//target-rules/batch](https://docs.medusajs.com/api/admin#promotions_postpromotionsidtargetrulesbatch)
- [GET /admin/promotions//](https://docs.medusajs.com/api/admin#promotions_getpromotionsidrule_type)
- [GET /admin/property-labels](https://docs.medusajs.com/api/admin#property-labels_getpropertylabels)
- [POST /admin/property-labels](https://docs.medusajs.com/api/admin#property-labels_postpropertylabels)
- [POST /admin/property-labels/batch](https://docs.medusajs.com/api/admin#property-labels_postpropertylabelsbatch)
- [GET /admin/property-labels/](https://docs.medusajs.com/api/admin#property-labels_getpropertylabelsid)
- [POST /admin/property-labels/](https://docs.medusajs.com/api/admin#property-labels_postpropertylabelsid)
- [DELETE /admin/property-labels/](https://docs.medusajs.com/api/admin#property-labels_deletepropertylabelsid)
- [GET /admin/refund-reasons](https://docs.medusajs.com/api/admin#refund-reasons_getrefundreasons)
- [POST /admin/refund-reasons](https://docs.medusajs.com/api/admin#refund-reasons_postrefundreasons)
- [GET /admin/refund-reasons/](https://docs.medusajs.com/api/admin#refund-reasons_getrefundreasonsid)
- [POST /admin/refund-reasons/](https://docs.medusajs.com/api/admin#refund-reasons_postrefundreasonsid)
- [DELETE /admin/refund-reasons/](https://docs.medusajs.com/api/admin#refund-reasons_deleterefundreasonsid)
- [GET /admin/regions](https://docs.medusajs.com/api/admin#regions_getregions)
- [POST /admin/regions](https://docs.medusajs.com/api/admin#regions_postregions)
- [GET /admin/regions/](https://docs.medusajs.com/api/admin#regions_getregionsid)
- [POST /admin/regions/](https://docs.medusajs.com/api/admin#regions_postregionsid)
- [DELETE /admin/regions/](https://docs.medusajs.com/api/admin#regions_deleteregionsid)
- [GET /admin/reservations](https://docs.medusajs.com/api/admin#reservations_getreservations)
- [POST /admin/reservations](https://docs.medusajs.com/api/admin#reservations_postreservations)
- [GET /admin/reservations/](https://docs.medusajs.com/api/admin#reservations_getreservationsid)
- [POST /admin/reservations/](https://docs.medusajs.com/api/admin#reservations_postreservationsid)
- [DELETE /admin/reservations/](https://docs.medusajs.com/api/admin#reservations_deletereservationsid)
- [GET /admin/return-reasons](https://docs.medusajs.com/api/admin#return-reasons_getreturnreasons)
- [POST /admin/return-reasons](https://docs.medusajs.com/api/admin#return-reasons_postreturnreasons)
- [GET /admin/return-reasons/](https://docs.medusajs.com/api/admin#return-reasons_getreturnreasonsid)
- [POST /admin/return-reasons/](https://docs.medusajs.com/api/admin#return-reasons_postreturnreasonsid)
- [DELETE /admin/return-reasons/](https://docs.medusajs.com/api/admin#return-reasons_deletereturnreasonsid)
- [GET /admin/returns](https://docs.medusajs.com/api/admin#returns_getreturns)
- [POST /admin/returns](https://docs.medusajs.com/api/admin#returns_postreturns)
- [GET /admin/returns/](https://docs.medusajs.com/api/admin#returns_getreturnsid)
- [POST /admin/returns/](https://docs.medusajs.com/api/admin#returns_postreturnsid)
- [POST /admin/returns//cancel](https://docs.medusajs.com/api/admin#returns_postreturnsidcancel)
- [POST /admin/returns//dismiss-items](https://docs.medusajs.com/api/admin#returns_postreturnsiddismissitems)
- [POST /admin/returns//dismiss-items/](https://docs.medusajs.com/api/admin#returns_postreturnsiddismissitemsaction_id)
- [DELETE /admin/returns//dismiss-items/](https://docs.medusajs.com/api/admin#returns_deletereturnsiddismissitemsaction_id)
- [POST /admin/returns//receive-items](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveitems)
- [POST /admin/returns//receive-items/](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveitemsaction_id)
- [DELETE /admin/returns//receive-items/](https://docs.medusajs.com/api/admin#returns_deletereturnsidreceiveitemsaction_id)
- [POST /admin/returns//receive](https://docs.medusajs.com/api/admin#returns_postreturnsidreceive)
- [DELETE /admin/returns//receive](https://docs.medusajs.com/api/admin#returns_deletereturnsidreceive)
- [POST /admin/returns//receive/confirm](https://docs.medusajs.com/api/admin#returns_postreturnsidreceiveconfirm)
- [POST /admin/returns//request-items](https://docs.medusajs.com/api/admin#returns_postreturnsidrequestitems)
- [POST /admin/returns//request-items/](https://docs.medusajs.com/api/admin#returns_postreturnsidrequestitemsaction_id)
- [DELETE /admin/returns//request-items/](https://docs.medusajs.com/api/admin#returns_deletereturnsidrequestitemsaction_id)
- [POST /admin/returns//request](https://docs.medusajs.com/api/admin#returns_postreturnsidrequest)
- [DELETE /admin/returns//request](https://docs.medusajs.com/api/admin#returns_deletereturnsidrequest)
- [POST /admin/returns//shipping-method](https://docs.medusajs.com/api/admin#returns_postreturnsidshippingmethod)
- [POST /admin/returns//shipping-method/](https://docs.medusajs.com/api/admin#returns_postreturnsidshippingmethodaction_id)
- [DELETE /admin/returns//shipping-method/](https://docs.medusajs.com/api/admin#returns_deletereturnsidshippingmethodaction_id)
- [GET /admin/sales-channels](https://docs.medusajs.com/api/admin#sales-channels_getsaleschannels)
- [POST /admin/sales-channels](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannels)
- [GET /admin/sales-channels/](https://docs.medusajs.com/api/admin#sales-channels_getsaleschannelsid)
- [POST /admin/sales-channels/](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannelsid)
- [DELETE /admin/sales-channels/](https://docs.medusajs.com/api/admin#sales-channels_deletesaleschannelsid)
- [POST /admin/sales-channels//products](https://docs.medusajs.com/api/admin#sales-channels_postsaleschannelsidproducts)
- [GET /admin/search](https://docs.medusajs.com/api/admin#search_getsearch)
- [GET /admin/shipping-option-types](https://docs.medusajs.com/api/admin#shipping-option-types_getshippingoptiontypes)
- [POST /admin/shipping-option-types](https://docs.medusajs.com/api/admin#shipping-option-types_postshippingoptiontypes)
- [GET /admin/shipping-option-types/](https://docs.medusajs.com/api/admin#shipping-option-types_getshippingoptiontypesid)
- [POST /admin/shipping-option-types/](https://docs.medusajs.com/api/admin#shipping-option-types_postshippingoptiontypesid)
- [DELETE /admin/shipping-option-types/](https://docs.medusajs.com/api/admin#shipping-option-types_deleteshippingoptiontypesid)
- [GET /admin/shipping-options](https://docs.medusajs.com/api/admin#shipping-options_getshippingoptions)
- [POST /admin/shipping-options](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptions)
- [GET /admin/shipping-options/](https://docs.medusajs.com/api/admin#shipping-options_getshippingoptionsid)
- [POST /admin/shipping-options/](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptionsid)
- [DELETE /admin/shipping-options/](https://docs.medusajs.com/api/admin#shipping-options_deleteshippingoptionsid)
- [POST /admin/shipping-options//rules/batch](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptionsidrulesbatch)
- [GET /admin/shipping-profiles](https://docs.medusajs.com/api/admin#shipping-profiles_getshippingprofiles)
- [POST /admin/shipping-profiles](https://docs.medusajs.com/api/admin#shipping-profiles_postshippingprofiles)
- [GET /admin/shipping-profiles/](https://docs.medusajs.com/api/admin#shipping-profiles_getshippingprofilesid)
- [POST /admin/shipping-profiles/](https://docs.medusajs.com/api/admin#shipping-profiles_postshippingprofilesid)
- [DELETE /admin/shipping-profiles/](https://docs.medusajs.com/api/admin#shipping-profiles_deleteshippingprofilesid)
- [GET /admin/stock-locations](https://docs.medusajs.com/api/admin#stock-locations_getstocklocations)
- [POST /admin/stock-locations](https://docs.medusajs.com/api/admin#stock-locations_poststocklocations)
- [GET /admin/stock-locations/](https://docs.medusajs.com/api/admin#stock-locations_getstocklocationsid)
- [POST /admin/stock-locations/](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsid)
- [DELETE /admin/stock-locations/](https://docs.medusajs.com/api/admin#stock-locations_deletestocklocationsid)
- [POST /admin/stock-locations//fulfillment-providers](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidfulfillmentproviders)
- [POST /admin/stock-locations//fulfillment-sets](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidfulfillmentsets)
- [POST /admin/stock-locations//sales-channels](https://docs.medusajs.com/api/admin#stock-locations_poststocklocationsidsaleschannels)
- [GET /admin/store-credit-accounts](https://docs.medusajs.com/api/admin#store-credit-accounts_getstorecreditaccounts)
- [POST /admin/store-credit-accounts](https://docs.medusajs.com/api/admin#store-credit-accounts_poststorecreditaccounts)
- [GET /admin/store-credit-accounts/](https://docs.medusajs.com/api/admin#store-credit-accounts_getstorecreditaccountsid)
- [POST /admin/store-credit-accounts//credit](https://docs.medusajs.com/api/admin#store-credit-accounts_poststorecreditaccountsidcredit)
- [GET /admin/store-credit-accounts//transactions](https://docs.medusajs.com/api/admin#store-credit-accounts_getstorecreditaccountsidtransactions)
- [GET /admin/stores](https://docs.medusajs.com/api/admin#stores_getstores)
- [GET /admin/stores/](https://docs.medusajs.com/api/admin#stores_getstoresid)
- [POST /admin/stores/](https://docs.medusajs.com/api/admin#stores_poststoresid)
- [GET /admin/tax-providers](https://docs.medusajs.com/api/admin#tax-providers_gettaxproviders)
- [GET /admin/tax-rates](https://docs.medusajs.com/api/admin#tax-rates_gettaxrates)
- [POST /admin/tax-rates](https://docs.medusajs.com/api/admin#tax-rates_posttaxrates)
- [GET /admin/tax-rates/](https://docs.medusajs.com/api/admin#tax-rates_gettaxratesid)
- [POST /admin/tax-rates/](https://docs.medusajs.com/api/admin#tax-rates_posttaxratesid)
- [DELETE /admin/tax-rates/](https://docs.medusajs.com/api/admin#tax-rates_deletetaxratesid)
- [POST /admin/tax-rates//rules](https://docs.medusajs.com/api/admin#tax-rates_posttaxratesidrules)
- [DELETE /admin/tax-rates//rules/](https://docs.medusajs.com/api/admin#tax-rates_deletetaxratesidrulesrule_id)
- [GET /admin/tax-regions](https://docs.medusajs.com/api/admin#tax-regions_gettaxregions)
- [POST /admin/tax-regions](https://docs.medusajs.com/api/admin#tax-regions_posttaxregions)
- [GET /admin/tax-regions/](https://docs.medusajs.com/api/admin#tax-regions_gettaxregionsid)
- [POST /admin/tax-regions/](https://docs.medusajs.com/api/admin#tax-regions_posttaxregionsid)
- [DELETE /admin/tax-regions/](https://docs.medusajs.com/api/admin#tax-regions_deletetaxregionsid)
- [GET /admin/translations](https://docs.medusajs.com/api/admin#translations_gettranslations)
- [POST /admin/translations/batch](https://docs.medusajs.com/api/admin#translations_posttranslationsbatch)
- [GET /admin/translations/entities](https://docs.medusajs.com/api/admin#translations_gettranslationsentities)
- [GET /admin/translations/settings](https://docs.medusajs.com/api/admin#translations_gettranslationssettings)
- [POST /admin/translations/settings/batch](https://docs.medusajs.com/api/admin#translations_posttranslationssettingsbatch)
- [GET /admin/translations/statistics](https://docs.medusajs.com/api/admin#translations_gettranslationsstatistics)
- [POST /admin/uploads](https://docs.medusajs.com/api/admin#uploads_postuploads)
- [POST /admin/uploads/presigned-urls](https://docs.medusajs.com/api/admin#uploads_postuploadspresignedurls)
- [GET /admin/uploads/](https://docs.medusajs.com/api/admin#uploads_getuploadsid)
- [DELETE /admin/uploads/](https://docs.medusajs.com/api/admin#uploads_deleteuploadsid)
- [GET /admin/users](https://docs.medusajs.com/api/admin#users_getusers)
- [GET /admin/users/me](https://docs.medusajs.com/api/admin#users_getusersme)
- [GET /admin/users/](https://docs.medusajs.com/api/admin#users_getusersid)
- [POST /admin/users/](https://docs.medusajs.com/api/admin#users_postusersid)
- [DELETE /admin/users/](https://docs.medusajs.com/api/admin#users_deleteusersid)
- [GET /admin/views/entities](https://docs.medusajs.com/api/admin#views_getviewsentities)
- [GET /admin/views//columns](https://docs.medusajs.com/api/admin#views_getviewsentitycolumns)
- [GET /admin/views//configurations](https://docs.medusajs.com/api/admin#views_getviewsentityconfigurations)
- [POST /admin/views//configurations](https://docs.medusajs.com/api/admin#views_postviewsentityconfigurations)
- [GET /admin/views//configurations/active](https://docs.medusajs.com/api/admin#views_getviewsentityconfigurationsactive)
- [POST /admin/views//configurations/active](https://docs.medusajs.com/api/admin#views_postviewsentityconfigurationsactive)
- [GET /admin/views//configurations/](https://docs.medusajs.com/api/admin#views_getviewsentityconfigurationsid)
- [POST /admin/views//configurations/](https://docs.medusajs.com/api/admin#views_postviewsentityconfigurationsid)
- [DELETE /admin/views//configurations/](https://docs.medusajs.com/api/admin#views_deleteviewsentityconfigurationsid)
- [GET /admin/workflows-executions](https://docs.medusajs.com/api/admin#workflows-executions_getworkflowsexecutions)
- [GET /admin/workflows-executions/](https://docs.medusajs.com/api/admin#workflows-executions_getworkflowsexecutionsid)
- [POST /admin/workflows-executions//run](https://docs.medusajs.com/api/admin#workflows-executions_postworkflowsexecutionsworkflow_idrun)
- [POST /admin/workflows-executions//steps/failure](https://docs.medusajs.com/api/admin#workflows-executions_postworkflowsexecutionsworkflow_idstepsfailure)
- [POST /admin/workflows-executions//steps/success](https://docs.medusajs.com/api/admin#workflows-executions_postworkflowsexecutionsworkflow_idstepssuccess)
- [GET /admin/workflows-executions//subscribe](https://docs.medusajs.com/api/admin#workflows-executions_getworkflowsexecutionsworkflow_idsubscribe)
- [GET /admin/workflows-executions//](https://docs.medusajs.com/api/admin#workflows-executions_getworkflowsexecutionsworkflow_idtransaction_id)
- [GET /admin/workflows-executions///subscribe](https://docs.medusajs.com/api/admin#workflows-executions_getworkflowsexecutionsworkflow_idtransaction_idsubscribe)
- [POST /auth/mfa/challenges//verify](https://docs.medusajs.com/api/admin#multi-factor-authentication_postmfachallengesidverify)
- [GET /auth/mfa/factors](https://docs.medusajs.com/api/admin#multi-factor-authentication_getmfafactors)
- [POST /auth/mfa/factors](https://docs.medusajs.com/api/admin#multi-factor-authentication_postmfafactors)
- [DELETE /auth/mfa/factors/](https://docs.medusajs.com/api/admin#auth_deletemfafactorsid)
- [POST /auth/mfa/factors//verify](https://docs.medusajs.com/api/admin#multi-factor-authentication_postmfafactorsidverify)
- [POST /auth/mfa/recovery-codes](https://docs.medusajs.com/api/admin#multi-factor-authentication_postmfarecoverycodes)
- [POST /auth/session](https://docs.medusajs.com/api/admin#auth_postsession)
- [DELETE /auth/session](https://docs.medusajs.com/api/admin#auth_deletesession)
- [POST /auth/token/refresh](https://docs.medusajs.com/api/admin#auth_postadminauthtokenrefresh)
- [GET /auth/user/providers](https://docs.medusajs.com/api/admin#auth_getuserproviders)
- [POST /auth/user/](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_provider)
- [POST /auth/user//callback](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providercallback)
- [POST /auth/user//register](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_provider_register)
- [POST /auth/user//reset-password](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providerresetpassword)
- [POST /auth/user//update](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providerupdate)
- [POST /auth//user](https://docs.medusajs.com/api/admin#auth_provider_postauth_provideruser)


## Store API Reference

- [POST /auth/customer/emailpass/verification/confirm](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providerverificationconfirm)
- [GET /auth/customer/providers](https://docs.medusajs.com/api/store#auth_getcustomerproviders)
- [POST /auth/customer/](https://docs.medusajs.com/api/store#auth_postactor_typeauth_provider)
- [POST /auth/customer//callback](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providercallback)
- [POST /auth/customer//register](https://docs.medusajs.com/api/store#auth_postactor_typeauth_provider_register)
- [POST /auth/customer//reset-password](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providerresetpassword)
- [POST /auth/customer//update](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providerupdate)
- [POST /auth/mfa/challenges//verify](https://docs.medusajs.com/api/store#multi-factor-authentication-\(mfa\)-factors_postmfachallengesidverify)
- [GET /auth/mfa/factors](https://docs.medusajs.com/api/store#multi-factor-authentication-\(mfa\)-factors_getmfafactors)
- [POST /auth/mfa/factors](https://docs.medusajs.com/api/store#multi-factor-authentication-\(mfa\)-factors_postmfafactors)
- [DELETE /auth/mfa/factors/](https://docs.medusajs.com/api/store#multi-factor-authentication-\(mfa\)-factors_deletemfafactorsid)
- [POST /auth/mfa/factors//verify](https://docs.medusajs.com/api/store#multi-factor-authentication-\(mfa\)-factors_postmfafactorsidverify)
- [POST /auth/mfa/recovery-codes](https://docs.medusajs.com/api/store#multi-factor-authentication-\(mfa\)-factors_postmfarecoverycodes)
- [POST /auth/session](https://docs.medusajs.com/api/store#auth_postsession)
- [DELETE /auth/session](https://docs.medusajs.com/api/store#auth_deletesession)
- [POST /auth/token/refresh](https://docs.medusajs.com/api/store#auth_postadminauthtokenrefresh)
- [POST /auth/verification/confirm](https://docs.medusajs.com/api/store#auth_postverificationconfirm)
- [POST /auth/verification/request](https://docs.medusajs.com/api/store#auth_postverificationrequest)
- [POST /store/carts](https://docs.medusajs.com/api/store#carts_postcarts)
- [GET /store/carts/](https://docs.medusajs.com/api/store#carts_getcartsid)
- [POST /store/carts/](https://docs.medusajs.com/api/store#carts_postcartsid)
- [POST /store/carts//complete](https://docs.medusajs.com/api/store#carts_postcartsidcomplete)
- [POST /store/carts//customer](https://docs.medusajs.com/api/store#carts_postcartsidcustomer)
- [POST /store/carts//gift-cards](https://docs.medusajs.com/api/store#carts_postcartsidgiftcards)
- [DELETE /store/carts//gift-cards](https://docs.medusajs.com/api/store#carts_deletecartsidgiftcards)
- [POST /store/carts//line-items](https://docs.medusajs.com/api/store#carts_postcartsidlineitems)
- [POST /store/carts//line-items/](https://docs.medusajs.com/api/store#carts_postcartsidlineitemsline_id)
- [DELETE /store/carts//line-items/](https://docs.medusajs.com/api/store#carts_deletecartsidlineitemsline_id)
- [POST /store/carts//promotions](https://docs.medusajs.com/api/store#carts_postcartsidpromotions)
- [DELETE /store/carts//promotions](https://docs.medusajs.com/api/store#carts_deletecartsidpromotions)
- [POST /store/carts//shipping-methods](https://docs.medusajs.com/api/store#carts_postcartsidshippingmethods)
- [POST /store/carts//store-credits](https://docs.medusajs.com/api/store#carts_postcartsidstorecredits)
- [POST /store/carts//taxes](https://docs.medusajs.com/api/store#carts_postcartsidtaxes)
- [GET /store/collections](https://docs.medusajs.com/api/store#collections_getcollections)
- [GET /store/collections/](https://docs.medusajs.com/api/store#collections_getcollectionsid)
- [GET /store/currencies](https://docs.medusajs.com/api/store#currencies_getcurrencies)
- [GET /store/currencies/](https://docs.medusajs.com/api/store#currencies_getcurrenciescode)
- [POST /store/customers](https://docs.medusajs.com/api/store#customers_postcustomers)
- [GET /store/customers/me](https://docs.medusajs.com/api/store#customers_getcustomersme)
- [POST /store/customers/me](https://docs.medusajs.com/api/store#customers_postcustomersme)
- [GET /store/customers/me/addresses](https://docs.medusajs.com/api/store#customers_getcustomersmeaddresses)
- [POST /store/customers/me/addresses](https://docs.medusajs.com/api/store#customers_postcustomersmeaddresses)
- [GET /store/customers/me/addresses/](https://docs.medusajs.com/api/store#customers_getcustomersmeaddressesaddress_id)
- [POST /store/customers/me/addresses/](https://docs.medusajs.com/api/store#customers_postcustomersmeaddressesaddress_id)
- [DELETE /store/customers/me/addresses/](https://docs.medusajs.com/api/store#customers_deletecustomersmeaddressesaddress_id)
- [GET /store/gift-cards/](https://docs.medusajs.com/api/store#gift-cards_getgiftcardsidorcode)
- [GET /store/locales](https://docs.medusajs.com/api/store#locales_getlocales)
- [GET /store/orders](https://docs.medusajs.com/api/store#orders_getorders)
- [GET /store/orders/](https://docs.medusajs.com/api/store#orders_getordersid)
- [POST /store/orders//transfer/accept](https://docs.medusajs.com/api/store#orders_postordersidtransferaccept)
- [POST /store/orders//transfer/cancel](https://docs.medusajs.com/api/store#orders_postordersidtransfercancel)
- [POST /store/orders//transfer/decline](https://docs.medusajs.com/api/store#orders_postordersidtransferdecline)
- [POST /store/orders//transfer/request](https://docs.medusajs.com/api/store#orders_postordersidtransferrequest)
- [POST /store/payment-collections](https://docs.medusajs.com/api/store#payment-collections_postpaymentcollections)
- [POST /store/payment-collections//payment-sessions](https://docs.medusajs.com/api/store#payment-collections_postpaymentcollectionsidpaymentsessions)
- [GET /store/payment-providers](https://docs.medusajs.com/api/store#payment-providers_getpaymentproviders)
- [GET /store/product-categories](https://docs.medusajs.com/api/store#product-categories_getproductcategories)
- [GET /store/product-categories/](https://docs.medusajs.com/api/store#product-categories_getproductcategoriesid)
- [GET /store/product-options](https://docs.medusajs.com/api/store#product-options_getproductoptions)
- [GET /store/product-options/](https://docs.medusajs.com/api/store#product-options_getproductoptionsid)
- [GET /store/product-tags](https://docs.medusajs.com/api/store#product-tags_getproducttags)
- [GET /store/product-tags/](https://docs.medusajs.com/api/store#product-tags_getproducttagsid)
- [GET /store/product-types](https://docs.medusajs.com/api/store#product-types_getproducttypes)
- [GET /store/product-types/](https://docs.medusajs.com/api/store#product-types_getproducttypesid)
- [GET /store/product-variants](https://docs.medusajs.com/api/store#product-variants_getproductvariants)
- [GET /store/products](https://docs.medusajs.com/api/store#products_getproducts)
- [GET /store/products/](https://docs.medusajs.com/api/store#products_getproductsid)
- [GET /store/regions](https://docs.medusajs.com/api/store#regions_getregions)
- [GET /store/regions/](https://docs.medusajs.com/api/store#regions_getregionsid)
- [GET /store/return-reasons](https://docs.medusajs.com/api/store#return-reasons_getreturnreasons)
- [GET /store/return-reasons/](https://docs.medusajs.com/api/store#return-reasons_getreturnreasonsid)
- [POST /store/returns](https://docs.medusajs.com/api/store#returns_postreturns)
- [GET /store/shipping-options](https://docs.medusajs.com/api/store#shipping-options_getshippingoptions)
- [POST /store/shipping-options//calculate](https://docs.medusajs.com/api/store#shipping-options_postshippingoptionsidcalculate)
- [GET /store/store-credit-accounts](https://docs.medusajs.com/api/store#store-credit-accounts_getstorecreditaccounts)
- [POST /store/store-credit-accounts/claim](https://docs.medusajs.com/api/store#store-credit-accounts_poststorecreditaccountsclaim)
- [GET /store/store-credit-accounts/](https://docs.medusajs.com/api/store#store-credit-accounts_getstorecreditaccountsid)

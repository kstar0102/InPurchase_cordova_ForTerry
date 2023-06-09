# Interface: WindowsSubscription

[CdvPurchase](../modules/CdvPurchase.md).[WindowsStore](../modules/CdvPurchase.WindowsStore.md).WindowsSubscription

WindowsStore Subscription from Microsoft API

## Table of contents

### Properties

- [autoRenew](CdvPurchase.WindowsStore.WindowsSubscription.md#autorenew)
- [beneficiary](CdvPurchase.WindowsStore.WindowsSubscription.md#beneficiary)
- [cancellationDate](CdvPurchase.WindowsStore.WindowsSubscription.md#cancellationdate)
- [expirationTime](CdvPurchase.WindowsStore.WindowsSubscription.md#expirationtime)
- [expirationTimeWithGrace](CdvPurchase.WindowsStore.WindowsSubscription.md#expirationtimewithgrace)
- [id](CdvPurchase.WindowsStore.WindowsSubscription.md#id)
- [isTrial](CdvPurchase.WindowsStore.WindowsSubscription.md#istrial)
- [lastModified](CdvPurchase.WindowsStore.WindowsSubscription.md#lastmodified)
- [market](CdvPurchase.WindowsStore.WindowsSubscription.md#market)
- [productId](CdvPurchase.WindowsStore.WindowsSubscription.md#productid)
- [recurrenceState](CdvPurchase.WindowsStore.WindowsSubscription.md#recurrencestate)
- [skuId](CdvPurchase.WindowsStore.WindowsSubscription.md#skuid)
- [startTime](CdvPurchase.WindowsStore.WindowsSubscription.md#starttime)

## Properties

### autoRenew

• **autoRenew**: `boolean`

Indicates whether the subscription is configured to automatically renew at the end of the current subscription period.

___

### beneficiary

• **beneficiary**: `string`

The ID of the beneficiary of the entitlement that is associated with this subscription.

___

### cancellationDate

• **cancellationDate**: `string`

The date and time the user's subscription was cancelled, in ISO 8601 format.

___

### expirationTime

• **expirationTime**: `string`

The date and time the subscription will expire, in ISO 8601 format.

This field is only available when the subscription is in certain states.
The expiration time usually indicates when the current state expires.
For example, for an active subscription, the expiration date indicates when the next automatic renewal will occur.

Example: "2017-06-11T03:07:49.2552941+00:00"

___

### expirationTimeWithGrace

• **expirationTimeWithGrace**: `string`

The date and time the subscription will expire including the grace period, in ISO 8601 format.

This value indicates when the user will lose access to the subscription after the subscription has failed to automatically renew.

___

### id

• **id**: `string`

The ID of the subscription.

Use this value to indicate which subscription you want to modify when you call the change the billing state of a subscription for a user method.

___

### isTrial

• **isTrial**: `boolean`

Indicates whether the subscription is a trial.

___

### lastModified

• **lastModified**: `string`

The date and time the subscription was last modified, in ISO 8601 format.

Example: "2017-01-08T21:07:51.1459644+00:00"

___

### market

• **market**: `string`

The country code (in two-letter ISO 3166-1 alpha-2 format) in which the user acquired the subscription.

___

### productId

• **productId**: `string`

The Store ID for the product that represents the subscription add-on in the Microsoft Store catalog.

An example Store ID for a product is "9NBLGGH42CFD".

___

### recurrenceState

• **recurrenceState**: ``"None"`` \| ``"Active"`` \| ``"Inactive"`` \| ``"Canceled"`` \| ``"InDunning"`` \| ``"Failed"``

One of the following values:

 - None:  This indicates a perpetual subscription.
 - Active:  The subscription is active and the user is entitled to use the services.
 - Inactive:  The subscription is past the expiration date, and the user turned off the automatic renew option for the subscription.
 - Canceled:  The subscription has been purposefully terminated before the expiration date, with or without a refund.
 - InDunning:  The subscription is in dunning (that is, the subscription is nearing expiration, and Microsoft is trying to acquire funds to automatically renew the subscription).
 - Failed:  The dunning period is over and the subscription failed to renew after several attempts.

Note:

 - Inactive/Canceled/Failed are terminal states. When a subscription enters one of these states, the user must repurchase the subscription to activate it again. The user is not entitled to use the services in these states.
 - When a subscription is Canceled, the expirationTime will be updated with the date and time of the cancellation.
 - The ID of the subscription will remain the same during its entire lifetime. It will not change if the auto-renew option is turned on or off. If a user repurchases a subscription after reaching a terminal state, a new subscription ID will be created.
 - The ID of a subscription should be used to execute any operation on an individual subscription.
 - When a user repurchases a subscription after cancelling or discontinuing it, if you query the results for the user you will get two entries: one with the old subscription ID in a terminal state, and one with the new subscription ID in an active state.
 - It's always a good practice to check both recurrenceState and expirationTime, since updates to recurrenceState can potentially be delayed by a few minutes (or occasionally hours).

___

### skuId

• **skuId**: `string`

The Store ID for the SKU that represents the subscription add-on the Microsoft Store catalog.

An example Store ID for a SKU is "0010".

___

### startTime

• **startTime**: `string`

The start date and time for the subscription, in ISO 8601 format.

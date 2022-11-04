# Class: Adapter

[CdvPurchase](../modules/CdvPurchase.md).[GooglePlay](../modules/CdvPurchase.GooglePlay.md).Adapter

## Implements

- [`Adapter`](../interfaces/CdvPurchase.Adapter.md)

## Table of contents

### Constructors

- [constructor](CdvPurchase.GooglePlay.Adapter.md#constructor)

### Properties

- [autoRefreshIntervalMillis](CdvPurchase.GooglePlay.Adapter.md#autorefreshintervalmillis)
- [bridge](CdvPurchase.GooglePlay.Adapter.md#bridge)
- [id](CdvPurchase.GooglePlay.Adapter.md#id)
- [initialized](CdvPurchase.GooglePlay.Adapter.md#initialized)
- [name](CdvPurchase.GooglePlay.Adapter.md#name)
- [ready](CdvPurchase.GooglePlay.Adapter.md#ready)
- [retry](CdvPurchase.GooglePlay.Adapter.md#retry)
- [\_instance](CdvPurchase.GooglePlay.Adapter.md#_instance)

### Accessors

- [isSupported](CdvPurchase.GooglePlay.Adapter.md#issupported)
- [products](CdvPurchase.GooglePlay.Adapter.md#products)
- [receipts](CdvPurchase.GooglePlay.Adapter.md#receipts)

### Methods

- [finish](CdvPurchase.GooglePlay.Adapter.md#finish)
- [getPurchases](CdvPurchase.GooglePlay.Adapter.md#getpurchases)
- [getSkusOf](CdvPurchase.GooglePlay.Adapter.md#getskusof)
- [handleReceiptValidationResponse](CdvPurchase.GooglePlay.Adapter.md#handlereceiptvalidationresponse)
- [initialize](CdvPurchase.GooglePlay.Adapter.md#initialize)
- [load](CdvPurchase.GooglePlay.Adapter.md#load)
- [manageSubscriptions](CdvPurchase.GooglePlay.Adapter.md#managesubscriptions)
- [onPriceChangeConfirmationResult](CdvPurchase.GooglePlay.Adapter.md#onpricechangeconfirmationresult)
- [onPurchaseConsumed](CdvPurchase.GooglePlay.Adapter.md#onpurchaseconsumed)
- [onPurchasesUpdated](CdvPurchase.GooglePlay.Adapter.md#onpurchasesupdated)
- [onSetPurchases](CdvPurchase.GooglePlay.Adapter.md#onsetpurchases)
- [order](CdvPurchase.GooglePlay.Adapter.md#order)
- [receiptValidationBody](CdvPurchase.GooglePlay.Adapter.md#receiptvalidationbody)
- [requestPayment](CdvPurchase.GooglePlay.Adapter.md#requestpayment)

## Constructors

### constructor

• **new Adapter**(`context`, `autoRefreshIntervalMillis?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `AdapterContext` |
| `autoRefreshIntervalMillis` | `number` |

## Properties

### autoRefreshIntervalMillis

• **autoRefreshIntervalMillis**: `number` = `0`

___

### bridge

• **bridge**: [`Bridge`](CdvPurchase.GooglePlay.Bridge.Bridge.md)

The GooglePlay bridge

___

### id

• **id**: [`Platform`](../enums/CdvPurchase.Platform.md) = `Platform.GOOGLE_PLAY`

Adapter identifier

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[id](../interfaces/CdvPurchase.Adapter.md#id)

___

### initialized

• **initialized**: `boolean` = `false`

Prevent double initialization

___

### name

• **name**: `string` = `'GooglePlay'`

Adapter name

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[name](../interfaces/CdvPurchase.Adapter.md#name)

___

### ready

• **ready**: `boolean` = `false`

Has the adapter been successfully initialized

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[ready](../interfaces/CdvPurchase.Adapter.md#ready)

___

### retry

• **retry**: `Retry`<`Function`\>

Used to retry failed commands

___

### \_instance

▪ `Static` **\_instance**: [`Adapter`](CdvPurchase.GooglePlay.Adapter.md)

## Accessors

### isSupported

• `get` **isSupported**(): `boolean`

Returns true on Android, the only platform supported by this adapter

#### Returns

`boolean`

#### Implementation of

CdvPurchase.Adapter.isSupported

___

### products

• `get` **products**(): [`GProduct`](CdvPurchase.GooglePlay.GProduct.md)[]

List of products managed by the GooglePlay adapter

#### Returns

[`GProduct`](CdvPurchase.GooglePlay.GProduct.md)[]

#### Implementation of

CdvPurchase.Adapter.products

___

### receipts

• `get` **receipts**(): [`Receipt`](CdvPurchase.GooglePlay.Receipt.md)[]

List of purchase receipts.

#### Returns

[`Receipt`](CdvPurchase.GooglePlay.Receipt.md)[]

#### Implementation of

CdvPurchase.Adapter.receipts

## Methods

### finish

▸ **finish**(`transaction`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Finish a transaction.

For non-consumables, this will acknowledge the purchase.
For consumable, this will acknowledge and consume the purchase.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | [`Transaction`](CdvPurchase.Transaction.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[finish](../interfaces/CdvPurchase.Adapter.md#finish)

___

### getPurchases

▸ **getPurchases**(): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Refresh purchases from GooglePlay

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

___

### getSkusOf

▸ **getSkusOf**(`products`): `Object`

Prepare the list of SKUs sorted by type

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `inAppSkus` | `string`[] |
| `subsSkus` | `string`[] |

___

### handleReceiptValidationResponse

▸ **handleReceiptValidationResponse**(`receipt`, `response`): `Promise`<`void`\>

Handle platform specific fields from receipt validation response.

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.Receipt.md) |
| `response` | [`Payload`](../modules/CdvPurchase.Validator.Response.md#payload) |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[handleReceiptValidationResponse](../interfaces/CdvPurchase.Adapter.md#handlereceiptvalidationresponse)

___

### initialize

▸ **initialize**(): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initializes a platform adapter.

Will resolve when initialization is complete.

Will fail with an `IError` in case of an unrecoverable error.

In other case of a potentially recoverable error, the adapter will keep retrying to initialize forever.

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[initialize](../interfaces/CdvPurchase.Adapter.md#initialize)

___

### load

▸ **load**(`products`): `Promise`<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`GProduct`](CdvPurchase.GooglePlay.GProduct.md))[]\>

Load product definitions from the platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `products` | [`IRegisterProduct`](../interfaces/CdvPurchase.IRegisterProduct.md)[] |

#### Returns

`Promise`<([`IError`](../interfaces/CdvPurchase.IError.md) \| [`GProduct`](CdvPurchase.GooglePlay.GProduct.md))[]\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[load](../interfaces/CdvPurchase.Adapter.md#load)

___

### manageSubscriptions

▸ **manageSubscriptions**(): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Open the platforms' subscription management interface.

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[manageSubscriptions](../interfaces/CdvPurchase.Adapter.md#managesubscriptions)

___

### onPriceChangeConfirmationResult

▸ **onPriceChangeConfirmationResult**(`result`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | ``"OK"`` \| ``"UserCanceled"`` \| ``"UnknownProduct"`` |

#### Returns

`void`

___

### onPurchaseConsumed

▸ **onPurchaseConsumed**(`purchase`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchase` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md) |

#### Returns

`void`

___

### onPurchasesUpdated

▸ **onPurchasesUpdated**(`purchases`): `void`

Called when the platform reports update for some purchases

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)[] |

#### Returns

`void`

___

### onSetPurchases

▸ **onSetPurchases**(`purchases`): `void`

Called when the platform reports some purchases

#### Parameters

| Name | Type |
| :------ | :------ |
| `purchases` | [`Purchase`](../interfaces/CdvPurchase.GooglePlay.Bridge.Purchase.md)[] |

#### Returns

`void`

___

### order

▸ **order**(`offer`, `additionalData`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Initializes an order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `offer` | [`GOffer`](../modules/CdvPurchase.GooglePlay.md#goffer) |
| `additionalData` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[order](../interfaces/CdvPurchase.Adapter.md#order)

___

### receiptValidationBody

▸ **receiptValidationBody**(`receipt`): `undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)

Prepare for receipt validation

#### Parameters

| Name | Type |
| :------ | :------ |
| `receipt` | [`Receipt`](CdvPurchase.GooglePlay.Receipt.md) |

#### Returns

`undefined` \| [`Body`](../interfaces/CdvPurchase.Validator.Request.Body.md)

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[receiptValidationBody](../interfaces/CdvPurchase.Adapter.md#receiptvalidationbody)

___

### requestPayment

▸ **requestPayment**(`payment`, `additionalData?`): `Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

Request a payment from the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `payment` | [`PaymentRequest`](../interfaces/CdvPurchase.PaymentRequest.md) |
| `additionalData?` | [`AdditionalData`](../interfaces/CdvPurchase.AdditionalData.md) |

#### Returns

`Promise`<`undefined` \| [`IError`](../interfaces/CdvPurchase.IError.md)\>

#### Implementation of

[Adapter](../interfaces/CdvPurchase.Adapter.md).[requestPayment](../interfaces/CdvPurchase.Adapter.md#requestpayment)

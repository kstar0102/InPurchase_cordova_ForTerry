(function() {
'use strict';

/// ## <a name="product"></a>*store.Product* object ##
/// 
/// Some methods, like the [`ask` method](#ask), give you access to a `product`
/// object.

store.Product = function(options) {

    if (!options)
        options = {};

    ///
    /// Products object have the following fields and methods:
    ///

    ///  - `product.id` - Identifier of the product on the store
    this.id = options.id || null;

    ///  - `product.alias` - Alias that can be used for more explicit [queries](#queries)
    this.alias = options.alias || options.id || null;

    ///  - `product.price` - Non-localized price, without the currency
    this.price = options.price || null;

    ///  - `product.currency` - Currency code
    this.currency = options.currency || null;

    ///  - `product.title` - Non-localized name or short description
    this.title = options.title || options.localizedTitle || null;

    ///  - `product.description` - Non-localized longer description
    this.description = options.description || options.localizedDescription || null;

    ///  - `product.localizedTitle` - Localized name or short description ready for display
    this.localizedTitle = options.localizedTitle || options.title || null;

    ///  - `product.localizedDescription` - Localized longer description ready for display
    this.localizedDescription = options.localizedDescription || options.description || null;

    ///  - `product.localizedPrice` - Localized price (with currency) ready for display
    this.localizedPrice = options.localizedPrice || null;

    this.loaded = options.loaded;
    this.valid  = options.valid;
    this.canPurchase = options.canPurchase;

    ///  - `product.state` - Current state the product is in (see [life-cycle](#life-cycle) below)
    this.state = options.state || "";
    this.stateChanged();
};
/// 
/// ### life-cycle
///
/// A product will change state during the application execution.
///
/// Find below a diagram of the different states a product can pass by.
///
///     REGISTERED +--> INVALID                                      
///                |                                                 
///                +--> VALID +--> REQUESTED +--> INITIATED +-+     
///                                                           |     
///                     ^      +------------------------------+     
///                     |      |                                     
///                     |      +--> APPROVED +--> FINISHED +--> OWNED
///                     |                                  |         
///                     +----------------------------------+         
///
/// ### States definition:
///
///  - `REGISTERED`: right after being declared to the store using [`store.registerProducts()`](#registerProducts)
///  - `INVALID`: the server didn't recognize this product, it cannot be used.
///  - `VALID`: the server sent extra information about the product (`title`, `price` and such).
///  - `REQUESTED`: order (purchase) has been requested by the user
///  - `INITIATED`: order has been transmitted to the server
///  - `APPROVED`: purchase has been approved by server
///  - `FINISHED`: purchase has been delivered by the app.
///  - `OWNED`: purchase is owned (only for non-consumable and subscriptions)
///
/// When finished, a consumable product will get back to the `LOADED` state.
///
/// ### State changes
///
/// Each time the product changes state, an event is triggered.
///

store.Product.prototype.set = function(key, value) {
    if (typeof key === 'string') {
        this[key] = value;
        if (key === 'state')
            this.stateChanged();
    }
    else {
        var options = key;
        for (key in options) {
            value = options[key];
            this.set(key, value);
        }
    }
};

store.Product.prototype.stateChanged = function() {

    this.canPurchase = this.state === store.VALID;
    this.loaded      = this.state && this.state !== store.REGISTERED;

    // update validity
    this.valid       = this.state !== store.INVALID;
    if (!this.state || this.state === store.REGISTERED)
        delete this.valid;

    if (this.state)
        store.trigger(this, this.state);
};

// aliases to `store` methods, added for conveniance.
store.Product.prototype.on = function(event, cb) {
    store.when(this, event, cb);
};
store.Product.prototype.once = function(event, cb) {
    store.once(this, event, cb);
};
store.Product.prototype.off = function(cb) {
    store.when.unregister(cb);
};

}).call(this);

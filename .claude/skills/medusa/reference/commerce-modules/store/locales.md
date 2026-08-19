# Store Locales

In this guide, you'll learn about locales defined in the Store Module.

### Prerequisites

- [Medusa v2.12.3 or later](https://github.com/medusajs/medusa/releases/tag/v2.12.3)

While the Store Module allows you to manage the locales for your store, the actual locale data and translations are managed by the [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation).

## Supported Locales

The Store Module has a [StoreLocale](https://docs.medusajs.com/references/store/models/StoreLocale) data model that represents the locales supported by your store. It has a `locale_code` property that follows the [IETF BCP 47 standard](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1). For example, `en-US` represents American English, while `fr-FR` represents French (France).

`StoreLocale` belongs to the [Store](https://docs.medusajs.com/references/store/models/Store) data model, which has a `supported_locales` property that lists all the locales available in your store.

For example, if your store supports English (United States) and French (France), you'll have two `StoreLocale` records with the locale codes `en-US` and `fr-FR`.

![Diagram illustrating the relationship between the Store and StoreLocale data models](https://res.cloudinary.com/dza7lstvk/image/upload/v1765371144/Medusa%20Resources/store-locale_ckanv4.jpg)

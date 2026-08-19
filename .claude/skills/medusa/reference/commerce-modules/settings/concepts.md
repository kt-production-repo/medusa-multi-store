# Settings Module Concepts

In this guide, you'll learn about the main concepts in the Settings Module and the data models it uses to store admin personalization settings.

## View Configuration

A view configuration is a saved data-table view for an entity, such as products or orders. It stores which columns are visible, their order and widths, the active filters, the sorting, and the search query.

A view configuration is either personal to a user or a shared system default. Learn more in the [View Configurations](https://docs.medusajs.com/resources/commerce-modules/settings/view-configurations) document.

The [ViewConfiguration](https://docs.medusajs.com/references/settings/models/ViewConfiguration) data model represents a view configuration.

***

## Layout Configuration

A layout configuration stores the layout preferences of a zone, such as a product's details page. It stores the order and visibility of the zone's sections.

A layout configuration is either personal to a user or a shared system default. Learn more in the [Layout Configurations](https://docs.medusajs.com/resources/commerce-modules/settings/layout-configurations) document.

The [LayoutConfiguration](https://docs.medusajs.com/references/settings/models/LayoutConfiguration) data model represents a layout configuration.

***

## Property Label

A property label sets a custom label and description for a property of an entity, such as the `display_id` property of an order. Labels are global, so they apply to all admin users, and they're translatable.

Learn more in the [Property Labels](https://docs.medusajs.com/resources/commerce-modules/settings/property-labels) document.

The [PropertyLabel](https://docs.medusajs.com/references/settings/models/PropertyLabel) data model represents a property label.

***

## User Preference

A user preference stores an arbitrary setting for a user as a key-value pair. The Settings Module also uses user preferences internally to track a user's active view and layout scope.

Learn more in the [User Preferences](https://docs.medusajs.com/resources/commerce-modules/settings/user-preferences) document.

The [UserPreference](https://docs.medusajs.com/references/settings/models/UserPreference) data model represents a user preference.

***

## Entity Discovery and Column Generation

To build data tables in the dashboard, the Settings Module discovers the entities available in your application from the registered modules' [query graph](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), then generates the columns for each entity.

You can customize the generated columns of an entity, such as the default visible columns or their order. Learn how in the [Configure View Configurations](https://docs.medusajs.com/resources/commerce-modules/settings/configure-view-configurations) guide.

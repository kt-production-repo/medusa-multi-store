# delete Method - Service Factory Reference

This method of a module's service deletes one or more records.

The method's name is `deleteDataModel`, where `DataModel` is the plural pascal-case name of the data model.

## Delete One Record

```ts
await postModuleService.deletePosts("123")
```

To delete one record, pass its ID as a parameter to the method.

***

## Delete Multiple Records

```ts
await postModuleService.deletePosts([
  "123",
  "321",
])
```

To delete multiple records, pass an array of IDs as a parameter to the method.

***

## Delete Records Matching Filters

```ts
await postModuleService.deletePosts({
  name: "My Post",
})
```

To delete records matching a set of filters, pass an object of filters as a parameter to the method.

Refer to the [Filtering](https://docs.medusajs.com/resources/service-factory-reference/tips/filtering) reference for more information on accepted filters and examples.

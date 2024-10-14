# ADDRESS API SPEC

## CREATE ADDRESS API

Endpoints: POST /api/contancts/:ConcactId/addresses

Headers: - Authorization : token

Request Body

```json
{
  "street": "Jalan Mawar",
  "city": "Yogyakarta",
  "Province": "DIY",
  "Country": "Indonesia",
  "postal_code": "12345"
}
```

Response Body Success

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Mawar",
    "city": "Yogyakarta",
    "Province": "DIY",
    "Country": "Indonesia",
    "postal_code": "12345"
  }
}
```

Response Body Error

```json
{
  "errors": "Address is not valid"
}
```

## UPDATE ADDRESS API

Endpoints: PUT /api/contacts/:contactId/addresses/:addressId

Headers: - Authorization : token

Request Body

```json
{
  "street": "Jalan Apa 1",
  "city": "KOta Apa 1",
  "Province": "Provisinsi Apa 1",
  "Country": "Negara Apa 2",
  "postal_code": "Kode Pos"
}
```

Response Body Success

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Apa 1",
    "city": "KOta Apa 1",
    "Province": "Provisinsi Apa 1",
    "Country": "Negara Apa 2",
    "postal_code": "Kode Pos"
  }
}
```

Response Body Error

```json
{
  "errors": "address is not found"
}
```

## GET ADDRESS API

Endpoints: GET /api/contacts/:contactId/addresses/:addressId

Headers: - Authorization : token

Response Body Success

```json
{
  "data": {
    "id": 1,
    "street": "Jalan Apa 1",
    "city": "KOta Apa 1",
    "Province": "Provisinsi Apa 1",
    "Country": "Negara Apa 2",
    "postal_code": "Kode Pos"
  }
}
```

Response Body Error

```json
{
  "errors": "contact is not found"
}
```

## GET LIST ADDRESS API

Endpoints: GET /api/contacts/:contactId/addressess

Headers: - Authorization : token

Response Body Success

```json
{
  "data": [
    {
      "id": 1,
      "street": "Jalan Apa 1",
      "city": "KOta Apa 1",
      "Province": "Provisinsi Apa 1",
      "Country": "Negara Apa 2",
      "postal_code": "Kode Pos"
    },
    {
      "id": 2,
      "street": "Jalan Apa 2",
      "city": "KOta Apa 2",
      "Province": "Provisinsi Apa 2",
      "Country": "Negara Apa 2",
      "postal_code": "Kode Pos"
    }
  ]
}
```

Response Body Error

```json
{
  "contanct": "contact is not found"
}
```

## REMOVE ADDRESS API

Endpoints: DELETE /api/contancts/:contanctId/addresses/:addressId

Headers: - Authorization : token

Response Body Success

```json
{
  "data": "Oke"
}
```

Response Body Error

```json
{
  "errors": "Unauthorization"
}
```

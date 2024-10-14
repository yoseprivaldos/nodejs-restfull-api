# CONTACT API SPEC

## CREATE CONTACT API

Enpoints : POST /api/contacts

Headers: - Authorization : token

Request Body

```json
{
    "first_name": "Henri",
    "last_name": "Surbakti",
    "email": "henri@gmail.com",
    "phone": "081229276601"
}
```

Response Body Success

```json
{
    "data": {
        "id": 1,
        "first_name": "Henri",
        "lastn_ame": "Surbakti",
        "email": "henri@gmail.com",
        "phone": "081229276601"
    }
}
```

Response Body Error

```json
{
    "errors": "Email is not valid format"
}
```

## UDATE CONTACT API

Endpoints : PATCH /api/contancts/:id

Headers: - Authorization : token

Request Bodys

```json
{
    "first_name": "Henri",
    "last_name": "Surbakti",
    "email": "henri@gmail.com",
    "phone": "081229276601"
}
```

Response Body Success

```json
{
    "data": {
        "id": 1,
        "first_name": "Henri",
        "last_name": "Surbakti",
        "email": "henri@gmail.com",
        "phone": "081229276601"
    }
}
```

Response Body Error

```json
{
    "errors": "email is not valid format"
}
```

## GET CONTACT API

Endpoints : GET /api/contacts/:id

Headers: - Authorization : token

Response Body Success

```json
{
    "data": {
        "id": 1,
        "first_name": "Henri",
        "lastn_ame": "Surbakti",
        "email": "henri@gmail.com",
        "phone": "081229276601"
    }
}
```

Response Body Error

```json
{
    "errors": "contact is not found"
}
```

## SEARCH CONTACT API

Endpoints : GET /api/contacts

Headers: - Authorization : token

Query Params :

-   name : Search by first_name or last_name, using like, optional
-   email : Search by email using like, optimal
-   phone : Search by phone using like, optimal
-   page : number of page, default 1
-   size : size per page, default 10

Response Body Success

```json
{
    "data": [
        {
            "id": 1,
            "first_name": "Henri",
            "lastn_ame": "Surbakti",
            "email": "henri@gmail.com",
            "phone": "081229276601"
        },
        {
            "id": 2,
            "first_name": "Henri",
            "lastn_ame": "Surbakti",
            "email": "henri@gmail.com",
            "phone": "081229276601"
        }
    ],
    "paging": {
        "page": 1,
        "total_page": 3,
        "total_item": 30
    }
}
```

Response Body Error

```json
{
    "error": "Data is not found"
}
```

## REMOVE CONTACT API

Headers: - Authorization : token

Endpoints = DELETE /api/contancts/:id

Response Body Success

```json
{
    "data": "Ok"
}
```

Response Body Error

```json
{
    "errors": "Contact is not found"
}
```

ripple-name-application
=======================

`createdb -O postgres ripple_name_application`

`export DATABASE_URL=postgres://postgres:postgres@localhost:5432/ripple_name_application`

#### POST /v1/application
```
{
  full_name: 'Henk Test',
  organization: 'Company',
  email: 'henk@1234.com',
  phone: '6501235631',
  ripple_address: '1jasidjfij13asdfija',
  ripple_name: 'h23',
  justification: '1231412312',
  destination_tag: '1238asdjfa8sudfa'
}
```

RESPONSE

```
{
  "success": true,
  "application": {
    "full_name": "Henk Test",
    "organization": "Company",
    "email": "henk@1234.com",
    "phone": "6501235631",
    "ripple_address": "1jasidjfij13asdfija",
    "ripple_name": "h23",
    "justification": "1231412312",
    "destination_tag": "1238asdjfa8sudfa",
    "updatedAt": "2014-04-19T02:29:35.199Z",
    "createdAt": "2014-04-19T02:29:35.199Z",
    "id": 10,
    "website": null
  }
}
```


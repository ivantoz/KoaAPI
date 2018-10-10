accounts
========
Endpoint for  user accounts, authentication, and authorization

**Version:** 1.0.0

### /login
---
##### ***POST***
**Summary:** authenticates user

**Description:** authenticates user

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body | login info | Yes | [login](#login) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | login success | [user](#user) |
| 401 | account deactivated |
| 404 | user not found |
| 422 | invalid password |
| 500 | internal server error |

### /register
---
##### ***POST***
**Summary:** user registration

**Description:** register a new user

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body | new user info | Yes | [register](#register) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | register success | [user-sanitized](#usersanitized) |
| 400 | bad request |
| 500 | internal server error |


### /fellows/register-fellow
---
##### ***POST***
**Summary:** fellow registration

**Description:** register a new fellow

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| body | body | new fellow info | Yes | [fellow-new](#fellownew) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 201 | register success | [fellow-sanitized](#fellowsanitized) |
| 401 | not authorized |
| 400 | bad request |
| 500 | internal server error |


### /fellows/{id}
---
##### ***GET***
**Summary:** Retrieve fellow  by id

**Description:** Retrieve a fellow by their id

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | string |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | retrieve info of a fellow | [fellow-sanitized](#fellowsanitized) |
| 401 | not authorized |
| 404 | fellow not found |
| 500 | internal server error |


### /fellows/{id}
---
##### ***PATCH***
**Summary:** Update an fellow account associated with id

**Description:** Update an fellow account associated with id

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | string |
| body | body | new fellow attributes | Yes | [fellow-name](#fellowname) |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | return updated fellow profile | [fellow-sanitized](#fellowsanitized) |
| 401 | not authorized |
| 404 | fellow not found |
| 400 | bad request |
| 500 | internal server error |

### /fellows/
---
##### ***GET***
**Summary:** Retrieve a list of fellows

**Description:** get a list of all fellows

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| filter | query |  | No | object |
| limit | query |  | No | number |
| skip | query |  | No | number |
| search | query |  | No | string |
| sort | query |  | No | object |
| fields | query |  | No | singleOrArray |


**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | return a list of fellows | [fellow-sanitized](#fellowsanitized) |
| 401 | not authorized |
| 500 | internal server error |


### /fellows/{id}/fellow
---
##### ***DELETE***
**Summary:** Delete fellow account

**Description:** Delete fellow account

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path |  | Yes | string |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 204 | empty body |  |
| 401 | not authorized |
| 400 | cannot delete fellow  |
| 404 | fellow not found |
| 500 | internal server error |



### Models
---

<a name="login"></a>**login**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string |  | Yes |
| password | string |  | Yes |
<a name="register"></a>**register**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| payload | [user-new](#usernew) |  | yes |
<a name="user"></a>**user**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| user | [user-sanitized](#usersanitized) |  | No |
| token | string(token) |  | No |

<a name="username"></a>**user-name**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| first | string |  | Yes |
| middle | string |  | No |
| last | string |  | Yes |
<a name="usernew"></a>**user-new**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | [user-name](#username) |  | Yes |
| email | string |  | Yes |
| password | string |  | Yes |
| position | string |  | Yes |
<a name="usersanitized"></a>**user-sanitized**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | No |
| email | string |  | No |
| name | [user-name](#username) |  | No |
| position | string |  | No |
| createdAt | Date(ISO String) |  | No |
| updatedAt | Date(ISO String) |  | No |
<a name="errorgeneric"></a>**error-generic**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | integer |  | No |
| message | string |  | No |
| fields | string |  | No |

<a name="fellowname"></a>**fellow-name**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| first | string |  | Yes |
| middle | string |  | No |
| last | string |  | Yes |

<a name="newdocinfo"></a>**new-docinfo**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| createdBy | string |  | No |
| updatedBy | string |  | No |
| createdAt | Date(ISO String) |  | No |
| updatedAt | Date(ISO String) |  | No |

<a name="fellownew"></a>**fellow-new**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | [fellow-name](#fellowname) |  | Yes |
| email | string |  | Yes |
| cohortName | string |  | Yes |
| dLevel | string |  | Yes |

<a name="fellowsanitized"></a>**fellow-sanitized**

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| id | string |  | No |
| email | string |  | No |
| name | [fellow-name](#fellowname) |  | No |
| dLevel | string |  | No |
| cohortName | string |  | No |
| docInfo | [new-docinfo](#newdocinfo) |  | No |



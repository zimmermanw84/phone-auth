# Phone Auth
Build an Authentication service using twilio api.  

### Purpose
- Explore phone auth login flow
- Experiment using non email/password flow

### Tech
- Node.js
- DynamoDB
- Twilio API

### Api (no host on purpose: email me or clone)

```
POST /users
Body: { phone_number: <Valid_10_Digit_Phone_Number> }
```
Returns a JSON object with you phone number. You will receive a text message with a verification code.  

```
POST /users/:phone_number/verify
Body: { verification_code: <Code_That_Was_Returned_From_^^> }
```
Returns an authorization token.  

```
GET /users/:phone_number
Headers: { authorization: <Auth_Token> }
```
Returns User Object.  
## ComplianceCheck

#### Task

To build a compliancy inspector given a url for policy guidelines and another webpage url

#### Structure

- src: Actual code
- dist: Compiled code

#### Steps to run

```
npm install
npm run compile
npm run start

OR

yarn
yarn compile
yarn start
```

#### Test URL

```
POST http://localhost:3000/check-compliance
Request Body:
{
"webpageUrl": "https://example.com/",
"policyUrl": "https://example.com/policy/"
}

Response Body:
On Success Example: {findings: []}
On Fail Example: {error: "An error occurred while checking compliance."}
Validation Error Example: {error: "Mandatory fields missing"}
```

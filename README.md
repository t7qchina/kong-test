# Design Goals
The goal is to build a testing framework that balances usability, maintainability, and functionality. Through this
architecture, QA automation engineers are able to quickly implement the vast majority of standard workflow test cases
after receiving product requirements, while also having the ability to achieve more comprehensive coverage by leveraging
lower-level implementations.

# Architecture
```
+--------------------------------------------------+
|                    TEST CASE                     |
|--------------------------------------------------|
| Perform Specific Purpose Test                    |
| - Create test stories and environments           |
| - Achieve specific testing objectives            |
+--------------------------------------------------+
                          |
                          v
+--------------------------------------------------+
|                      ROLE                        |
|--------------------------------------------------|
| Data & Test Environment Isolation                |
| - Separates test data                            |
| - Isolates test environments                     |         
+-------------------------|------------------------+
                          |
                          v
+--------------------------------------------------+
|                     SERVICE                      |
|--------------------------------------------------|
| Business Logic & Operations                      |
| - Encapsulates business logic                    |
+-------------------------|------------------------+
                          |
                          v
+--------------------------------------------------+
|                  PAGE OBJECT                     |
|--------------------------------------------------|
| UI Interaction                                   |
| - Encapsulates UI elements                       |
| - Provides low-level actions                     |
+--------------------------------------------------+
```

# How to Use
- Download the [Docker-Compose file](https://drive.google.com/file/d/1ZqYLsFhcBAseFofEV8YCcOt4vZnItiBi/view)
- Navigate to the directory where the docker-compose.yml file is located
- Run docker-compose up -d
- Navigate to http://localhost:8002/ in your browser
- Make sure you can access the Kong Gateway UI (Kong Manager)
- Install JRE
- Git clone kong-test repo
- Navigate to kong-test folder
- Run below commands in order
  - npm install
  - npx cypress run
- Open the Allure report by the following command
  - npm run allure:open

# CI/CD

[![Kong Gateway Tests](https://github.com/t7qchina/kong-test/actions/workflows/master-test.yml/badge.svg)](https://github.com/t7qchina/kong-test/actions/workflows/master-test.yml) [![Kong Allure Report](https://img.shields.io/badge/Allure-Report-blue)](https://t7qchina.github.io/kong-test/)

# Issues

#### 1. Duplicate Error Log
- Type: Product Issue
- Repro Steps: Create HTTP Service w/ CA Certificate & Client Certificate Configured
- Expected Result: 3 schema violations (failed conditional validation given value of field 'protocol'; ca_certificates:
  value must be null; client_certificate: value must be null)
- Actual Result: 4 schema violations (failed conditional validation given value of field 'protocol'; failed conditional
  validation given value of field 'protocol'; ca_certificates: value must be null; client_certificate: value must be
  null)
- Issue: Duplicate error logs are generated for the statement "failed conditional validation given value of field '
  protocol'."
- Automated Testcase: Create HTTP Service w/ Certificates Configured

#### 2. HTTPS Service Creation Is Not Blocked When Configured with a Non-Existent CA Certificate
- Type: Product Issue
- Repro Steps: Attempt to create an HTTPS service configured with a non-existent CA certificate.
- Expected Result: The creation request should be rejected.
- Actual Result: The service is created successfully.
- Automated Testcase: Create HTTPS Service w/ Non-Existent CA Certificates Configured

#### 3. Non-RFC Compliant Hostname Permitted in Service URL
- Type: Product Issue
- Repro Steps: Attempt to create an HTTPS service with URL `https://invalid#api.com`
- Expected Result: System should return a validation error (e.g., "Invalid Hostname") and prevent service creation.
- Actual Result: The service is created successfully with invalid result `"host": "invalid"`.
- Automated Testcase: Create Service w/ Special Character Service URL

#### 4. Parameterized URL Incorrectly Parsed During Service Creation
- Type: Product Issue
- Repro Steps: Attempt to create a service with URL `https://example.com/input?q=hello_world` configured as the Service
  URL.
- Expected Result: The service can be created successfully with `"path": "/input?q=hello_world"`
- Actual Result: The service is created successfully with invalid result `"path": "/input"`.
- Automated Testcase: Create Service w/ Parameterized URL

#### 5. Host Does Not Support IPv6 Address in Service URL
- Type: Product Issue
- Repro Steps: Attempt to create a service with URL `http://[2001:4860:4860::8888]:8080/service` configured as the
  Service URL.
- Expected Result: The service can be created successfully.
- Actual Result: The save button is disable, and it blocks us create the service.
- Automated Testcase: Create Service w/ IPv6 Host

#### 6. Unsafe Characters in URL Are Not Properly Processed
- Type: Product Issue
- Repro Steps: Attempt to create a service with URL `http://127.0.0.1:8080/default/test%0d%0aX-Admin:true` configured as
  the
  Service URL.
- Expected Result: The service is created successfully, and any unsafe characters in the URL are properly escaped to
  prevent header injection.
- Actual Result: Unsafe characters (%0d%0a) are not properly processed, leaving the service vulnerable to potential
  header injection.
- Automated Testcase: Create Service w/ URL contains Header Injection
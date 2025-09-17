<h1>Synchronizer QuickStart</h1>

**Getting Started with Synchronizer API by NexHealth is the fastest way to connect to any dental practice management system (PMS).**

**HIPAA Compliant | SOC 2 Certified | 99.9% Uptime | AES-256 Encryption**

<p>
  <img src="https://img.shields.io/badge/dental--api-blue" />
  <img src="https://img.shields.io/badge/node.js-quickstart-brightgreen" />
  <img src="https://img.shields.io/badge/integration-healthtech-important" />
</p>

- **[API Quickstart](https://github.com/synchronizer-api/quickstart)**
- **[Postman Collection](https://god.gw.postman.com/run-collection/19774779-358d4afa-f4b1-4aac-8167-2d73f9a92882)**

  [![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/19774779-358d4afa-f4b1-4aac-8167-2d73f9a92882)

- **[API Reference](https://docs.nexhealth.com/reference/introduction)**
  
- **[Developer Portal](https://developers.nexhealth.com/signup) - Sign up to access your API keys, credentials, and full documentation.**

- **[Quickstart walkthrough in 3 minutes](https://www.loom.com/share/e541491c076c4003b61528b052e3c96f)**

Here you will find a complete example of a simple online booking interface that uses the NexHealth Synchronizer API to schedule appointments.


![app](backend-frontend.png)
_Frontend + backend example using Synchronizer to power real-time appointment booking._

## Supported Practice Management Systems

Synchronizer supports a wide range of dental platforms, including:

- Dentrix (On-Prem & Ascend)
- Eaglesoft
- Open Dental (Cloud + On-Prem)
- Curve Dental
- Carestack
- Denticon
- And more

[Getting started](#getting-started)

[Prerequisites](#prerequisites)

[Clone the repository](#clone-the-repository)

[Configuration](#configuration)

[Installation](#installation)

[Starting the Node server and Frontend app](#starting-the-node-server-and-frontend-app)

## Getting started

Skip the API setup headaches and get hands-on with [NexHealth's Synchronizer API](https://docs.nexhealth.com/reference/introduction). This [Node.js](https://nodejs.org/en/) + [React](https://facebook.github.io/react/) repository gets you from zero to a working healthcare scheduling app in minutes.

Clone, configure your API key, and start booking real appointments through working examples of appointment creation, provider management, and patient scheduling that you can customize for your healthcare application.


## Prerequisites
- Node.js 18.x or higher (20.x recommended) ([Download here](https://nodejs.org/))
- npm 9.x or higher
- Opendental test server configured ([Guide here](https://docs.nexhealth.com/docs/setting-up-an-open-dental-test-server))


## Clone the repository

Using https:

```sh
git clone https://github.com/nex-health/api-quickstart.git
cd api-quickstart
```

Alternatively, if you use ssh:

```sh
git clone git@github.com:nex-health/api-quickstart.git
cd api-quickstart
```

## Configuration

1. To request access to the [NexHealth API](https://docs.nexhealth.com/reference/introduction), fill out this [form](https://www.nexhealth.com/api-request/request-access). You should receive a **subdomain**, a **location_id**, and an **API Key**.

2. Populate an `.env` file in `server/` with the credentials from above.

```sh
cd NexHealth
touch server/.env
```

Add values for the below properties:

| Properties  | Description                                                     |
| :---------- | :-------------------------------------------------------------- |
| API_URL     | Sandbox url e.g: https://sandbox.nexhealth.com |
| SUBDOMAIN   | Refers to a specific institution                                |
| LOCATION_ID | Refers to a specific location                                   |
| API_KEY     | API Key provided by NexHealth                                   |

Please use the sample `.env.example` located under the `server/` folder as a template.

```sh
API_URL=https://sandbox.nexhealth.com
SUBDOMAIN=xxxx
LOCATION_ID=xxxx
API_KEY=xxxx
```

> Note: `.env` files are convenient for local development. Do not run production applications using .env files.

Please contact the NexHealth team if you have any questions about these values.

## Installation

Install the required dependencies using the following command:

```sh

cd ./server
npm install

cd ./frontend
npm install

```

## Starting the Node server

Navigate to the server folder and run the following command:

```sh
cd ./server
npm run start
```

If everything is working, you should see the following message:

```sh
[nodemon] reading config .\nodemon.json
[nodemon] to restart at any time, enter `rs`
[nodemon] or send SIGHUP to 14688 to restart
[nodemon] ignoring: .git node_modules/**/node_modules
[nodemon] watching path(s): *.js routers\*.js
[nodemon] watching extensions: js,json
[nodemon] starting `node --harmony index.js`
[nodemon] spawning
[nodemon] child pid: 11036
[nodemon] watching 8 files
Server is running on port 4000
```

## Starting the Frontend app

To start the frontend app:

```sh
cd ./frontend
npm run start
```

If everything was set up correctly, you should be able to access the UI at the following url: http://localhost:3000/

## Performance

- On-Premise Systems (e.g., Dentrix, Eaglesoft, Open Dental): 
  - Read cycles: every 10–15 minutes
  - Write actions: typically under 30 seconds

- Cloud Systems:
  - Read: varies based on data type and system
  - Write: most write actions complete in 30–60 seconds
 
---

### Need help? We’ll get you unstuck.

Whether you’re exploring or shipping something live, our team’s here to help. Send us a note — we’ll keep you moving.

[developers@nexhealth.com](mailto:developers@nexhealth.com?subject=Quick%20question%20about%20Synchronizer%20API&body=Hi%20Team%2C%0A%0AI%27m%20working%20on%20Synchronizer%20and%20had%20a%20question%20about...)

---


## DESCRIPTION

[Vank] Test Backend Publico.

This app is running behind aws eks and build automated with Github Actions


## ARCHITECTURE
![vank drawio](https://user-images.githubusercontent.com/6846230/168381835-a269f4d3-f865-4a43-9dbc-bf7d6ca9c986.png)



GITHUB WORKFLOW https://github.com/junior-qdls/vank-customers-api/blob/main/.github/workflows/deploy.yml

THE DEPLOYMENT YAML https://github.com/junior-qdls/vank-customers-api/blob/main/eks/deployment.yaml

THE CRON JOB TO RECOLLECT THE INVOICES IS FOUND HERE https://github.com/junior-qdls/vank-customers-api/blob/main/eks/cron.yaml

## CUSTOMER API

Api for creating and updating customers


```bash
# Example of creating a customer
$ curl --location --request POST 'a6ce6ec8faa964ff88cd66338f6a70bc-1364678839.us-east-1.elb.amazonaws.com/customers' --header 'Content-Type: application/json' --data-raw '{
    "companyName": "company-abc",
    "internalCode": "0001",
    "tributaryId": "123456789-2",
    "currency": "USD",
    "apiQuotaCalls": 10,
    "bankRecords": [
        1,
        2,
        3
    ]
}'

# Example of updating a customer
$ curl --location --request PATCH 'a6ce6ec8faa964ff88cd66338f6a70bc-1364678839.us-east-1.elb.amazonaws.com/customers/123456789-2' --header 'Content-Type: application/json' --data-raw '{
    "apiQuotaCalls": 50
}'
```

## INVOICE API

Api for searching invoices and collect from csv API
This uses an api from exchangerate-api in order to calculate the rate for the invoice payments from customer's currency


```bash
# Example of searching invoices
$ 

```
## SYNC INVOICE API
A kubernetes cron job will run every 24 hours ( currently is at 12 am on friday) to sync invoices from csv 

```bash
# Example of searching invoices
$ curl --location --request POST 'a6ce6ec8faa964ff88cd66338f6a70bc-1364678839.us-east-1.elb.amazonaws.com/invoices/synchronizations' 

```

## POSTMAN COLLECTION

The postman collections is here https://github.com/junior-qdls/vank-customers-api/blob/main/vank.postman_collection.json


## HOW TO RUN

1. first set up docker compose found https://github.com/junior-qdls/vank-customers-api/blob/main/docker-compose.yaml
```bash

sudo docker compose up -d
```

2. with npm run

```bash
npm run migrate
```

3. finaly start the app

```bash
npm run start:dev
```

## TEST PLAN

1.- Running sync api to persist all invoices from csv api, should return 114 records.
![image](https://user-images.githubusercontent.com/6846230/168382009-4e2e54f5-2770-4a5c-97fd-46fdb4ba28de.png)

2.- Running sync again to persist all invoices, should be 0 records because they already exists in db.
![image](https://user-images.githubusercontent.com/6846230/168382089-5001f4f2-d4dc-4321-a505-4793a5e93d0b.png)

3.- Create customer
![image](https://user-images.githubusercontent.com/6846230/168382157-decf5b5c-a53c-4c84-a0b7-22b2d6120886.png)


4. Update customer
![image](https://user-images.githubusercontent.com/6846230/168382247-82ab408a-131f-4187-950b-62ec8bbb93b3.png)
<img width="1099" alt="image" src="https://user-images.githubusercontent.com/6846230/168382518-6fc792ed-ad71-47e7-9518-1eaa095621b7.png">


5. Update non existing customer
![image](https://user-images.githubusercontent.com/6846230/168382450-866c6bd2-729f-431d-a48b-ee02a92cea7b.png)


6. Search invoices
![image](https://user-images.githubusercontent.com/6846230/168385234-4a1cab6e-ad4d-4e6a-97a8-e56fbbd7ef45.png)





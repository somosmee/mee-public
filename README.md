[![Build Status](https://travis-ci.com/somosmee/mee.svg?token=ibFoUs4Eey7Bsz93pLds&branch=master)](https://travis-ci.com/somosmee/mee)

# Mee

# Development Principles (Agile Manifesto)

**Values**

- Indivíduos e interações acima de processos e ferramentas
- Software que funciona acima de documentação extensa
- Colaboração com o cliente acima de contratos de negociação
- Responder rapidamente a mudança acima de seguir um plano

**Principles**

- Satisfazer clientes através de entregas rápidas e continuas de trabalho valioso.
- Quebrar grandes tarefas em pequenas tarefas que podem ser completadas facilmente.
- Reconhecer que o melhor trabalho surge através de times auto-organizados.
- Fornecer a indivíduos motivados com ambiente, suporte que eles precisam e confiar neles para entregar o trabalho.
- Criar processos que promovem esforço sustentável.
- Manter um progresso constante de trabalho completo.
- Abraçar mudanças sempre, até quando aparecem tarde no projeto.
- Juntar o time do projeto e os clientes diariamente ao longo do projeto.
- Fazer o time refletir em intervalos regulares em como se tornar mais eficiente e ajustar os comportamentos de acordo.
- Medir progresso pela quantidade de trabalho completo.
- Buscar excelência de forma continua
- Aproveitar mudanças para obter uma vantagem competitiva.

# Project and Business Overview

Business Planning and Project Overview

https://miro.com/app/dashboard/

Project Management

https://www.issue.sh (boards and scrum on github)

# Deployment Google Cloud

Set a env variable to store you project id

```
PROJECT_ID=[YOUR_PROJECT_ID]
```

Define gcloud project you are working with

```
gcloud config set project $PROJECT_ID
```

Define your compute zone

```
# set env variable for zone
COMPUTE_ZONE=us-central1-a

# set zone
gcloud config set compute/zone $COMPUTE_ZONE
```

Create cluster

```
# set cluster name
CLUSTER_NAME=mee-cluster

# create cluster (enable Kubernetes Engine API if necessary)
gcloud container clusters create $CLUSTER_NAME --machine-type=e2-standard-2 --num-nodes=1
```

Get cluster auth credentials

```
gcloud container clusters get-credentials $CLUSTER_NAME
```

## Kubernetes manual commands

Create services

```
kubectl create -f kubernetes/production --recursive
```

Delete services

```
kubectl delete deployments,services,ingress --selector=env=production
```

## Development

```
# up and run the containers
docker-compose up

# setup mongodb replicaset
./docker-replica-up.sh

# shutdown everything
docker-compose down
```

## HTTPS

https://cloud.google.com/kubernetes-engine/docs/how-to/ingress-multi-ssl?authuser=1

https://estl.tech/configuring-https-to-a-web-service-on-google-kubernetes-engine-2d71849520d

```
certbot -d www.somosmee.com --manual --logs-dir certbot --config-dir certbot --work-dir certbot --preferred-challenges dns certonly

certbot -d somosmee.com --manual --logs-dir certbot --config-dir certbot --work-dir certbot --preferred-challenges dns certonly

# put on tls.crt
cat fullchain.pem | base64
<LONG_BASE64_ENCODED_CERT>

# put on tls.key
cat privkey.pem | base64
<LONG_BASE64_ENCODED_KEY>
```

> To non-interactively renew _all_ of your certificates, run "certbot renew"

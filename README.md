# Sosyal Hak Rehberi

Canonical frontend repository: **SocialRightLabs/sosyalhakrehberi.com**

Public frontend for **SocialRightOS**.

This repository renders the public experience, delegates decisions to the backend API, and stays render-only by design.

* Website: [https://sosyalhakrehberi.com/](https://sosyalhakrehberi.com/)
* Support: [https://github.com/sponsors/SocialRightLabs](https://github.com/sponsors/SocialRightLabs)
* Contact: [info@sosyalhizmetdanismani.com](mailto:info@sosyalhizmetdanismani.com)

---

## What this is

Sosyal Hak Rehberi is a public guidance platform that helps people understand their social rights in a way that is:

* understandable
* accessible
* actionable

It helps users:

* see which benefits may apply to them
* understand the decision logic
* get the next step without hidden rules in the UI

> This is not an official government system. It provides guidance only.

---

## Why it exists

Many people:

* do not know which rights they have
* submit incomplete or incorrect applications
* struggle with complex public-service workflows

This platform exists to:

* reduce failed applications
* improve awareness
* lower friction for public-benefit access

---

## Mission

Provide a clear, structured, and accessible guidance system for social-rights eligibility and next-step navigation.

## Vision

Build a scalable **social-rights operating system** that can serve millions of users.

## Public Value

This platform:

* helps users act with confidence
* supports fairer access to public resources
* reduces friction between citizens and institutions

---

## Supporting the project

This project is public-benefit infrastructure.

Support helps to:

* maintain quality
* keep the platform available
* reach more people
* reduce operating costs

---

## Product position

* `SocialRightOS` -> backend decision engine
* `sosyalhakrehberi.com` -> canonical frontend repo
* legacy `sosyalhakrehberi-web` -> archive after cutover

Frontend:

* UX
* SEO
* routing
* presentation

Backend:

* rules
* eligibility
* traceability
* explanation

## Core principle

> Backend decides, frontend renders

Frontend:

* does not decide
* does not calculate thresholds
* does not contain policy logic

---

## How it works

1. User starts the test
2. User enters facts
3. Frontend sends the request to the backend
4. Backend evaluates
5. Frontend displays:
   * decision
   * explanation
   * next step

---

## Scaling and sustainability

Each test request triggers backend processing.

As usage grows:

* API load increases
* hosting cost increases
* maintenance cost increases

To stay sustainable, these layers must remain reliable:

* backend engine
* hosting
* development
* maintenance

---

## Contributing

Use Issues for:

* bugs
* policy updates
* improvements

Use Discussions for:

* ideas
* feedback
* public requests

---

## Technical notes

* Angular frontend
* static deployment on Vercel
* build output: `dist/syncfusion-angular-app`
* render-only frontend
* sponsor/support strategy inherited from legacy frontend and kept here

## Local development

```bash
npm ci
npm run build
npm run start
```

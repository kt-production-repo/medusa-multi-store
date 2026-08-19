# Ecommerce Recipe

This recipe provides the general steps to create an ecommerce store with Medusa.

## Overview

Businesses use ecommerce stores to:

- Provide an online catalog for customers.
- Accept customer orders and payment.
- Manage their store's data and logistics.

Medusa provides all essential commerce features out-of-the-box. Businesses can go live and start selling without making any adjustments.

Businesses can also power-up their store by integrating third-party services for payments, fulfillment, and more.

[How Tekla created an ecommerce store using Medusa](https://medusajs.com/blog/tekla/).

***

## Install Ecommerce Store Powered by Medusa

You can use the following command to install an ecommerce store with Medusa:

```bash
npx create-medusa-app@latest --with-nextjs-starter
```

This installs:

- The Medusa application, which is composed of a Node.js server and a Medusa Admin dashboard. The dashboard opens right after the installation finishes, where you can create a user and start managing your store's data.
- A [Next.js Starter Storefront](https://docs.medusajs.com/resources/nextjs-starter) that connects to your Medusa application to provide customers with ecommerce features.

***

## Integrate Third-Party Services

You can integrate third-party services and tools, customizing the architecture and commerce features of your store.

For example, you can integrate [Stripe](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe) to accept payments, or [SendGrid](https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid) to send emails to customers.

[Integrations](https://docs.medusajs.com/integrations): Check out available integrations for your Medusa application.

***

## Deploy the Medusa Application

The most efficient way to deploy your Medusa application is to use [Cloud](https://docs.medusajs.com/cloud). Cloud is our managed services offering that makes deploying and operating Medusa applications possible without having to worry about configuring, scaling, and maintaining infrastructure. Cloud hosts your server, Admin dashboard, database, and Redis instance.

With Cloud, you maintain full customization control as you deploy your own modules and customizations directly from GitHub:

- Push to deploy.
- Multiple testing environments.
- Preview environments for new PRs.
- Test on production-like data.

Our documentation also provides a step-by-step guides to deploy your Medusa application and the Next.js Starter Storefront.

- [Sign up for Cloud](https://docs.medusajs.com/cloud): Learn more about Cloud and sign up to get started.
- [Deployment Guides](https://docs.medusajs.com/deployment): Learn how to deploy the Medusa application and Next.js Starter Storefront.

***

## Add Custom Features

Along with the extensive ecommerce features, Medusa also provides the architecture and Framework to customize your application and build custom features that are tailored for your business use case.

To learn how to develop customizations with Medusa, refer to the [Get Started](https://docs.medusajs.com/docs/learn) documentation.

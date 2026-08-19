# Agent Skills for Medusa

Medusa provides [agent skills](https://github.com/medusajs/medusa-agent-skills) to assist you in learning and building with Medusa. You can use them as plugins in Claude Code, or copy them into other AI tools that support custom skills.

These skills are useful to developers and non-technical shop owners looking to build stores efficiently, get assistance in their development, and learn Medusa interactively.

## Medusa Development Assistance Skills

If you want assistance in building features with Medusa, install the `medusa-dev` plugin and its skills:

### Claude Code

```bash
claude # start claude code
/plugin marketplace add medusajs/medusa-agent-skills
/plugin install medusa-dev@medusa
```

### Other AI Agents

```bash
npx skills add medusajs/medusa-agent-skills
# choose the following skills:
# - building-with-medusa
# - building-admin-dashboard-customizations
# - building-storefronts
# - db-generate
# - db-migrate
# - new-user
```

Then, you can ask Claude Code (or other AI agents) to build Medusa features, fix bugs, and more. They will use the skills in the plugin to provide you with accurate and relevant Medusa code.

Examples of prompts you can use:

```bash title="Example Prompts"
Implement a product reviews feature. Authenticated customers can add reviews. Admin users can view and approve or reject reviews from the dashboard
Create a wishlist feature where customers can save products. I need API routes for adding/removing items and retrieving the wishlist.
Add a widget to the product detail page in the admin that allows managing related products. Admin users should be able to select which products are related using a searchable table.
Help me integrate the custom reviews API into my Next.js storefront. Show product reviews on the product detail page with pagination.
```

### Available Commands

The plugin also provides the following commands (as skills) you can use with your AI agents:

|Command|Description|
|---|---|
|\`/medusa-dev:db-migrate\`|Run database migrations for the Medusa project.|
|\`/medusa-dev:db-generate \<module-name>\`|Generate migrations for a custom module.|
|\`/medusa-dev:new-user \<email> \<password>\`|Create an admin user with the specified email and password.|

## Ecommerce Storefront Best Practices

Medusa provides the `ecommerce-storefront` plugin with a `storefront-best-practices` skill to help you build ecommerce storefronts for any ecommerce platform, including Medusa, and any frontend framework, such as Next.js or Tanstack Start.

To install the plugin in Claude Code (or other AI agents), run the following commands:

### Claude Code

```bash
claude # start claude code
/plugin marketplace add medusajs/medusa-agent-skills
/plugin install ecommerce-storefront@medusa
```

### Other AI Agents

```bash
npx skills add medusajs/medusa-agent-skills
# choose the following skill:
# - storefront-best-practices
```

You can then run prompts to make changes to your ecommerce storefront or build it from scratch. For example:

```bash title="Example Prompts"
Build a Next.js ecommerce storefront that uses Medusa as the backend. The storefront should have product listing, product detail, cart, and checkout pages.
Add a megamenu to the storefront's header that displays product categories and subcategories. The menu should be responsive and work well on mobile devices.
```

***

## Interactive Learning

If you're a Medusa beginner, and you want to learn the basics of Medusa, install the `learn-medusa` plugin or its skill to start an interactive learning experience:

### Claude Code

```bash
claude # start claude code
/plugin marketplace add medusajs/medusa-agent-skills
/plugin install learn-medusa@medusa
```

### Other AI Agents

```bash
npx skills add medusajs/medusa-agent-skills
# choose the following skill:
# - learning-medusa
```

Then, start the learning experience with this prompt:

```bash title="Prompt"
I want to learn Medusa.
```

You can also run the skill using the `/learn-medusa:learning-medusa` command in Claude Code.

This starts the interactive learning experience where you'll learn Medusa concepts step-by-step by building a brands feature, similar to the [Brands tutorial](https://docs.medusajs.com/learn/customization/custom-features). You will:

1. Create a Brand Module with API routes to manage brands.
2. Link brands to products to associate products with brands.
3. Customize the Medusa Admin dashboard to allow admin users to manage brands.

By the end, you'll have a solid understanding of Medusa's architecture and how to build custom features.

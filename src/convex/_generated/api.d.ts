/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as blogs from "../blogs.js";
import type * as carts from "../carts.js";
import type * as categories from "../categories.js";
import type * as collections from "../collections.js";
import type * as inventory from "../inventory.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as product_recommendations from "../product-recommendations.js";
import type * as product_variants from "../product-variants.js";
import type * as products from "../products.js";
import type * as reviews from "../reviews.js";
import type * as search from "../search.js";
import type * as seo from "../seo.js";
import type * as users from "../users.js";
import type * as wishlists from "../wishlists.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  blogs: typeof blogs;
  carts: typeof carts;
  categories: typeof categories;
  collections: typeof collections;
  inventory: typeof inventory;
  notifications: typeof notifications;
  orders: typeof orders;
  "product-recommendations": typeof product_recommendations;
  "product-variants": typeof product_variants;
  products: typeof products;
  reviews: typeof reviews;
  search: typeof search;
  seo: typeof seo;
  users: typeof users;
  wishlists: typeof wishlists;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

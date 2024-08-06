import type { User } from '$lib/database/schema';

declare global {
  namespace App {
    interface Locals {
      user: User | null;
    }
  }
}

export {};
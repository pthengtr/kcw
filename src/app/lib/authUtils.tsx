"use server";
import { signIn, signOut } from "@/app/auth";

export async function authSignIn() {
  await signIn();
}

export async function authSignOut() {
  await signOut({ redirectTo: "/", redirect: true });
}

/*this is write client its code is nearly the same as client.ts but we take the general token that we created from sanity to make anyone (authenticated or not) to update
the number of views */

import "server-only"; // this package ensure that this code is only run on server

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, token } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

if (!writeClient.config().token) throw new Error("write token not found");

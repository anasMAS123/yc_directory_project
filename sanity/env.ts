export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-12";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);
/*that token that we generated from sanity is not unique for user or smthing it is just a token any one can use intutivly to update the number of views
you do not need to login or smth to have it its provided for anyone come the the website 
*/
//later i will use a unique token for authenticated users to create their own startups
export const token = process.env.SANITY_WRITE_TOKEN;
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

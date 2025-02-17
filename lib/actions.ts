"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";

export async function createPitch(state: any, form: FormData, pitch: string) {
  const session = await auth();
  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }
  // array destructuring : i know that formData gives me pairs of [key,value] tuples
  //extract the first value using array destructuring and give it a name (ex:Key)
  //then use filter method that returns the element has Key !== "pitch"
  //
  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([Key]) => Key !== "pitch")
  );
  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const startup = {
      title,
      description,
      category,
      image: link,
      views: 0,
      slug: {
        _type: slug, // the type of any slug is the slug itself
        current: slug, // slug value
      },
      author: {
        _type: "reference", // in Sanity this is reference to another schema
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...startup });
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
}

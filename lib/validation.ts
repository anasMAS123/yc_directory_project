import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(20).max(500),
  category: z.string().min(2).max(20),
  link: z
    .string()
    .url()
    .refine(async (url) => {
      try {
        const res = await fetch(url, { method: "HEAD" });
        const contentType = res.headers.get("content-type");

        return contentType?.startsWith("image/");
      } catch {
        return false;
      }
    }),
  pitch: z.string().min(10),
});
// refine -> used to test some operations or conditions
// {methd:"HEAD"} do not fetch the actual data but fetch its header (contains informations about the data)
// res.headers.get("content-type") -> target the header that called content-type(contain the type of data)
//contentType?.startsWith("image/") -> if type is image return true , else return false

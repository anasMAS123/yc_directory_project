import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
// import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  // this is how you fetch your query from Sanity(this is not real time fetch)
  // const posts = await client.fetch(STARTUPS_QUERY);

  //this is real time fetch
  const posts = await client.fetch(STARTUPS_QUERY, params, { useCdn: false });
  console.log(posts);

  // replacer -> null -> function or array that change the returned json
  // space -> 2 ->white space for readability

  const session = await auth();

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch your startup , Connect With Enterpreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas , Vote on Pitches , and Get Noticed in Virtual
          Competitions.
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard, index: number) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}

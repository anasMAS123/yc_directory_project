import GitHub from "next-auth/providers/github";
import NextAuth from "next-auth";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_QUERY } from "./sanity/lib/queries";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  // what are callbacks ? they are functions that we want to implement once the user Signed in for example
  callbacks: {
    //this is implemeted once the user logged in we get access to some informations like user, account, profie, etc
    // check if user has that id (comes from next auth) and if not found create one
    async signIn({
      user: { name, email, image },
      profile: { id, login, bio },
    }) {
      // i am trying to get user that has id(not _id) == id from profile
      //most of time you must configure useCdn to false to get fresh data and this is crucial for auth informations to get up-to-dated token and id directly
      const exisitngUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_QUERY, { id });
      // in case it is not found we create it and give him id = profile.id
      if (!exisitngUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }
      return true;
    },
    // we want to modify our auth token a little bit
    async jwt({ token, account, profile }) {
      if (account && profile) {
        // now we call for that user again that have already id == profile.id and sign his _id(that is originally provided by sanity) to his token
        //so we now has user has id == id from profile(or you can say that authjs gives to us and we have token of this session that has _id from Sanity as its id )
        //most of time you must configure useCdn to false to get fresh data and this is crucial for auth informations to get up-to-dated token and id directly
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_QUERY, {
            id: profile?.id,
          });
        token.id = user?._id;
      }

      return token;
    },
    // now we added this to our jwt token but now we want to have this token.id in our session to be easy to deal with
    // it is important to have all wanted info in session because this is what we consume directly in our pages
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});

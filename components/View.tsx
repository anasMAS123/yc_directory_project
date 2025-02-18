import React from "react";
import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { unstable_after as after } from "next/server";

const View = async ({ id }: { id: string }) => {
  // usecdn -> false insure we get real time data
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  //after ->  we put here the async code that we do not want it to block the rendering process

  /* as you see no need to tell sanity we update startup and not schema because this id is originally -> _id that is provided by sanity 
  and it is globally unique so automatically sanity can know that id is startup id not author id so sanity update it automatically 
   */

  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">Views:{totalViews}</span>
      </p>
    </div>
  );
};

export default View;

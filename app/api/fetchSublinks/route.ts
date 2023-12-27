import axios from "axios";
import { NextResponse } from "next/server";
import Sitemapper from "sitemapper";

export async function POST(req: Request) {
  const { mainURL } = await req.json();

  try {
    // Check if the mainURL is provided
    if (!mainURL || mainURL === "") {
      return new NextResponse("website url not found", {
        status: 402
      });
    }

    // Fetch sublinks of the main URL using sitemap
    const sitemap = new Sitemapper({
      url: `https://${mainURL}/sitemap.xml`
    });
    const { sites } = await sitemap.fetch();

    console.log("sites", sites);

    // Get the FETCH_SUBLINKS environment variable
    let FETCH_SUBLINKS = process.env.FETCH_SUBLINKS;
    
    // Check if FETCH_SUBLINKS is defined
    if (!FETCH_SUBLINKS) {
      return new NextResponse("FETCH_SUBLINKS not found", {
        status: 400
      });
    }

    // Fetch additional sublinks using an external service
    const fetchSublinks = await axios.post(FETCH_SUBLINKS, { URL: `https://${mainURL}` });

    // Merge, clean up, and filter the URLs
    const filteredSites = Array.from(new Set([...sites, ...fetchSublinks?.data]
      .map((url) => url.trim())
      .filter((url) => url !== "")
      .map((url) => url.replace(/\/+$/, ""))
      .filter((url) => (url.startsWith(`https://${mainURL}`) || url.startsWith(`https://www.${mainURL}`)) && !url.includes('sitemap') && !url.includes('#'))));
      
      console.log("sites2", filteredSites);

    // Return the filtered sites as JSON
    return NextResponse.json(filteredSites);
  } catch (error: any) {
    // Handle errors and return an appropriate response
    console.log("error", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}

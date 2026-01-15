import {
  getCompetitions,
  getEvents,
  getPersons,
  getStates,
} from "@/db/queries";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const states = await getStates();
  const events = await getEvents();
  const persons = await getPersons();
  const competitions = await getCompetitions();

  const teamUrls = states.map((state) => {
    return {
      url: `https://www.cubingmexico.net/teams/${state.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    };
  });

  const stateKinchUrls = states.map((state) => {
    return {
      url: `https://www.cubingmexico.net/kinch/${state.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    };
  });

  const singleRankingUrls = events.map((event) => {
    return {
      url: `https://www.cubingmexico.net/rankings/${event.id}/single`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  const averageRankingUrls = events.map((event) => {
    return {
      url: `https://www.cubingmexico.net/rankings/${event.id}/average`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  const singleResultsRankingUrls = events.map((event) => {
    return {
      url: `https://www.cubingmexico.net/rankings/${event.id}/single/results`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  const averageResultsRankingUrls = events.map((event) => {
    return {
      url: `https://www.cubingmexico.net/rankings/${event.id}/average/results`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  const personUrls = persons.map((person) => {
    return {
      url: `https://www.cubingmexico.net/persons/${person.wcaId}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    };
  });

  const competitionUrls = competitions.map((competition) => {
    return {
      url: `https://www.cubingmexico.net/competitions/${competition.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    };
  });

  return [
    {
      url: "https://www.cubingmexico.net",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://www.cubingmexico.net/teams",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...teamUrls,
    {
      url: "https://www.cubingmexico.net/competitions",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...competitionUrls,
    {
      url: "https://www.cubingmexico.net/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...singleRankingUrls,
    ...averageRankingUrls,
    ...singleResultsRankingUrls,
    ...averageResultsRankingUrls,
    {
      url: "https://www.cubingmexico.net/records",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: "https://www.cubingmexico.net/kinch",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...stateKinchUrls,
    {
      url: "https://www.cubingmexico.net/kinch/teams",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: "https://www.cubingmexico.net/sor/single",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: "https://www.cubingmexico.net/sor/average",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: "https://www.cubingmexico.net/sor/single/teams",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: "https://www.cubingmexico.net/sor/average/teams",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: "https://www.cubingmexico.net/persons",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...personUrls,
    {
      url: "https://www.cubingmexico.net/organizers",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://www.cubingmexico.net/delegates",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://www.cubingmexico.net/members",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://www.cubingmexico.net/faq",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://www.cubingmexico.net/logo",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://www.cubingmexico.net/tools",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}

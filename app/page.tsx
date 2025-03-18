import { notFound } from "next/navigation";
import Link from "next/link";
import { NOTION_PAGE_IDS } from "./constants";

export default async function Page() {
  if (!process.env.NOTION_API_KEY) return notFound();

  return (
    <ul>
      {NOTION_PAGE_IDS.map((notionPageId) => (
        <li key={notionPageId}>
          <Link href={`/assistant/${notionPageId}`}>{notionPageId}</Link>
        </li>
      ))}
    </ul>
  );
}

import { NOTION_PAGE_IDS } from "@/app/constants";
import cn from "classnames";
import { notFound } from "next/navigation";

type IText = {
  type: string;
  text: {
    content: string;
    link: null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: "default";
  };
  plain_text: string;
  href: null;
};

type Content = {
  rich_text: IText[];
  color: string;
};

type ParagraphBlock = {
  type: "paragraph";
  paragraph: Content;
};

type Heading1Block = {
  type: "heading_1";
  heading_1: Content;
};

type Heading2Block = {
  type: "heading_2";
  heading_2: Content;
};

type Heading3Block = {
  type: "heading_3";
  heading_3: Content;
};

type CalloutBlock = {
  type: "callout";
  callout: Content;
};

type NumberedListBlock = {
  type: "numbered_list_item";
  numbered_list_item: Content;
};

type BulletedListBlock = {
  type: "bulleted_list_item";
  bulleted_list_item: Content;
};

type CodeBlock = {
  type: "code";
  code: Content;
};

type Block = {
  id: string;
} & (
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | CalloutBlock
  | NumberedListBlock
  | BulletedListBlock
  | CodeBlock
);

type NotionPage = {
  object: string;
  results: Block[];
  next_cursor: null;
  has_more: boolean;
  type: "block";
  block: unknown;
  request_id: string;
};

const getNotionPage = async (PAGE_ID: string): Promise<NotionPage> => {
  const result = await fetch(
    `https://api.notion.com/v1/blocks/${PAGE_ID}/children`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
    }
  );
  return await result.json();
};

const Text = ({ text }: { text: IText }) => {
  return (
    <span
      className={cn(
        text.annotations.bold && "font-bold",
        text.annotations.italic && "italic",
        text.annotations.strikethrough && "line-through",
        text.annotations.underline && "underline",
        text.annotations.code && "bg-gray-100 p-1 rounded-md"
      )}
    >
      {text.text.content}
    </span>
  );
};

const NotionPage = ({ page }: { page: { results: Block[] } }) => {
  if (!page.results) return null;
  return (
    <article>
      {page.results.map((block: Block) => {
        if (block.type === "heading_1") {
          return (
            <h1 key={block.id}>
              {block.heading_1.rich_text.map((t: IText, index: number) => (
                <Text key={index} text={t} />
              ))}
            </h1>
          );
        }
        if (block.type === "heading_2") {
          return (
            <h2 key={block.id}>
              {block.heading_2.rich_text.map((t: IText, index: number) => (
                <Text key={index} text={t} />
              ))}
            </h2>
          );
        }
        if (block.type === "heading_3") {
          return (
            <h3 key={block.id}>
              {block.heading_3.rich_text.map((t: IText, index: number) => (
                <Text key={index} text={t} />
              ))}
            </h3>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={block.id}>
              {block.paragraph.rich_text.map((t: IText, index: number) => (
                <Text key={index} text={t} />
              ))}
            </p>
          );
        }
        if (block.type === "callout") {
          return (
            <div key={block.id} className="bg-blue-100 p-4 rounded-md">
              {block.callout.rich_text.map((t: IText, index: number) => (
                <Text key={index} text={t} />
              ))}
            </div>
          );
        }
        if (block.type === "numbered_list_item") {
          return (
            <li key={block.id}>
              {block.numbered_list_item.rich_text.map(
                (t: IText, index: number) => (
                  <Text key={index} text={t} />
                )
              )}
            </li>
          );
        }
        if (block.type === "bulleted_list_item") {
          return (
            <li key={block.id}>
              {block.bulleted_list_item.rich_text.map(
                (t: IText, index: number) => (
                  <Text key={index} text={t} />
                )
              )}
            </li>
          );
        }
        if (block.type === "code") {
          return (
            <pre key={block.id}>
              {block.code.rich_text.map((t: IText, index: number) => (
                <Text key={index} text={t} />
              ))}
            </pre>
          );
        }
        return null;
      })}
    </article>
  );
};

export function generateStaticParams() {
  return NOTION_PAGE_IDS.map((notionPageId) => ({
    notionPageId,
  }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ notionPageId: string }>;
}) {
  const { notionPageId } = await params;

  if (!process.env.NOTION_API_KEY) return notFound();

  const page = await getNotionPage(notionPageId);

  return <NotionPage key={page.request_id} page={page} />;
}

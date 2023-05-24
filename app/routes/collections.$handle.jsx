import { useLoaderData } from "@remix-run/react";
import { json } from "@shopify/remix-oxygen";
import ProductGrid from "~/components/ProductGrid";

export async function loader({params, context}) {
    const {handle} = params;
    const {collection} = await context.storefront.query(COLLECTION_QUERY, {
        variables: {
            handle
        }
    })
    if (!collection) {
        throw new Response(null, {status:404})
    }

    return json({
        collection
    })
}


export default function Collection() {
    const {collection} = useLoaderData()

    return (<>
       <header className="grid w-full gap-8 py-8 justify-items-start">
        <h1 className="text-4xl whitespace-pre-wrap font-bold inline-bolck">{collection.title}</h1>
        {collection.description && (
            <div className="flex items-baseline justify-between w-full">
                <div>
                    <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">{collection.description}</p>
                </div>
            </div>
        )}
        </header>
        <ProductGrid 
            collection={collection}
            url={`/collections/${collection.handle}`}
        />
    </>)
  }

  const seo = ({data}) => ({
    title: data?.collection?.title,
    description: data?.collection?.description.substr(0, 154),
  });
  
  export const handle = {
    seo,
  };
  
  
  const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 4) {
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
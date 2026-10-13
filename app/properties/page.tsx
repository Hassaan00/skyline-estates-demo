import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Listings from "@/components/Listings";
export const metadata = { title: "Properties for sale & rent in Dubai", description: "Browse luxury apartments, penthouses and villas for sale and rent across Dubai and Abu Dhabi." };
export default function Page({ searchParams }: { searchParams: Record<string, string> }) {
  return (<><Nav /><main id="main" className="container-x pb-24 pt-32">
    <p className="eyebrow">Residences</p><h1 className="h2 mt-5">Find your place<br /><em className="text-accent-200">in the skyline.</em></h1>
    <div className="mt-12"><Listings key={JSON.stringify(searchParams)} init={searchParams} /></div>
  </main><Footer /></>);
}

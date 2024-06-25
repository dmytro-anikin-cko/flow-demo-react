import Flow from "@/components/Flow"
import Link from "next/link"

export default function Checkout(){
    return (
        <section>
            <div>
                <p>Checkout Page</p>
            </div>
            <div>
                <Link className="link link-primary" href={'/'}>Back to Home</Link>
            </div>
            <div>
                <Flow />
            </div>
        </section>
    )
}
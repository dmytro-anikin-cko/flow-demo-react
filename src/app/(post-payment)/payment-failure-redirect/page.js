import Link from "next/link";

export default function PaymentFailure(){
    return (
        <div>
            <p>Payment Failure (redirect)!❌</p>
            <Link className="link link-primary" href={"/"}>Home</Link>
        </div>
    )
}
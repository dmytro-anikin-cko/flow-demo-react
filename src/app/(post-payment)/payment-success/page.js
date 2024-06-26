import Link from "next/link";

export default function PaymentSuccess(){
    return (
        <div>
            <p>Payment Success!🎉</p>
            <Link className="link link-primary" href={"/"}>Home</Link>
        </div>
    )
}
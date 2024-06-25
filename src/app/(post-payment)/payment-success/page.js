import Link from "next/link";

export default function PaymentSuccess(){
    return (
        <div>
            <p>Payment Success!🎉</p>
            <Link href={"/"}>Home</Link>
        </div>
    )
}
import Link from "next/link";

export default function PaymentFailure(){
    return (
        <div>
            <p>Payment Failure!❌</p>
            <Link href={"/"}>Home</Link>
        </div>
    )
}
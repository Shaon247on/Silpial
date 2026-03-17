import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href={"/"}>
      <div className="rounded-lg overflow-hidden">
        <Image
        src={"/logo.png"}
        alt="Logo Image"
        width={122}
        height={50}
        className="object-cover max-h-12"
        />
      </div>
    </Link>
  );
}

export default Logo;

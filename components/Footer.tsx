import Link from "next/link";
import Image from "next/image"
import logo from "../public/logo.webp"

export default function Footer() {
  return (
    <footer role="contentinfo" className="pb-5">
      <Link prefetch={false} href={"/"}>
        <Image
          src={logo}
          alt={"Unlock My Data"}
        />
      </Link>
      <nav>
        <ul className="text-black flex flex-col gap-y-3 md:flex md:flex-row md:justify-center md:gap-x-6 w-full px-5 mt-5 md:mt-0">
          <li>
            <Link href={"/todo"} className="hover:text-blue">
              <button>TODO - Link Footer</button>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

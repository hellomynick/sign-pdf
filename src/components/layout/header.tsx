import Image from "next/image";
import iconPdf from "image/pdf-icon.png";

export default function Header() {
  return (
    <div className="flex box-border py-3 px-16 items-center shadow-[inset_0_-1px_0px_0px_rgba(51,51,51,1)]">
      <div className="flex justify-center items-center gap-4">
        <Image src={iconPdf}
               alt="logo"
               width={40}
               priority/>
        <div className="text-3xl">𝙿𝙳𝙵 𝚂𝙸𝙶𝙽</div>
      </div>
      <div className="flex text-gray-700"></div>
    </div>
  );
}
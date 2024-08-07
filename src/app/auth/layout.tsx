import Image from "next/image";
import logo from "../../asset/icon.svg";

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex items-center w-screen h-screen">
            <div className="flex flex-col justify-center items-center gap-4 bg-dark-primary w-1/2 h-full text-white">
                <Image src={logo} width={100} height={100} alt="logo" />
                <h1 className="font-bold text-6xl text-white">feedback.</h1>
                <p>happy to know that you wanna be part of us : &#41;&#41;</p>
            </div>
            <div className="w-5/6">{children}</div>
        </div>
    );
}
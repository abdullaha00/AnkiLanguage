
import { GiCardPick } from "react-icons/gi";
import { TbLanguageKatakana } from "react-icons/tb";
import { GrScan } from "react-icons/gr";

import Link from "next/link";

export default function SideNav() {

    type sidenavEntryProps = {

        icon: JSX.Element;
        link: string;

    }

    const SidenavEntry = ({ icon, link } : sidenavEntryProps) => {
        return (
            <Link href={link} className="sidenavEntry">
                {icon}
            </Link>)
    };
  

    return (
        

        <div className="fixed top-0 left-0 h-screen w-24 m-0
                        flex flex-col
                        bg-gray-900 text-white shadow-lg"
        
            
        >
            <TbLanguageKatakana size="48"/>

            <SidenavEntry icon={<GiCardPick size="48"/>} link="/anki" />
            <SidenavEntry icon={<GrScan size="48"/>} link="/ocr"/>

        </div>

    );
}
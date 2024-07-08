
import { GiCardPick } from "react-icons/gi";
import { TbLanguageKatakana } from "react-icons/tb";

import Link from "next/link";

export default function SideNav() {

    const SidenavEntry = ({ icon }) => {
        return (
            <Link href="/main" className="sidenavEntry">
                {icon}
            </Link>)
    };
  

    return (
        

        <div className="fixed top-0 left-0 h-screen w-24 m-0
                        flex flex-col
                        bg-gray-900 text-white shadow-lg"
        
            
        >
            <TbLanguageKatakana size="48"/>

            <SidenavEntry icon={<GiCardPick size="48"/>} />


        </div>

    );
}
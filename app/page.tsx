import Image from "next/image";
import SideNav from "../components/AppSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {

  return (
    <div className="flex justify-center items-center ">
        <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
          <CardTitle>Leaner stats</CardTitle>

          </CardHeader>
          <CardContent>

            <p>0 Words known!</p>
          </CardContent>

        </Card>
        </div>
  </div>
  );
}
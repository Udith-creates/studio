
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BikeIcon } from "@/components/icons/bike-icon";


export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary to-blue-700 rounded-xl shadow-2xl text-primary-foreground">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex justify-center">
             <BikeIcon className="h-20 w-20 text-accent" />
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-bold mb-6">
            Welcome to BroRide!
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-body">
            Share your daily commute, save money, reduce your carbon footprint, and make new friends along the way.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-headline shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Link href="/search-routes">
                Find a Ride <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 font-headline shadow-lg transform hover:scale-105 transition-transform duration-200">
              <Link href="/post-route">
                Offer a Ride <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-headline font-semibold text-center mb-12">
          How BroRide Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
            <CardHeader className="p-0">
               <Image
                  src="https://placehold.co/600x400.png"
                  alt="A person posting a route on their phone"
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover rounded-t-lg"
                  data-ai-hint="map phone"
                />
            </CardHeader>
            <CardContent className="p-6 text-center flex-grow flex flex-col">
              <CardTitle className="font-headline text-2xl mb-2">Post Your Route</CardTitle>
              <CardDescription className="text-center font-body text-lg">
                Riders can easily post their daily routes, including start point, destination, timing, and days of the week.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
            <CardHeader className="p-0">
               <Image
                  src="https://placehold.co/600x400.png"
                  alt="Friends carpooling together"
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover rounded-t-lg"
                  data-ai-hint="carpooling friends"
                />
            </CardHeader>
            <CardContent className="p-6 text-center flex-grow flex flex-col">
              <CardTitle className="font-headline text-2xl mb-2">Find a Match</CardTitle>
              <CardDescription className="text-center font-body text-lg">
                Buddies can search for routes based on their destination, preferred timing, and days, with results shown on a map and list.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col">
            <CardHeader className="p-0">
               <Image
                  src="https://placehold.co/600x400.png"
                  alt="Securely booking a ride online"
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover rounded-t-lg"
                  data-ai-hint="secure payment"
                />
            </CardHeader>
            <CardContent className="p-6 text-center flex-grow flex flex-col">
              <CardTitle className="font-headline text-2xl mb-2">Book & Ride</CardTitle>
              <CardDescription className="text-center font-body text-lg">
                Securely book your ride, share costs transparently, and enjoy a greener commute together.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="py-16 bg-secondary/30 rounded-xl text-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-8">
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl font-headline font-semibold mb-6">
                Join the BroRide Community
              </h2>
              <p className="text-lg font-body mb-4 max-w-3xl mx-auto">
                BroRide is more than just a carpooling app. It's a community of like-minded individuals committed to making transportation more efficient, affordable, and environmentally friendly.
              </p>
              <p className="text-lg font-body mb-8 max-w-3xl mx-auto">
                By sharing rides, you contribute to reducing traffic congestion, lowering carbon emissions, and building a more connected community.
              </p>
              <Button asChild size="lg" className="font-headline bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/dashboard">
                  See Our Impact <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

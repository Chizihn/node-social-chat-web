import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { suggestedPeople } from "@/data";
import SuggestedPerson from "./SuggestedPerson";
import { Button } from "../ui/button";

const PeopleYouMayKnow = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">People You May Know</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {suggestedPeople.map((person) => (
            <SuggestedPerson key={person.id} user={person} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-sm" size="sm">
          View more
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PeopleYouMayKnow;

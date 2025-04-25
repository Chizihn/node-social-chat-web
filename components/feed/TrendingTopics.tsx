import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const TrendingTopics = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trending Topics</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="py-2 px-4 hover:bg-accent/20 cursor-pointer">
          <h4 className="text-sm font-medium">#TechConference2025</h4>
          <p className="text-xs text-muted-foreground">2.3K posts</p>
        </div>
        <Separator />
        <div className="py-2 px-4 hover:bg-accent/20 cursor-pointer">
          <h4 className="text-sm font-medium">#AIInnovation</h4>
          <p className="text-xs text-muted-foreground">1.8K posts</p>
        </div>
        <Separator />
        <div className="py-2 px-4 hover:bg-accent/20 cursor-pointer">
          <h4 className="text-sm font-medium">#DigitalNomad</h4>
          <p className="text-xs text-muted-foreground">950 posts</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-sm" size="sm">
          See all trending topics
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrendingTopics;

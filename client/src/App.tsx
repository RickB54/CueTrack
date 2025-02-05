import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Drills from "@/pages/drills";
import DrillDetail from "@/pages/drill/[id]";
import Playlists from "@/pages/playlists";
import Achievements from "@/pages/achievements";
import Analytics from "@/pages/analytics";
import Journal from "@/pages/journal";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/drills" component={Drills} />
      <Route path="/drill/:id" component={DrillDetail} />
      <Route path="/playlists" component={Playlists} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/journal" component={Journal} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;